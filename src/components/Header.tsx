import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Sparkles, LogIn, LogOut } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold text-foreground">
              Luna <span className="text-gradient-gold">Jewel</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {session ? (
              <button onClick={handleLogout} className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2">
                <LogOut className="w-4 h-4" /> Đăng Xuất
              </button>
            ) : (
              <Link to="/auth" className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2">
                <LogIn className="w-4 h-4" /> Đăng Nhập
              </Link>
            )}

            <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors">
              <ShoppingBag className="w-6 h-6 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}
                className={cn("block py-3 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}>
                {link.label}
              </Link>
            ))}
            {session ? (
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left py-3 text-sm font-medium text-muted-foreground hover:text-primary">
                Đăng Xuất
              </button>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary">
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