import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Move, ZoomIn, ZoomOut, RotateCcw, Download, ChevronLeft, ChevronRight, Camera, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { necklaceImages } from '@/lib/necklaceImages';
import { removeWhiteBackground } from '@/lib/removeBackground';

interface Necklace {
  id: string;
  name: string;
  overlay_image_url: string | null;
  image_url: string;
}

interface TryOnCanvasProps {
  necklaces: Necklace[];
  selectedNecklaceId?: string;
}

const TryOnCanvas = ({ necklaces, selectedNecklaceId }: TryOnCanvasProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedOverlays, setProcessedOverlays] = useState<Record<string, string>>({});
  const [selectedNecklace, setSelectedNecklace] = useState<Necklace | null>(null);
  const [necklacePosition, setNecklacePosition] = useState({ x: 50, y: 60 });
  const [necklaceScale, setNecklaceScale] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedNecklaceId && necklaces.length > 0) {
      const found = necklaces.find(n => n.id === selectedNecklaceId);
      if (found) setSelectedNecklace(found);
    } else if (necklaces.length > 0 && !selectedNecklace) {
      setSelectedNecklace(necklaces[0]);
    }
  }, [selectedNecklaceId, necklaces, selectedNecklace]);

  const getActualImage = (imageKey: string | null) => {
    if (!imageKey) return null;
    return necklaceImages[imageKey] || imageKey;
  };

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      // getUserMedia must be called directly in click handler for Safari
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      // Use requestAnimationFrame to ensure video element is mounted after state update
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (err) {
      setCameraError('Không thể truy cập camera. Vui lòng cấp quyền camera.');
      toast.error('Không thể mở camera');
    }
  }, []);

  // Fallback: assign stream when video element mounts
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setUploadedImage(dataUrl);
      stopCamera();
      toast.success('Đã chụp ảnh thành công!');
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
        stopCamera();
        toast.success('Đã tải ảnh thành công!');
      };
      reader.readAsDataURL(file);
    }
  }, [stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNecklacePosition({
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setNecklacePosition({
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setNecklacePosition({ x: 50, y: 60 });
    setNecklaceScale(100);
  };

  const handleDownload = () => {
    toast.success('Tính năng tải ảnh sẽ sớm được cập nhật!');
  };

  const selectPrevNecklace = () => {
    if (!selectedNecklace || necklaces.length === 0) return;
    const currentIndex = necklaces.findIndex(n => n.id === selectedNecklace.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : necklaces.length - 1;
    setSelectedNecklace(necklaces[prevIndex]);
  };

  const selectNextNecklace = () => {
    if (!selectedNecklace || necklaces.length === 0) return;
    const currentIndex = necklaces.findIndex(n => n.id === selectedNecklace.id);
    const nextIndex = currentIndex < necklaces.length - 1 ? currentIndex + 1 : 0;
    setSelectedNecklace(necklaces[nextIndex]);
  };

  // Process necklace image to remove white background
  const rawNecklaceUrl = selectedNecklace
    ? getActualImage(selectedNecklace.overlay_image_url || selectedNecklace.image_url)
    : null;

  useEffect(() => {
    if (!rawNecklaceUrl || processedOverlays[rawNecklaceUrl]) return;
    removeWhiteBackground(rawNecklaceUrl).then((processed) => {
      setProcessedOverlays((prev) => ({ ...prev, [rawNecklaceUrl]: processed }));
    }).catch(() => {});
  }, [rawNecklaceUrl, processedOverlays]);

  const selectedNecklaceImageUrl = rawNecklaceUrl
    ? processedOverlays[rawNecklaceUrl] || rawNecklaceUrl
    : null;

  return (
    <div className="space-y-6">
      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="relative aspect-[3/4] max-w-md mx-auto bg-secondary rounded-2xl overflow-hidden shadow-elegant"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {uploadedImage ? (
          <>
            <img
              src={uploadedImage}
              alt="Your photo"
              className="w-full h-full object-cover"
            />
            {selectedNecklace && selectedNecklaceImageUrl && (
              <div
                className="absolute cursor-move select-none"
                style={{
                  left: `${necklacePosition.x}%`,
                  top: `${necklacePosition.y}%`,
                  transform: `translate(-50%, -50%) scale(${necklaceScale / 100})`,
                  width: '60%',
                  pointerEvents: 'auto',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <img
                  src={selectedNecklaceImageUrl}
                  alt={selectedNecklace.name}
                  className="w-full h-auto drop-shadow-lg"
                  draggable={false}
                />
              </div>
            )}
            {isDragging && (
              <div className="absolute inset-0 bg-primary/10 pointer-events-none flex items-center justify-center">
                <Move className="w-8 h-8 text-primary animate-pulse" />
              </div>
            )}
          </>
        ) : isCameraActive ? (
          <div className="w-full h-full relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg hover:scale-105 transition-transform"
              />
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={startCamera}
          >
            {cameraError ? (
              <>
                <VideoOff className="w-16 h-16 text-destructive mb-4" />
                <p className="text-destructive font-medium text-center px-4">{cameraError}</p>
              </>
            ) : (
              <>
                <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">Chụp ảnh chân dung</p>
                <p className="text-muted-foreground/70 text-sm mt-2">
                  Nhấn để mở camera và chụp ảnh
                </p>
              </>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        <input
          id="tryon-upload-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Controls */}
      {uploadedImage && (
        <div className="space-y-4 max-w-md mx-auto">
          {/* Necklace selector */}
          <div id="necklace-controls" className="flex items-center justify-between gap-4 p-4 bg-card rounded-xl shadow-card">
            <Button variant="ghost" size="icon" onClick={selectPrevNecklace}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <p className="font-serif font-medium">{selectedNecklace?.name}</p>
              <p className="text-muted-foreground text-sm">Kéo để di chuyển vòng cổ</p>
            </div>
            <Button variant="ghost" size="icon" onClick={selectNextNecklace}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Scale control */}
          <div className="p-4 bg-card rounded-xl shadow-card">
            <div className="flex items-center gap-4">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[necklaceScale]}
                onValueChange={(value) => setNecklaceScale(value[0])}
                min={50}
                max={150}
                step={5}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Kích thước: {necklaceScale}%
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 rounded-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt Lại
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 btn-luxury"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải Ảnh
            </Button>
          </div>

          {/* Change photo */}
          <Button
            variant="ghost"
            onClick={() => { setUploadedImage(null); startCamera(); }}
            className="w-full text-muted-foreground"
          >
            <Camera className="w-4 h-4 mr-2" />
            Chụp Ảnh Khác
          </Button>
        </div>
      )}

      {/* Necklace Gallery */}
      <div id="necklace-gallery" className="pt-6 border-t border-border">
        <h3 className="font-serif text-lg mb-4">Chọn Vòng Cổ</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {necklaces.map((necklace) => {
            const imgUrl = getActualImage(necklace.image_url);
            return (
              <button
                key={necklace.id}
                onClick={() => setSelectedNecklace(necklace)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedNecklace?.id === necklace.id
                    ? 'border-primary shadow-elegant'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <img
                  src={imgUrl || ''}
                  alt={necklace.name}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TryOnCanvas;
