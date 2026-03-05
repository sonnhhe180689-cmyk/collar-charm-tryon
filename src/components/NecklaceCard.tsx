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
    <div className="card-luxury group">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-secondary">
        <img src={actualImageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
          <Link to={`/try-on?necklace=${id}`} className="flex-1">
            <Button variant="secondary" className="w-full rounded-full" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Thử Ngay
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {material && (
          <span className="text-xs text-primary font-medium uppercase tracking-wide">{material}</span>
        )}
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">{name}</h3>
        {description && <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xl font-bold text-primary">{formatPrice(price)}</p>
          <Button onClick={handleAddToCart} size="icon" className="rounded-full bg-primary hover:bg-primary/90">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NecklaceCard;
