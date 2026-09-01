import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";

interface VideoCallRoomProps {
  callId: string;
  channelName: string;
  appId: string;
  token: string;
  durationMinutes: number;
}

const VideoCallRoom = ({ callId, channelName, appId, token, durationMinutes }: VideoCallRoomProps) => {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [callStarted, setCallStarted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const clientRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeCall();
    startTimer();

    return () => {
      endCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      // For development, we'll use a simple WebRTC implementation
      // In production, integrate Agora SDK: npm install agora-rtc-sdk-ng
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      
      // Display local video
      if (localVideoRef.current) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        localVideoRef.current.appendChild(video);
      }

      setCallStarted(true);
      toast({
        title: "Call Started",
        description: "Video call is now active",
      });

      // Join call on backend
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/video-calls/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          call_id: callId,
          user_role: 'PATIENT',
        }),
      });

    } catch (error) {
      console.error("Error initializing call:", error);
      toast({
        title: "Call Failed",
        description: "Could not access camera/microphone",
        variant: "destructive",
      });
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track: MediaStreamTrack) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track: MediaStreamTrack) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const endCall = async () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }

    // End call on backend
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/video-calls/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          call_id: callId,
        }),
      });
    } catch (error) {
      console.error("Error ending call:", error);
    }

    toast({
      title: "Call Ended",
      description: "Thank you for using our video consultation service",
    });

    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-shell flex min-h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-card/70 p-4 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <Video className="h-5 w-5" />
            <span className="font-semibold">Video Consultation</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Remote Video (Doctor) */}
        <Card className="flex min-h-[400px] items-center justify-center overflow-hidden border-white/[0.08] bg-black/30 dark:bg-black/35">
          <div ref={remoteVideoRef} className="w-full h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Waiting for doctor to join...</p>
            </div>
          </div>
        </Card>

        {/* Local Video (Patient) */}
        <Card className="relative min-h-[400px] overflow-hidden border-white/[0.08] bg-black/30 dark:bg-black/35">
          <div ref={localVideoRef} className="w-full h-full rounded-lg overflow-hidden" />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <VideoOff className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 border-t border-white/[0.08] bg-card/70 p-6 backdrop-blur-2xl">
        <Button
          onClick={toggleVideo}
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          className="rounded-full"
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        <Button
          onClick={toggleAudio}
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          className="rounded-full"
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          onClick={endCall}
          variant="destructive"
          size="lg"
          className="rounded-full"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCallRoom;
