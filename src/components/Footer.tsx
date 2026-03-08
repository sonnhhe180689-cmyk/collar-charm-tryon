import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter */}
      <div className="border-b border-background/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-medium tracking-[0.15em] uppercase mb-3">Cập Nhật Mới Nhất</h3>
          <p className="text-background/60 text-sm mb-6 max-w-md mx-auto">
            Đăng ký để nhận thông tin về bộ sưu tập mới và ưu đãi đặc biệt
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent border border-background/30 px-4 py-3 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-background/60"
            />
            <button className="bg-background text-foreground px-6 py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-background/90 transition-colors">
              Đăng Ký
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Luna Jewel</h4>
            <p className="text-background/50 text-sm leading-relaxed">
              Trang sức cao cấp, thiết kế tinh tế cho phái đẹp Việt Nam.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Khám Phá</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-background/50 hover:text-background transition-colors text-sm">Bộ Sưu Tập</Link></li>
              <li><Link to="/try-on" className="text-background/50 hover:text-background transition-colors text-sm">Thử Vòng Cổ</Link></li>
              <li><Link to="/guide" className="text-background/50 hover:text-background transition-colors text-sm">Hướng Dẫn</Link></li>
              <li><Link to="/contact" className="text-background/50 hover:text-background transition-colors text-sm">Liên Hệ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-background/40 mt-0.5 flex-shrink-0" />
                <span className="text-background/50 text-sm">Đại học FPT, Khu CNC Hòa Lạc, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-background/40 flex-shrink-0" />
                <span className="text-background/50 text-sm">0901 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-background/40 flex-shrink-0" />
                <span className="text-background/50 text-sm">contact@lunajewel.vn</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Kết Nối</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-background/20 flex items-center justify-center hover:border-background/60 transition-colors">
                <Facebook className="w-4 h-4 text-background/50" />
              </a>
              <a href="#" className="w-10 h-10 border border-background/20 flex items-center justify-center hover:border-background/60 transition-colors">
                <Instagram className="w-4 h-4 text-background/50" />
              </a>
            </div>
            <p className="mt-6 text-background/30 text-xs">Giờ mở cửa: 9:00 - 21:00 (T2 - CN)</p>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/30 text-xs tracking-[0.1em]">© 2024 Luna Jewel. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
