import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import NecklaceCard from '@/components/NecklaceCard';
import { ArrowRight, Gem, Truck, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      description: 'Miễn phí ship cho đơn hàng từ 2.000.000đ, giao trong 2-5 ngày',
    },
    {
      icon: Shield,
      title: 'Bảo Hành Trọn Đời',
      description: 'Cam kết đổi trả trong 30 ngày, bảo hành miễn phí trọn đời',
    },
    {
      icon: Sparkles,
      title: 'Thử Trước Khi Mua',
      description: 'Công nghệ thử vòng cổ 2D độc đáo, xem ngay trên ảnh của bạn',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />

        {/* Features */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Sản Phẩm <span className="text-gradient-gold">Nổi Bật</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Những thiết kế được yêu thích nhất, mang đến vẻ đẹp thanh lịch và sang trọng cho mọi dịp
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card-luxury animate-pulse">
                    <div className="aspect-square bg-secondary rounded-xl mb-4" />
                    <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="text-center mt-12">
              <Link to="/products">
                <Button className="btn-luxury group">
                  Xem Tất Cả Sản Phẩm
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-foreground text-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Trải Nghiệm Thử Vòng Cổ
            </h2>
            <p className="text-background/70 max-w-2xl mx-auto mb-8">
              Tải ảnh của bạn lên và thử ngay các mẫu vòng cổ yêu thích. Xem trước khi mua để chắc chắn bạn đã chọn đúng!
            </p>
            <Link to="/try-on">
              <Button className="btn-luxury">
                Thử Ngay Miễn Phí
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
