import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { loadFaceModels } from '../utils/faceRecognition';
import { ShieldAlert, Loader2, RefreshCw } from 'lucide-react';

interface FaceCameraProps {
  onCapture: (descriptor: Float32Array) => void;
  isActive: boolean;
  mode: 'register' | 'verify';
}

// Global cached promise to avoid reloading models on remounts
let modelsLoadingPromise: Promise<void> | null = null;

export const FaceCamera: React.FC<FaceCameraProps> = ({ onCapture, isActive, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [faceStatus, setFaceStatus] = useState<'no_face' | 'multiple_faces' | 'ready' | 'capturing'>('no_face');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);

  const requestRef = useRef<number | null>(null);
  const stableCounterRef = useRef<number>(0);

  // Initialize and load models & camera
  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        setLoading(true);
        setLoadingError(null);

        // Load models if not already loading/loaded
        if (!modelsLoadingPromise) {
          modelsLoadingPromise = loadFaceModels();
        }
        await modelsLoadingPromise;

        if (!active) return;

        // Start video stream
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to initialize FaceCamera:', err);
        if (active) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setLoadingError('Camera permission denied. Please allow camera access in your browser settings.');
          } else {
            setLoadingError('Could not access camera. Please make sure it is connected and not in use by another app.');
          }
          setLoading(false);
        }
      }
    };

    if (isActive) {
      init();
    }

    return () => {
      active = false;
      // Stop media stream tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      // Cancel animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive]);

  const lastDetectionTimeRef = useRef<number>(0);

  // Run the detection loop when video plays
  useEffect(() => {
    if (loading || !isActive || !stream || !videoRef.current) return;

    let isRunning = true;

    const runDetection = async () => {
      if (!isRunning || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Check if video metadata is loaded
      if (video.paused || video.ended || video.readyState < 2) {
        requestRef.current = requestAnimationFrame(runDetection);
        return;
      }

      // Throttle detection to run every 150ms for performance
      const now = Date.now();
      if (now - lastDetectionTimeRef.current < 150) {
        requestRef.current = requestAnimationFrame(runDetection);
        return;
      }
      lastDetectionTimeRef.current = now;

      // Match canvas dimensions to video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Detect all faces with optimized parameters
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 320, // Increased size for better distance/angle accuracy
          scoreThreshold: 0.35, // Lowered threshold for reliable detection in low light
        });

        try {
          const detections = await faceapi
            .detectAllFaces(video, options)
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (!isRunning) return;

          const neededFrames = 8; // Reduced frames (~1.2 seconds of stable scanning)

          if (detections.length === 0) {
            setFaceStatus('no_face');
            // Graceful decay: decrement instead of hard resetting to 0
            stableCounterRef.current = Math.max(0, stableCounterRef.current - 1);
            setProgress(Math.floor((stableCounterRef.current / neededFrames) * 100));
          } else if (detections.length > 1) {
            setFaceStatus('multiple_faces');
            // Graceful decay
            stableCounterRef.current = Math.max(0, stableCounterRef.current - 1);
            setProgress(Math.floor((stableCounterRef.current / neededFrames) * 100));
          } else {
            // Exactly one face detected
            const detection = detections[0];
            setFaceStatus('ready');

            // Draw premium Paytm-style glowing landmarks
            const landmarks = detection.landmarks;
            const pts = landmarks.positions;

            ctx.fillStyle = 'rgba(0, 185, 241, 0.7)';
            ctx.shadowColor = '#00B9F1';
            ctx.shadowBlur = 6;
            
            // Draw points
            for (let i = 0; i < pts.length; i++) {
              ctx.beginPath();
              ctx.arc(pts[i].x, pts[i].y, 2, 0, 2 * Math.PI);
              ctx.fill();
            }

            // Draw connecting lines for outline face structure
            ctx.strokeStyle = 'rgba(0, 185, 241, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Jawline
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i <= 16; i++) ctx.lineTo(pts[i].x, pts[i].y);
            // Eyebrows
            ctx.moveTo(pts[17].x, pts[17].y);
            for (let i = 18; i <= 21; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.moveTo(pts[22].x, pts[22].y);
            for (let i = 23; i <= 26; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();

            // Draw bounding box
            const box = detection.detection.box;
            ctx.strokeStyle = 'rgba(0, 185, 241, 0.6)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            ctx.shadowBlur = 0; // reset

            // Progress tracking
            stableCounterRef.current += 1;
            const percent = Math.min(100, Math.floor((stableCounterRef.current / neededFrames) * 100));
            setProgress(percent);

            if (percent >= 100) {
              setFaceStatus('capturing');
              isRunning = false; // Stop loop
              // Trigger capture
              onCapture(detection.descriptor);
              return;
            }
          }
        } catch (e) {
          console.warn('Face detection step error:', e);
        }
      }

      if (isRunning) {
        requestRef.current = requestAnimationFrame(runDetection);
      }
    };

    requestRef.current = requestAnimationFrame(runDetection);

    return () => {
      isRunning = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [loading, isActive, stream]);



  return (
    <div className="w-full relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[360px] aspect-[4/3]">
      
      {/* 1. Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 text-center p-6 space-y-3">
          <Loader2 className="w-8 h-8 text-[#00B9F1] animate-spin" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Loading Security Hardware</h4>
          <p className="text-xs text-slate-400 max-w-[280px]">Loading computer vision models and starting webcam feed...</p>
        </div>
      )}

      {/* 2. Error Overlay */}
      {loadingError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Camera Access Required</h4>
          <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed">{loadingError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold border border-slate-800 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Portal</span>
          </button>
        </div>
      )}

      {/* 3. Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover transform -scale-x-100"
      />

      {/* 4. Canvas Landmarks Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none"
      />

      {/* 5. Scanning Beam Overlay (when ready/scanning) */}
      {faceStatus === 'ready' && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00B9F1] to-transparent shadow-[0_0_12px_#00B9F1] animate-scan-line pointer-events-none" />
      )}

      {/* 6. Bottom HUD Overlay */}
      {!loading && !loadingError && (
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-2">
          
          {/* Progress Ring / Bar */}
          {faceStatus === 'ready' && (
            <div className="w-full max-w-[200px] h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-[#00B9F1] rounded-full transition-all duration-75 shadow-[0_0_8px_#00B9F1]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Status Label */}
          <div className="px-3 py-1.5 rounded-full bg-black/60 border border-slate-800 text-[10px] uppercase font-bold tracking-widest text-center shadow-lg">
            {faceStatus === 'no_face' && (
              <span className="text-slate-400 animate-pulse">Position your face in the frame</span>
            )}
            {faceStatus === 'multiple_faces' && (
              <span className="text-amber-400">Multiple faces detected • Align one person</span>
            )}
            {faceStatus === 'ready' && (
              <span className="text-[#00B9F1] font-black">
                {mode === 'register' ? `Registering Face... ${progress}%` : `Verifying Identity... ${progress}%`}
              </span>
            )}
            {faceStatus === 'capturing' && (
              <span className="text-emerald-400 font-black animate-pulse">Processing descriptor...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default FaceCamera;
