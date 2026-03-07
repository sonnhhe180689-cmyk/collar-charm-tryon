import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end justify-center bg-tiffany-light">
      {/* Hero Image Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-tiffany-light flex items-center justify-center">
          <div className="text-center">
            <div className="w-40 h-40 mx-auto mb-8 border-2 border-primary/30 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 border border-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary text-4xl font-light">✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content overlay at bottom */}
      <div className="relative z-10 text-center pb-20 pt-40">
        <h1 className="text-4xl md:text-6xl font-light text-foreground mb-8 tracking-[0.05em]">
          Luna Jewel
        </h1>
        <Link
          to="/products"
          className="inline-block btn-outline-luxury"
        >
          Khám Phá Ngay
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
