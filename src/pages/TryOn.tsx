import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TryOnCanvas from '@/components/TryOnCanvas';
import { Sparkles, Camera, Move, ShoppingCart } from 'lucide-react';

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
    {
      icon: Camera,
      title: 'Tải Ảnh',
      description: 'Chọn ảnh chân dung của bạn',
    },
    {
      icon: Sparkles,
      title: 'Chọn Vòng',
      description: 'Chọn mẫu vòng cổ yêu thích',
    },
    {
      icon: Move,
      title: 'Điều Chỉnh',
      description: 'Kéo và phóng to vòng cổ',
    },
    {
      icon: ShoppingCart,
      title: 'Mua Hàng',
      description: 'Thêm vào giỏ và thanh toán',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Thử Vòng Cổ <span className="text-gradient-gold">Trực Tuyến</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tải ảnh của bạn lên và xem thử các mẫu vòng cổ yêu thích ngay trên màn hình
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {steps.map((step, index) => (
              <button
                key={index}
                className="text-center p-4 rounded-xl hover:bg-primary/5 transition-colors"
                onClick={() => {
                  if (index === 0) {
                    // Tải ảnh - trigger file upload in canvas
                    document.getElementById('tryon-upload-input')?.click();
                  } else if (index === 1) {
                    // Chọn vòng - scroll to gallery
                    document.getElementById('necklace-gallery')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (index === 2) {
                    // Điều chỉnh - scroll to controls
                    document.getElementById('necklace-controls')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (index === 3) {
                    // Mua hàng - navigate to cart
                    window.location.href = '/cart';
                  }
                }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-xs">{step.description}</p>
              </button>
            ))}
          </div>

          {/* Try On Canvas */}
          {loading ? (
            <div className="max-w-md mx-auto aspect-[3/4] bg-secondary rounded-2xl animate-pulse" />
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
