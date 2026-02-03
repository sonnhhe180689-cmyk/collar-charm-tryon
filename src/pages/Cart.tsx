import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const orderSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ').max(255),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự').max(500),
  notes: z.string().max(1000).optional(),
});

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = orderSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: validated.name,
          customer_email: validated.email,
          customer_phone: validated.phone,
          customer_address: validated.address,
          notes: validated.notes || null,
          total_amount: getTotalPrice(),
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        necklace_id: item.necklaceId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ bạn sớm.');
      clearCart();
      setIsCheckingOut(false);
      setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold mb-4">Giỏ Hàng Trống</h1>
            <p className="text-muted-foreground mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link to="/products">
              <Button className="btn-luxury">
                Khám Phá Sản Phẩm
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold mb-8">
            Giỏ Hàng <span className="text-gradient-gold">Của Bạn</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card-luxury flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold truncate">{item.name}</h3>
                    <p className="text-primary font-medium">{formatPrice(item.price)}</p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          onClick={() => updateQuantity(item.necklaceId, item.quantity - 1)}
                          className="p-2 hover:bg-secondary rounded-l-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.necklaceId, item.quantity + 1)}
                          className="p-2 hover:bg-secondary rounded-r-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.necklaceId)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-luxury sticky top-24">
                <h2 className="font-serif text-xl font-semibold mb-4">Tổng Đơn Hàng</h2>
                
                <div className="space-y-2 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm tính</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí vận chuyển</span>
                    <span>{getTotalPrice() >= 2000000 ? 'Miễn phí' : formatPrice(50000)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatPrice(getTotalPrice() + (getTotalPrice() >= 2000000 ? 0 : 50000))}
                  </span>
                </div>

                {!isCheckingOut ? (
                  <Button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full btn-luxury"
                  >
                    Tiến Hành Đặt Hàng
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Họ và tên *"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <p className="text-destructive text-xs mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        name="phone"
                        placeholder="Số điện thoại *"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Textarea
                        name="address"
                        placeholder="Địa chỉ giao hàng *"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={errors.address ? 'border-destructive' : ''}
                        rows={3}
                      />
                      {errors.address && (
                        <p className="text-destructive text-xs mt-1">{errors.address}</p>
                      )}
                    </div>
                    <div>
                      <Textarea
                        name="notes"
                        placeholder="Ghi chú (tùy chọn)"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-luxury"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsCheckingOut(false)}
                      className="w-full"
                    >
                      Quay lại
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
