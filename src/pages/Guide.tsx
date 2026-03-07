import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, Move, ZoomIn, ShoppingCart, Download, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Guide = () => {
  const tryOnSteps = [
    {
      icon: Camera,
      title: 'Bước 1: Tải Ảnh Lên',
      description: 'Chọn một bức ảnh chân dung rõ nét của bạn. Ảnh nên chụp thẳng mặt, vùng cổ rõ ràng để có kết quả tốt nhất.',
      tips: ['Sử dụng ảnh có độ phân giải cao', 'Ánh sáng đều, không bị ngược sáng', 'Vùng cổ không bị che khuất'],
    },
    {
      icon: Sparkles,
      title: 'Bước 2: Chọn Vòng Cổ',
      description: 'Duyệt qua bộ sưu tập và chọn mẫu vòng cổ bạn muốn thử.',
      tips: ['Xem trước nhiều mẫu để so sánh', 'Chú ý màu sắc phù hợp với trang phục', 'Thử các kiểu dáng khác nhau'],
    },
    {
      icon: Move,
      title: 'Bước 3: Di Chuyển & Điều Chỉnh',
      description: 'Kéo vòng cổ đến vị trí phù hợp trên cổ của bạn. Sử dụng thanh trượt để phóng to hoặc thu nhỏ.',
      tips: ['Kéo thả để di chuyển vị trí', 'Điều chỉnh kích thước cho vừa vặn', 'Nhấn "Đặt Lại" nếu cần bắt đầu lại'],
    },
    {
      icon: Download,
      title: 'Bước 4: Lưu & Chia Sẻ',
      description: 'Khi hài lòng với kết quả, bạn có thể tải ảnh về máy để lưu giữ hoặc chia sẻ.',
      tips: ['Tải ảnh về để so sánh các mẫu', 'Chia sẻ để nhờ bạn bè góp ý', 'Lưu lại để tham khảo khi mua hàng'],
    },
    {
      icon: ShoppingCart,
      title: 'Bước 5: Đặt Hàng',
      description: 'Khi đã chọn được mẫu ưng ý, thêm vào giỏ hàng và tiến hành đặt hàng.',
      tips: ['Kiểm tra kỹ thông tin sản phẩm', 'Điền đúng địa chỉ giao hàng', 'Liên hệ hotline nếu cần hỗ trợ'],
    },
  ];

  const faqs = [
    { question: 'Tính năng thử vòng cổ có chính xác không?', answer: 'Tính năng của chúng tôi giúp bạn hình dung được sản phẩm trên người. Tuy nhiên, màu sắc thực tế có thể khác đôi chút.' },
    { question: 'Tôi có thể thử bao nhiêu mẫu?', answer: 'Bạn có thể thử không giới hạn số lượng mẫu.' },
    { question: 'Ảnh của tôi có được lưu trữ không?', answer: 'Không. Ảnh của bạn chỉ được xử lý trên trình duyệt và không được tải lên máy chủ.' },
    { question: 'Làm sao để có kết quả thử đẹp nhất?', answer: 'Sử dụng ảnh chân dung rõ nét, ánh sáng tốt, vùng cổ không bị che khuất.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] mb-4">
              Hướng Dẫn Sử Dụng
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Hướng dẫn chi tiết cách sử dụng tính năng thử vòng cổ trực tuyến
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-2xl mx-auto space-y-6 mb-20">
            {tryOnSteps.map((step, index) => (
              <div key={index} className="border border-border p-6">
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-primary flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium tracking-[0.05em] mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                    <div className="bg-muted p-4">
                      <p className="text-xs font-medium tracking-[0.1em] uppercase mb-2 text-muted-foreground">Mẹo nhỏ</p>
                      <ul className="space-y-1.5">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mb-20">
            <Link to="/try-on" className="inline-block btn-luxury">
              Bắt Đầu Thử Ngay
            </Link>
          </div>

          {/* FAQs */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-light tracking-[0.1em] text-center mb-10">
              Câu Hỏi Thường Gặp
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border p-6">
                  <h3 className="text-sm font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Guide;
