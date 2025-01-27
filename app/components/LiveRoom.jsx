'use client'; // Ensures this code runs client-side

import { useEffect, useState } from 'react';
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';

export default function LiveRoom({ roomId, userName }) {
  console.log("LiveRoom", roomId, userName);
  const room = roomId;
  const name = userName;
  const [token, setToken] = useState('');
  const [cameraOn, setCameraOn] = useState(true); // Camera toggle state

  // Fetch token on page load
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(`/api/token?room=${room}&username=${name}`);
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    getToken();
  }, []);

  if (!token) {
    return <div>Loading token...</div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl='wss://vrworld-1h0vzsvd.livekit.cloud'
      data-lk-theme="default"
      style={{ height: '100vh', width: '100%', position: 'relative' }}
    >
      <MyVideoConference cameraOn={cameraOn} setCameraOn={setCameraOn} />
      <RoomAudioRenderer />
      <ControlBar>
        {/* Toggle Camera Button */}
        <button
          onClick={() => setCameraOn((prev) => !prev)}
          className="lk-button"
        >
          {cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        </button>
      </ControlBar>
    </LiveKitRoom>
  );
}

// The custom video conference component that renders the tracks
function MyVideoConference({ cameraOn, setCameraOn }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  );

  const localParticipant = useLocalParticipant();

  // Handle camera toggle when the state changes
  useEffect(() => {
    if (localParticipant && localParticipant.isLocal) {
      const videoTrack = localParticipant.tracks.find(track => track.source === Track.Source.Camera);
      
      if (videoTrack) {
        console.log('Video track:', videoTrack);
        // Toggle the video track enabled/disabled
        if (cameraOn) {
          videoTrack.isMuted = false;  // Unmute the camera (turn on)
        } else {
          videoTrack.isMuted = true;   // Mute the camera (turn off)
        }
      }
    }
  }, [cameraOn, localParticipant]);

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
