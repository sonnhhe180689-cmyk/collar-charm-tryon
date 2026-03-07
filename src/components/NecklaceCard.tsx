import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cartStore';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { necklaceImages } from '@/lib/necklaceImages';

interface NecklaceCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  material: string | null;
  category: string | null;
}

const NecklaceCard = ({ id, name, description, price, imageUrl, material }: NecklaceCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const actualImageUrl = necklaceImages[imageUrl] || imageUrl;

  const handleAddToCart = () => {
    addItem({ necklaceId: id, name, price, imageUrl: actualImageUrl });
    toast.success(`Đã thêm "${name}" vào giỏ hàng`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden mb-4 bg-muted">
        <img src={actualImageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Link to={`/try-on?necklace=${id}`} className="flex-1">
            <Button variant="secondary" className="w-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-background text-xs tracking-[0.1em] uppercase rounded-none" size="sm">
              <Eye className="w-3 h-3 mr-2" />
              Thử Ngay
            </Button>
          </Link>
          <Button onClick={handleAddToCart} size="icon" className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background rounded-none w-9 h-9">
            <ShoppingCart className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 text-center">
        {material && (
          <span className="text-[10px] text-primary font-medium uppercase tracking-[0.2em]">{material}</span>
        )}
        <h3 className="text-sm font-medium text-foreground">{name}</h3>
        {description && <p className="text-muted-foreground text-xs line-clamp-1">{description}</p>}
        <p className="text-sm font-medium text-foreground">{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default NecklaceCard;
