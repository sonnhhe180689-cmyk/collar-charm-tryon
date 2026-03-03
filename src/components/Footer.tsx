import { Sparkles, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="font-serif text-2xl font-semibold">AR Jewel</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Trang sức cao cấp, thiết kế tinh tế cho phái đẹp Việt Nam. Mỗi sản phẩm là một tác phẩm nghệ thuật.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Liên Kết</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Bộ Sưu Tập
                </Link>
              </li>
              <li>
                <Link to="/try-on" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Thử Vòng Cổ
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Hướng Dẫn Sử Dụng
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-background/70 text-sm">
                  Đại học FPT, Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-background/70 text-sm">0901 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-background/70 text-sm">contact@arjewel.vn</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif text-lg mb-4">Kết Nối</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 text-background/50 text-xs">
              Giờ mở cửa: 9:00 - 21:00 (T2 - CN)
            </p>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8" />
      </div>
    </footer>
  );
};

export default Footer;
