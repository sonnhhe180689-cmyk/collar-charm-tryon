import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TryOnCanvas from '@/components/TryOnCanvas';
import { Upload, Sparkles, Move, ShoppingCart } from 'lucide-react';

interface Necklace {
  id: string;
  name: string;
  overlay_image_url: string | null;
  image_url: string;
}

const TryOn = () => {
  const [searchParams] = useSearchParams();
  const selectedNecklaceId = searchParams.get('necklace') || undefined;
  const [necklaces, setNecklaces] = useState<Necklace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNecklaces = async () => {
      const { data, error } = await supabase
        .from('necklaces')
        .select('id, name, overlay_image_url, image_url')
        .eq('in_stock', true);

      if (!error && data) {
        setNecklaces(data);
      }
      setLoading(false);
    };

    fetchNecklaces();
  }, []);

  const steps = [
    { icon: Upload, title: 'Tải Ảnh', description: 'Tải ảnh chân dung từ máy lên' },
    { icon: Sparkles, title: 'Chọn Vòng', description: 'Chọn mẫu vòng cổ yêu thích' },
    { icon: Move, title: 'Điều Chỉnh', description: 'Kéo và phóng to vòng cổ' },
    { icon: ShoppingCart, title: 'Mua Hàng', description: 'Thêm vào giỏ và thanh toán' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] mb-4">
              Thử Vòng Cổ Trực Tuyến
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Tải ảnh của bạn lên và xem thử các mẫu vòng cổ yêu thích ngay trên màn hình
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {steps.map((step, index) => (
              <button
                key={index}
                className="text-center p-4 border border-border hover:border-primary/50 transition-colors"
                onClick={() => {
                  if (index === 0) {
                    document.getElementById('tryon-upload-input')?.click();
                  } else if (index === 1) {
                    document.getElementById('necklace-gallery')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (index === 2) {
                    document.getElementById('necklace-controls')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (index === 3) {
                    window.location.href = '/cart';
                  }
                }}
              >
                <step.icon className="w-6 h-6 text-primary mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-xs font-medium tracking-[0.1em] uppercase mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-[11px]">{step.description}</p>
              </button>
            ))}
          </div>

          {/* Try On Canvas */}
          {loading ? (
            <div className="max-w-md mx-auto aspect-[3/4] bg-muted animate-pulse" />
          ) : (
            <TryOnCanvas necklaces={necklaces} selectedNecklaceId={selectedNecklaceId} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TryOn;
