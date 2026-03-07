import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Đã đăng xuất!');
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/products', label: 'Bộ Sưu Tập' },
    { href: '/try-on', label: 'Thử Vòng Cổ' },
    { href: '/guide', label: 'Hướng Dẫn' },
    { href: '/contact', label: 'Liên Hệ' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-background border-b border-border"
    )}>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs tracking-[0.15em] uppercase">
        Miễn phí vận chuyển cho đơn từ 2.000.000đ · <Link to="/products" className="underline">Mua ngay</Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-xs font-medium tracking-[0.15em] uppercase transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold tracking-[0.3em] uppercase text-foreground">
              Luna Jewel
            </span>
          </Link>

          {/* Right nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-xs font-medium tracking-[0.15em] uppercase transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {session ? (
              <button onClick={handleLogout} className="text-foreground hover:text-primary transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link to="/auth" className="text-foreground hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}

            <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/cart" className="relative text-foreground">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}
                className={cn("block py-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-foreground"
                )}>
                {link.label}
              </Link>
            ))}
            {session ? (
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left py-3 text-xs font-medium tracking-[0.15em] uppercase text-foreground hover:text-primary">
                Đăng Xuất
              </button>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block py-3 text-xs font-medium tracking-[0.15em] uppercase text-foreground hover:text-primary">
                Đăng Nhập / Đăng Ký
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
