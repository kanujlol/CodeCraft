import React, { useRef, useEffect } from 'react';

function VideoStream({ stream, muted, mirrored }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const videoStyle = {
    width: '100%',
    height: 'auto',
    backgroundColor: 'black',
    borderRadius: '8px',
    transform: mirrored ? 'scaleX(-1)' : 'none',
    objectFit: 'cover'
  };

  return (
    <video 
      ref={videoRef}
      style={videoStyle}
      autoPlay 
      playsInline
      muted={muted}
    />
  );
}

export default VideoStream;