import React, { useState, useEffect, useRef } from 'react';

const MicOnIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 7.5v3.75m-3.75-3.75h7.5" />
  </svg>
);

const MicOffIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72M4.5 12h9" />
  </svg>
);

const VideoOnIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const VideoOffIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5A2.25 2.25 0 012.25 16.5V7.5A2.25 2.25 0 014.5 5.25H12m3-3l-3 3m0 0l-3-3m3 3v12.75" />
  </svg>
);

const ScreenShareIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default function ConnectPage() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loadingMedia, setLoadingMedia] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const screenTrackRef = useRef(null);

  const supportsGetUserMedia = () => typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  const supportsGetDisplayMedia = () => typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;

  const getMedia = async () => {
    setError('');
    if (!supportsGetUserMedia()) {
      setError('getUserMedia is not supported in this environment.');
      return null;
    }
    try {
      setLoadingMedia(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0] || null;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setIsMicOn(stream.getAudioTracks().some(t => t.enabled));
      setIsCameraOn(stream.getVideoTracks().some(t => t.enabled));
      return stream;
    } catch (err) {
      setError('Error accessing media devices. ' + (err && err.message ? err.message : ''));
      return null;
    } finally {
      setLoadingMedia(false);
    }
  };

  const stopAndClearLocalStream = () => {
    if (screenTrackRef.current) {
      try { screenTrackRef.current.stop(); } catch {}
      screenTrackRef.current = null;
    }
    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach(t => { try { t.stop(); } catch {} });
      } catch {}
      localStreamRef.current = null;
    }
    cameraTrackRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setIsCameraOn(true);
    setIsMicOn(true);
    setIsScreenSharing(false);
  };

  const handleCreateAndJoinCall = async () => {
    setError('');
    const newRoomCode = Math.random().toString(36).substring(2, 10);
    setRoomCode(newRoomCode);
    let stream = localStreamRef.current;
    if (!stream) stream = await getMedia();
    if (!stream) return;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
    setIsInCall(true);
  };

  const handleJoinCall = async () => {
    setError('');
    if (roomCode.trim() === '') {
      alert('Please enter a room code.');
      return;
    }
    let stream = localStreamRef.current;
    if (!stream) stream = await getMedia();
    if (!stream) return;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
    setIsInCall(true);
  };

  const handleLeaveCall = () => {
    stopAndClearLocalStream();
    setIsInCall(false);
    setRoomCode('');
  };

  const toggleMicrophone = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) return;
    const newEnabled = !audioTracks[0].enabled;
    audioTracks.forEach(t => { t.enabled = newEnabled; });
    setIsMicOn(newEnabled);
  };

  const toggleCamera = () => {
    if (isScreenSharing) return;
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTracks = stream.getVideoTracks();
    if (!videoTracks.length) return;
    const newEnabled = !videoTracks[0].enabled;
    videoTracks.forEach(t => { t.enabled = newEnabled; });
    setIsCameraOn(newEnabled);
  };

  const stopScreenShareInternal = () => {
    const sTrack = screenTrackRef.current;
    const stream = localStreamRef.current;
    if (sTrack && stream) {
      try { sTrack.stop(); } catch {}
      try { stream.removeTrack(sTrack); } catch {}
      screenTrackRef.current = null;
    }
    if (cameraTrackRef.current && stream) {
      try { stream.addTrack(cameraTrackRef.current); } catch {}
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = localStreamRef.current;
    setIsScreenSharing(false);
    setIsCameraOn(true);
  };

  const toggleScreenShare = async () => {
    setError('');
    if (!supportsGetDisplayMedia()) {
      setError('getDisplayMedia is not supported in this environment.');
      return;
    }
    if (!isScreenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const sTrack = displayStream.getVideoTracks()[0];
        if (!sTrack) return;
        screenTrackRef.current = sTrack;
        let stream = localStreamRef.current;
        if (!stream) {
          stream = new MediaStream();
          localStreamRef.current = stream;
        }
        if (cameraTrackRef.current) {
          try { stream.removeTrack(cameraTrackRef.current); } catch {}
        }
        try { stream.addTrack(sTrack); } catch {}
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
        setIsScreenSharing(true);
        setIsCameraOn(false);
        sTrack.onended = () => {
          stopScreenShareInternal();
        };
      } catch (err) {
        setError('Error starting screen share. ' + (err && err.message ? err.message : ''));
      }
    } else {
      stopScreenShareInternal();
    }
  };

  useEffect(() => {
    return () => {
      stopAndClearLocalStream();
    };
  }, []);

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-12">
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center lg:text-left text-slate-900">Premium video meetings.</h1>
          <p className="text-slate-600 mb-4 text-center lg:text-left text-lg">Now available for everyone.</p>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <button onClick={handleCreateAndJoinCall} className="flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors font-semibold rounded-lg px-5 py-3 shadow-md hover:shadow-lg">
              <PlusIcon className="w-5 h-5 mr-2" />
              New Meeting
            </button>
            <div className="relative w-full sm:flex-1">
              <input
                type="text"
                placeholder="Enter a code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 rounded-lg pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleJoinCall} disabled={!roomCode} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 font-semibold hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                Join
              </button>
            </div>
          </div>

          <div className="mt-4">
            {!localStreamRef.current && (
              <button onClick={getMedia} disabled={loadingMedia} className="bg-gray-200 px-4 py-2 rounded-md">
                {loadingMedia ? 'Enabling...' : 'Enable Camera & Microphone'}
              </button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full rounded-lg shadow-2xl bg-slate-300 aspect-video object-cover transform -scale-x-100"></video>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            <button onClick={toggleMicrophone} className={`p-3 rounded-full text-white ${isMicOn ? 'bg-slate-600/80' : 'bg-red-600'}`}>
              {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
            </button>
            <button onClick={toggleCamera} className={`p-3 rounded-full text-white ${isCameraOn ? 'bg-slate-600/80' : 'bg-red-600'}`}>
              {isCameraOn ? <VideoOnIcon /> : <VideoOffIcon />}
            </button>
          </div>
        </div>
      </div>

      {isInCall && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
          <div className="w-full max-w-6xl pointer-events-auto mb-8">
            <div className="bg-slate-200 rounded-lg p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-40 h-28 md:w-56 md:h-36 border-4 border-white rounded-lg overflow-hidden">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                </div>
                <div>
                  <div className="font-semibold">You</div>
                  <div className="text-sm text-slate-600">Room: {roomCode}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={toggleMicrophone} title={isMicOn ? 'Mute' : 'Unmute'} className={`p-3 rounded-full transition-colors ${isMicOn ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                  {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
                </button>
                <button onClick={toggleCamera} title={isCameraOn ? 'Turn off camera' : 'Turn on camera'} className={`p-3 rounded-full transition-colors ${isCameraOn ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-red-500 hover:bg-red-600 text-white'}`} disabled={isScreenSharing}>
                  {isCameraOn ? <VideoOnIcon /> : <VideoOffIcon />}
                </button>
                <button onClick={toggleScreenShare} title={isScreenSharing ? 'Stop sharing' : 'Present screen'} className={`p-3 rounded-full transition-colors ${isScreenSharing ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                  <ScreenShareIcon />
                </button>
                <button onClick={handleLeaveCall} title="Leave call" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full p-4 shadow-lg transition-colors">
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
