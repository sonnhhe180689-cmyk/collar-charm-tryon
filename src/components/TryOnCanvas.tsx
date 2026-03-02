import { useState, useRef, useEffect } from 'react';
import { Upload, Move, ZoomIn, ZoomOut, RotateCcw, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { necklaceImages } from '@/lib/necklaceImages';

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
  const [selectedNecklace, setSelectedNecklace] = useState<Necklace | null>(null);
  const [necklacePosition, setNecklacePosition] = useState({ x: 50, y: 60 });
  const [necklaceScale, setNecklaceScale] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast.success('Đã tải ảnh thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

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

  const selectedNecklaceImageUrl = selectedNecklace 
    ? getActualImage(selectedNecklace.overlay_image_url || selectedNecklace.image_url)
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
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">Tải ảnh của bạn lên</p>
            <p className="text-muted-foreground/70 text-sm mt-2">
              Nhấn để chọn hoặc kéo thả ảnh
            </p>
          </div>
        )}
        <input
          id="tryon-upload-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
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
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-muted-foreground"
          >
            <Upload className="w-4 h-4 mr-2" />
            Đổi Ảnh Khác
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
