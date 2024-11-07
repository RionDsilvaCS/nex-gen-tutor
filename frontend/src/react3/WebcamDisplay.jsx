import React, { useEffect, useRef, useState } from 'react';
import './Camera.css';

const WebcamDisplay = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState('Waiting...');
  const [inferenceTime, setInferenceTime] = useState(0);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to access webcam');
      console.error('Error accessing webcam:', err);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw the current video frame
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert to blob
    try {
      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/jpeg')
      );

      // Create FormData and append the blob
      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');

      // Send to API
      const response = await fetch('http://localhost:8005/emotion-rec', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setInferenceTime(data.time);
    } catch (err) {
      console.error('Error capturing/sending image:', err);
      setPrediction('Error processing image');
      setInferenceTime(0);
    }
  };

  useEffect(() => {
    startWebcam();

    // Set up interval for capturing images
    const intervalId = setInterval(captureImage, 10000); // 10 seconds

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="webcam-container">
      {error ? (
        <div className="webcam-error">{error}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width={150}
            className="webcam-video"
          />
          <div className="webcam-text">{prediction}
            <div className="webcam-time">
              {inferenceTime.toFixed(2)}s
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WebcamDisplay;