/**
 * Enhanced LiveRoom component with proximity-based voice/video
 *
 * File location: components/ProximityLiveRoom.jsx
 */

"use client";

import { useEffect, useState } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useProximityLiveKit } from "../../hooks/useProximityLiveKit.js";

export default function ProximityLiveRoom({
  roomId,
  userName,
  socket,
  currentUser,
  proximitySettings,
}) {
  const [token, setToken] = useState("");
  const [cameraOn, setCameraOn] = useState(true);

  // Fetch token on page load
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(
          `/api/token?room=${roomId}&username=${userName}&clerkId=${
            currentUser.clerkId || userName
          }`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    if (roomId && userName) {
      getToken();
    }
  }, [roomId, userName]);

  if (!token) {
    return <div>Loading token...</div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
      data-lk-theme="default"
      style={{
        height: "300px",
        width: "400px",
        position: "absolute",
        bottom: "10%",
        right: "10%",
        zIndex: 1000,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        backgroundColor: "rgba(0,0,0,0.8)",
      }}
    >
      <ProximityVideoConference
        cameraOn={cameraOn}
        setCameraOn={setCameraOn}
        socket={socket}
        currentUser={currentUser}
        proximitySettings={proximitySettings}
      />
      <RoomAudioRenderer />
      <ControlBar variation="minimal" />
    </LiveKitRoom>
  );
}

// Enhanced video conference component with proximity logic
function ProximityVideoConference({
  cameraOn,
  setCameraOn,
  socket,
  currentUser,
  proximitySettings,
}) {
  // Use the proximity hook
  const {
    proximityState,
    nearbyUsers,
    subscribedUsers,
    isProcessingUpdate,
    updateUserSpatialPosition,
  } = useProximityLiveKit({
    socket,
    currentUser,
    settings: proximitySettings,
  });

  // Get all tracks - we'll filter based on proximity
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      onlySubscribed: true, // Only get subscribed tracks
    }
  );

  const localParticipant = useLocalParticipant();

  // Filter tracks to show local user + nearby users
  const nearbyTracks = tracks.filter((trackRef) => {
    // Always show local participant
    if (trackRef.participant?.isLocal) return true;

    // Show nearby users based on their identity
    const participantIdentity = trackRef.participant?.identity;
    if (!participantIdentity) return false;

    // Check if this participant is in our nearby list
    const isNearby = nearbyUsers.some(
      (nearbyUser) =>
        nearbyUser.clerkId === participantIdentity ||
        nearbyUser.name === trackRef.participant?.name
    );

    console.log(
      `Track for ${participantIdentity} (${trackRef.participant?.name}): nearby=${isNearby}`
    );
    return isNearby;
  });

  // Handle camera toggle when the state changes
  useEffect(() => {
    if (localParticipant && localParticipant.isLocal) {
      const videoTrack = localParticipant.tracks.find(
        (track) => track.source === Track.Source.Camera
      );

      if (videoTrack) {
        if (cameraOn) {
          videoTrack.isMuted = false;
        } else {
          videoTrack.isMuted = true;
        }
      }
    }
  }, [cameraOn, localParticipant]);

  // Update spatial audio when user moves
  useEffect(() => {
    if (currentUser.x !== undefined && currentUser.y !== undefined) {
      updateUserSpatialPosition(currentUser.x, currentUser.y);
    }
  }, [currentUser.x, currentUser.y, updateUserSpatialPosition]);

  // Debug logging
  useEffect(() => {
    console.log("🎥 Video Debug:", {
      nearbyUsers: nearbyUsers.length,
      totalTracks: tracks.length,
      filteredTracks: nearbyTracks.length,
      subscribedUsers: subscribedUsers.length,
      nearbyUserNames: nearbyUsers.map((u) => u.name),
      trackParticipants: tracks.map((t) => ({
        name: t.participant?.name,
        identity: t.participant?.identity,
        isLocal: t.participant?.isLocal,
      })),
    });
  }, [nearbyUsers, tracks, nearbyTracks, subscribedUsers]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Proximity indicator */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 10,
        }}
      >
        🎙️ Nearby: {nearbyUsers.length} | Tracks: {nearbyTracks.length}
      </div>

      {/* Processing indicator */}
      {isProcessingUpdate && (
        <div
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            background: "rgba(255,165,0,0.8)",
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            zIndex: 10,
          }}
        >
          Updating...
        </div>
      )}

      <GridLayout
        tracks={nearbyTracks}
        style={{ height: "calc(100% - 40px)" }} // Account for control bar
      >
        <ParticipantTile />
      </GridLayout>
    </div>
  );
}
