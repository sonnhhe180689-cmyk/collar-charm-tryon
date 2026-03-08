import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import NecklaceCard from '@/components/NecklaceCard';
import { Gem, Truck, Shield, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import storyCraftsmanship from '@/assets/story-craftsmanship.jpg';
import serviceAppointment from '@/assets/service-appointment.jpg';
import servicePersonalize from '@/assets/service-personalize.jpg';
import serviceContact from '@/assets/service-contact.jpg';
import luxuryStoreBanner from '@/assets/luxury-store-banner.jpg';
import customer1 from '@/assets/customer-1.jpg';
import customer2 from '@/assets/customer-2.jpg';
import customer3 from '@/assets/customer-3.jpg';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

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

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cảm ơn bạn đã gửi đánh giá!');
    setFeedbackName('');
    setFeedbackEmail('');
    setFeedbackText('');
    setFeedbackRating(5);
  };

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

  const services = [
    {
      image: serviceAppointment,
      title: 'Đặt lịch hẹn',
      description: 'Nắm vững nghệ thuật tặng quà mùa lễ hội với cuộc hẹn riêng tại cửa hàng.',
      link: '/contact',
      linkText: 'Đặt Lịch Hẹn',
    },
    {
      image: servicePersonalize,
      title: 'Cá nhân hóa',
      description: 'Hãy làm cho thiết kế trở nên đáng nhớ hơn nữa với dịch vụ khắc laser theo yêu cầu.',
      link: '/guide',
      linkText: 'Tìm Hiểu Thêm',
    },
    {
      image: serviceContact,
      title: 'Liên hệ với chúng tôi',
      description: 'Từ tư vấn quà tặng phù hợp đến việc sắp xếp cuộc hẹn mua sắm, chúng tôi luôn sẵn sàng.',
      link: '/contact',
      linkText: 'Tìm Hiểu Thêm',
    },
  ];

  const testimonials = [
    {
      image: customer1,
      name: 'Minh Thu',
      text: '"Diamond Necklace rất đẹp, sáng lấp lánh và chất lượng tuyệt vời. Tôi rất hài lòng với sản phẩm này!"',
    },
    {
      image: customer2,
      name: 'Hương Như',
      text: '"Tôi yêu thích vòng cổ ngọc trai ở đây. Sản phẩm đúng như mô tả và giao hàng rất nhanh."',
    },
    {
      image: customer3,
      name: 'Lan Anh',
      text: '"The Luxury Collection rất quý phái. Vòng cổ thiết kế tinh tế, đeo rất sang trọng và nổi bật."',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />

        {/* Collection */}
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

        {/* The Story of Luxury */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="overflow-hidden">
                <img 
                  src={storyCraftsmanship} 
                  alt="Nghệ thuật chế tác" 
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                  Câu Chuyện Sang Trọng
                </h2>
                <p className="text-sm tracking-[0.15em] uppercase text-muted-foreground mb-6">
                  Nghệ Thuật Chế Tác
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8 italic">
                  Mỗi chiếc vòng cổ được chế tác bởi những nghệ nhân kim hoàn giàu kinh nghiệm với sự tỉ mỉ tuyệt đối trong từng chi tiết. Từ việc tuyển chọn đá quý đến sản phẩm cuối cùng, mỗi sản phẩm đều mang giá trị nghệ thuật và đẳng cấp vượt mọi giới hạn.
                </p>
                <Link to="/products" className="inline-block btn-outline-luxury">
                  Khám Phá Bộ Sưu Tập
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-[0.02em] mb-16 text-foreground italic">
              Dịch Vụ Của Chúng Tôi
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-background overflow-hidden shadow-card hover:shadow-elegant transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold italic mb-2 text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                    <Link 
                      to={service.link} 
                      className="inline-block px-6 py-2 border border-gold text-gold text-xs tracking-[0.1em] uppercase rounded-full hover:bg-gold hover:text-background transition-colors duration-300"
                    >
                      {service.linkText}
                    </Link>
                  </div>
                </div>
              ))}
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

        {/* Luxury Store Banner */}
        <section className="relative h-[400px] overflow-hidden">
          <img 
            src={luxuryStoreBanner} 
            alt="Không gian sang trọng" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-light italic text-background mb-3">
                Không Gian Sang Trọng
              </h2>
              <p className="text-background/80 text-sm tracking-[0.2em] uppercase">
                Trải Nghiệm Mua Sắm Đẳng Cấp Tại Cửa Hàng
              </p>
            </div>
          </div>
        </section>

        {/* Customer Feedback */}
        <section className="py-20 bg-secondary/20 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold italic mb-2 text-foreground">
              Phản Hồi Từ Khách Hàng
            </h2>
            <p className="text-center text-sm tracking-[0.2em] uppercase text-muted-foreground mb-16">
              Những Đánh Giá Chân Thực
            </p>

            <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold/30">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold italic mb-2 text-foreground">{testimonial.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leave Feedback Form */}
        <section className="py-20 bg-secondary/10 border-b border-border">
          <div className="container mx-auto px-4 max-w-xl">
            <h2 className="text-center text-3xl md:text-4xl font-bold italic mb-2 text-foreground">
              Leave a Feedback
            </h2>
            <p className="text-center text-sm tracking-[0.2em] uppercase text-muted-foreground mb-8">
              Để Lại Đánh Giá
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${star <= feedbackRating ? 'fill-gold text-gold' : 'text-muted-foreground'}`} 
                  />
                </button>
              ))}
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <Input
                placeholder="Tên của bạn"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                className="rounded-md border-border bg-background text-sm"
                required
              />
              <Input
                type="email"
                placeholder="Email của bạn"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                className="rounded-md border-border bg-background text-sm"
                required
              />
              <Textarea
                placeholder="Đánh giá của bạn"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="rounded-md border-border bg-background text-sm min-h-[120px]"
                required
              />
              <div className="text-center">
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-gold-dark to-gold text-background px-10 py-3 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                >
                  Gửi Đánh Giá
                </Button>
              </div>
            </form>
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
