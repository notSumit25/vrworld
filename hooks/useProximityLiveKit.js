/**
 * React hook for proximity-based LiveKit subscriptions
 *
 * File location: hooks/useProximityLiveKit.js
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { useRoomContext, useParticipants } from "@livekit/components-react";
import { DEFAULT_PROXIMITY_SETTINGS } from "../lib/proximity/types.js";

/**
 * @typedef {Object} UseProximityLiveKitProps
 * @property {any} socket - Socket.IO client instance
 * @property {Object} currentUser
 * @property {number} currentUser.x
 * @property {number} currentUser.y
 * @property {string} [currentUser.clerkId]
 * @property {string} [currentUser.name]
 * @property {Partial<ProximitySettings>} [settings]
 */

export function useProximityLiveKit({ socket, currentUser, settings = {} }) {
  const finalSettings = { ...DEFAULT_PROXIMITY_SETTINGS, ...settings };
  const room = useRoomContext();
  const participants = useParticipants();

  const [proximityState, setProximityState] = useState({
    nearbyUsers: [],
    subscribedUsers: new Set(),
    audioLevels: new Map(),
    spatialPositions: new Map(),
    isProcessingUpdate: false,
  });

  const lastUpdateRef = useRef(0);
  const processingRef = useRef(false);

  // Convert 2D game coordinates to 3D spatial audio coordinates
  const convertToSpatialPosition = useCallback((x, y) => {
    // Scale down the coordinates for spatial audio (LiveKit expects smaller values)
    const scale = 0.01;
    return {
      x: x * scale,
      y: 0, // Keep Y at 0 for 2D game
      z: y * scale, // Map game Y to spatial Z
    };
  }, []);

  // Find LiveKit participant by clerkId or name
  const findParticipant = useCallback(
    (nearbyUser) => {
      console.log(`🔍 Looking for participant:`, nearbyUser);
      console.log(
        `📋 Available participants:`,
        participants.map((p) => ({
          identity: p.identity,
          name: p.name,
          isLocal: p.isLocal,
        }))
      );

      const participant = participants.find((p) => {
        // Skip local participant
        if (p.isLocal) return false;

        // Try matching by clerkId first (most reliable)
        if (nearbyUser.clerkId && p.identity === nearbyUser.clerkId) {
          console.log(`✅ Matched by clerkId: ${nearbyUser.clerkId}`);
          return true;
        }
        // Fall back to name matching
        if (
          nearbyUser.name &&
          (p.name === nearbyUser.name || p.identity === nearbyUser.name)
        ) {
          console.log(`✅ Matched by name: ${nearbyUser.name}`);
          return true;
        }
        return false;
      });

      if (!participant) {
        console.log(`❌ No participant found for:`, nearbyUser);
      }

      return participant || null;
    },
    [participants, room.localParticipant]
  );

  // Update LiveKit subscriptions based on proximity
  const updateSubscriptions = useCallback(
    async (nearbyUsers) => {
      if (!room || processingRef.current) return;

      processingRef.current = true;
      setProximityState((prev) => ({ ...prev, isProcessingUpdate: true }));

      try {
        const newSubscribedUsers = new Set();
        const newAudioLevels = new Map();
        const newSpatialPositions = new Map();

        // Limit to max subscriptions, prioritizing closest users
        const usersToSubscribe = nearbyUsers.slice(
          0,
          finalSettings.maxSubscriptions
        );

        // Update subscriptions for nearby users
        for (const nearbyUser of usersToSubscribe) {
          const participant = findParticipant(nearbyUser);

          if (participant) {
            const participantId = participant.identity;

            // Subscribe to this participant
            try {
              // For LiveKit, we don't need to manually subscribe - just track who should be visible
              // LiveKit automatically subscribes to all tracks by default
              newSubscribedUsers.add(participantId);
              newAudioLevels.set(participantId, nearbyUser.audioLevel);

              console.log(
                `✅ Added to nearby list: ${nearbyUser.name} (${participantId}) at distance ${nearbyUser.distance}`
              );

              // Store spatial position for future use
              if (finalSettings.spatialAudioEnabled) {
                const spatialPos = convertToSpatialPosition(
                  nearbyUser.x,
                  nearbyUser.y
                );
                newSpatialPositions.set(participantId, spatialPos);
              }
            } catch (error) {
              console.warn(
                `Failed to process participant ${participantId}:`,
                error
              );
            }
          }
        }

        // Track users who are no longer nearby (for logging)
        const currentlySubscribed = Array.from(proximityState.subscribedUsers);
        for (const participantId of currentlySubscribed) {
          if (!newSubscribedUsers.has(participantId)) {
            console.log(`❌ Removed from nearby list: ${participantId}`);
          }
        }

        setProximityState((prev) => ({
          ...prev,
          nearbyUsers,
          subscribedUsers: newSubscribedUsers,
          audioLevels: newAudioLevels,
          spatialPositions: newSpatialPositions,
          isProcessingUpdate: false,
        }));
      } catch (error) {
        console.error("Error updating LiveKit subscriptions:", error);
        setProximityState((prev) => ({ ...prev, isProcessingUpdate: false }));
      } finally {
        processingRef.current = false;
      }
    },
    [
      room,
      proximityState.subscribedUsers,
      finalSettings,
      findParticipant,
      convertToSpatialPosition,
    ]
  );

  // Handle proximity updates from Socket.IO
  const handleProximityUpdate = useCallback(
    (data) => {
      const now = Date.now();

      // Throttle updates to prevent excessive processing
      if (now - lastUpdateRef.current < finalSettings.updateInterval) {
        return;
      }

      lastUpdateRef.current = now;

      console.log(
        `📡 Proximity update: ${data.nearbyUsers.length} nearby users`
      );
      updateSubscriptions(data.nearbyUsers);
    },
    [updateSubscriptions, finalSettings.updateInterval]
  );

  // Set up Socket.IO event listener
  useEffect(() => {
    if (!socket) return;

    socket.on("proximityUpdate", handleProximityUpdate);

    return () => {
      socket.off("proximityUpdate", handleProximityUpdate);
    };
  }, [socket, handleProximityUpdate]);

  // Update spatial audio positions when user moves (optional enhancement)
  const updateUserSpatialPosition = useCallback(
    async (x, y) => {
      if (!room || !finalSettings.spatialAudioEnabled) return;

      try {
        const spatialPos = convertToSpatialPosition(x, y);

        // Note: Spatial audio positioning would need to be implemented with a custom audio processor
        // or LiveKit's spatial audio plugin. For now, we just store the position.
        console.log("Spatial position updated:", spatialPos);
      } catch (error) {
        console.warn("Failed to update spatial audio position:", error);
      }
    },
    [finalSettings.spatialAudioEnabled, convertToSpatialPosition]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Unsubscribe from all participants on cleanup
      if (proximityState.subscribedUsers.size > 0) {
        Array.from(proximityState.subscribedUsers).forEach((participantId) => {
          try {
            const participant = participants.find(
              (p) => p.identity === participantId
            );
            if (participant) {
              participant.audioTrackPublications.forEach((pub) => {
                if (pub.isSubscribed) {
                  pub.setSubscribed(false);
                }
              });
              participant.videoTrackPublications.forEach((pub) => {
                if (pub.isSubscribed) {
                  pub.setSubscribed(false);
                }
              });
            }
          } catch (error) {
            console.warn(
              `Cleanup: Failed to unsubscribe from ${participantId}:`,
              error
            );
          }
        });
      }
    };
  }, []); // Only run on unmount

  return {
    proximityState,
    nearbyUsers: proximityState.nearbyUsers,
    subscribedUsers: Array.from(proximityState.subscribedUsers),
    isProcessingUpdate: proximityState.isProcessingUpdate,
    updateUserSpatialPosition,
    settings: finalSettings,
  };
}
