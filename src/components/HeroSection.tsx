import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-luxury">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Bộ Sưu Tập Mới 2024
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Vẻ Đẹp
              <br />
              <span className="text-gradient-gold">Vượt Thời Gian</span>
            </h1>
            
            <p className="text-muted-foreground text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
              Khám phá bộ sưu tập vòng cổ cao cấp được chế tác tinh xảo. Thử trực tiếp trên ảnh của bạn với công nghệ AR 2D hiện đại.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/products">
                <Button className="btn-luxury group">
                  Khám Phá Ngay
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/try-on">
                <Button variant="outline" className="rounded-full px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  Thử Vòng Cổ
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border mt-8">
              <div>
                <p className="font-serif text-2xl md:text-3xl font-bold text-primary">500+</p>
                <p className="text-muted-foreground text-sm">Sản Phẩm</p>
              </div>
              <div>
                <p className="font-serif text-2xl md:text-3xl font-bold text-primary">10K+</p>
                <p className="text-muted-foreground text-sm">Khách Hàng</p>
              </div>
              <div>
                <p className="font-serif text-2xl md:text-3xl font-bold text-primary">5★</p>
                <p className="text-muted-foreground text-sm">Đánh Giá</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 border border-gold/30 rounded-full" />
              <div className="absolute inset-8 border border-primary/10 rounded-full" />
              
              {/* Center content */}
              <div className="absolute inset-16 bg-gradient-to-br from-champagne to-cream rounded-full shadow-elegant flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="font-serif text-xl text-foreground">LuxeNeck</p>
                  <p className="text-muted-foreground text-sm">Premium Jewelry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
