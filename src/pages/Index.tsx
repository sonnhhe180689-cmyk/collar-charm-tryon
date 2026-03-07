import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import NecklaceCard from '@/components/NecklaceCard';
import { ArrowRight, Gem, Truck, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Necklace {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  material: string | null;
  category: string | null;
}

const Index = () => {
  const [featuredNecklaces, setFeaturedNecklaces] = useState<Necklace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNecklaces = async () => {
      const { data, error } = await supabase
        .from('necklaces')
        .select('*')
        .eq('in_stock', true)
        .limit(4);

      if (!error && data) {
        setFeaturedNecklaces(data);
      }
      setLoading(false);
    };

    fetchNecklaces();
  }, []);

  const features = [
    {
      icon: Gem,
      title: 'Chất Lượng Cao Cấp',
      description: 'Nguyên liệu thật 100%, được chứng nhận bởi các tổ chức uy tín',
    },
    {
      icon: Truck,
      title: 'Giao Hàng Toàn Quốc',
      description: 'Miễn phí ship cho đơn hàng từ 2.000.000đ',
    },
    {
      icon: Shield,
      title: 'Bảo Hành Trọn Đời',
      description: 'Cam kết đổi trả trong 30 ngày',
    },
    {
      icon: Sparkles,
      title: 'Thử Trước Khi Mua',
      description: 'Công nghệ thử vòng cổ 2D độc đáo',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />

        {/* Shop by Category heading */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl md:text-3xl font-light tracking-[0.1em] mb-16">
              Bộ Sưu Tập
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted mb-4" />
                    <div className="h-3 bg-muted w-3/4 mx-auto mb-2" />
                    <div className="h-3 bg-muted w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredNecklaces.map((necklace) => (
                  <NecklaceCard
                    key={necklace.id}
                    id={necklace.id}
                    name={necklace.name}
                    description={necklace.description}
                    price={necklace.price}
                    imageUrl={necklace.image_url}
                    material={necklace.material}
                    category={necklace.category}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-14">
              <Link to="/products" className="inline-block btn-outline-luxury">
                Xem Tất Cả
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-xs font-medium tracking-[0.15em] uppercase mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Try On CTA */}
        <section className="py-24 bg-tiffany-light">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-light tracking-[0.05em] mb-4 text-foreground">
              Trải Nghiệm Thử Vòng Cổ
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-sm leading-relaxed">
              Tải ảnh của bạn lên và thử ngay các mẫu vòng cổ yêu thích. Xem trước khi mua để chắc chắn bạn đã chọn đúng.
            </p>
            <Link to="/try-on" className="inline-block btn-luxury">
              Thử Ngay
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
