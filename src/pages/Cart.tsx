import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" strokeWidth={1} />
            <h1 className="text-2xl font-light tracking-[0.1em] mb-4">Giỏ Hàng Trống</h1>
            <p className="text-muted-foreground text-sm mb-10">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link to="/products" className="inline-block btn-luxury">
              Khám Phá Sản Phẩm
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

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-light tracking-[0.1em] mb-10 text-center">
            Giỏ Hàng
          </h1>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-b border-border pb-2 mb-4 hidden md:grid grid-cols-12 gap-4 text-xs tracking-[0.1em] uppercase text-muted-foreground">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Thành tiền</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="border-b border-border py-6 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <div className="w-20 h-20 overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-border">
                      <button onClick={() => updateQuantity(item.necklaceId, item.quantity - 1)} className="p-2 hover:bg-muted transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.necklaceId, item.quantity + 1)} className="p-2 hover:bg-muted transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 text-right">
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                    <button onClick={() => removeItem(item.necklaceId)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border p-6 sticky top-32">
                <h2 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Tổng Đơn Hàng</h2>
                
                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vận chuyển</span>
                    <span>{getTotalPrice() >= 2000000 ? 'Miễn phí' : formatPrice(50000)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-medium mb-8">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(getTotalPrice() + (getTotalPrice() >= 2000000 ? 0 : 50000))}</span>
                </div>

                {!isCheckingOut ? (
                  <button onClick={() => setIsCheckingOut(true)} className="w-full btn-luxury text-center">
                    Đặt Hàng
                  </button>
                ) : (
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <Input name="name" placeholder="Họ và tên *" value={formData.name} onChange={handleInputChange} className={`rounded-none ${errors.name ? 'border-destructive' : ''}`} />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} className={`rounded-none ${errors.email ? 'border-destructive' : ''}`} />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Input name="phone" placeholder="Số điện thoại *" value={formData.phone} onChange={handleInputChange} className={`rounded-none ${errors.phone ? 'border-destructive' : ''}`} />
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Textarea name="address" placeholder="Địa chỉ giao hàng *" value={formData.address} onChange={handleInputChange} className={`rounded-none ${errors.address ? 'border-destructive' : ''}`} rows={3} />
                      {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <Textarea name="notes" placeholder="Ghi chú (tùy chọn)" value={formData.notes} onChange={handleInputChange} className="rounded-none" rows={2} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full btn-luxury text-center">
                      {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
                    </button>
                    <button type="button" onClick={() => setIsCheckingOut(false)} className="w-full text-xs text-muted-foreground hover:text-foreground underline py-2">
                      Quay lại
                    </button>
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
