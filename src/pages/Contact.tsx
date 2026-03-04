import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ').max(255),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự').max(1000),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      // Simulate sending message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa Chỉ',
      details: ['Đại học FPT, Khu CNC Hòa Lạc', 'Thạch Thất, Hà Nội'],
    },
    {
      icon: Phone,
      title: 'Hotline',
      details: ['0901 234 567', '0901 234 568'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@lunajewel.vn', 'support@lunajewel.vn'],
    },
    {
      icon: Clock,
      title: 'Giờ Làm Việc',
      details: ['Thứ 2 - Chủ Nhật', '9:00 - 21:00'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Liên Hệ <span className="text-gradient-gold">Với Chúng Tôi</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Có câu hỏi hoặc cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="card-luxury">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold mb-2">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-muted-foreground text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473546128!2d105.5225855!3d21.0124167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2zxJDhuqFpIGjhu41jIEZQVA!5e0!3m2!1svi!2s!4v1704067200000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí cửa hàng"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="card-luxury">
              <h2 className="font-serif text-2xl font-semibold mb-6">Gửi Tin Nhắn</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Textarea
                    name="message"
                    placeholder="Nội dung tin nhắn *"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={errors.message ? 'border-destructive' : ''}
                    rows={6}
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs mt-1">{errors.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-luxury"
                >
                  {isSubmitting ? 'Đang gửi...' : (
                    <>
                      Gửi Tin Nhắn
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
