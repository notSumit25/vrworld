'use client'; // Ensures this code runs client-side

import { useEffect, useState } from 'react';
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';

export default function LiveRoom() {
  const room = 'quickstart-room'; // Example room name
  const name = 'quickstart-user'; // Example user name
  const [token, setToken] = useState('');

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
      token={token}
      serverUrl={process.env.LIVEKIT_URL} // Your LiveKit server URL
      video={true}
      audio={true}
      data-lk-theme="default"
      style={{ height: '100vh' }}
    >
      {/* The MyVideoConference component is where the video tiles are displayed */}
      <MyVideoConference />
      {/* Audio renderer for room-wide audio */}
      <RoomAudioRenderer />
      {/* Control bar for user actions like audio/video toggle */}
      <ControlBar />
    </LiveKitRoom>
  );
}

// The custom video conference component that renders the tracks
function MyVideoConference() {
  // `useTracks` is used to subscribe to camera and screen share tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      {/* ParticipantTile is used to render the individual video tiles */}
      <ParticipantTile />
    </GridLayout>
  );
}
