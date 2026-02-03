import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, Move, ZoomIn, ShoppingCart, Download, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      description: 'Duyệt qua bộ sưu tập và chọn mẫu vòng cổ bạn muốn thử. Bạn có thể dùng nút mũi tên để chuyển đổi nhanh giữa các mẫu.',
      tips: ['Xem trước nhiều mẫu để so sánh', 'Chú ý màu sắc phù hợp với trang phục', 'Thử các kiểu dáng khác nhau'],
    },
    {
      icon: Move,
      title: 'Bước 3: Di Chuyển & Điều Chỉnh',
      description: 'Kéo vòng cổ đến vị trí phù hợp trên cổ của bạn. Sử dụng thanh trượt để phóng to hoặc thu nhỏ kích thước vòng.',
      tips: ['Kéo thả để di chuyển vị trí', 'Điều chỉnh kích thước cho vừa vặn', 'Nhấn "Đặt Lại" nếu cần bắt đầu lại'],
    },
    {
      icon: Download,
      title: 'Bước 4: Lưu & Chia Sẻ',
      description: 'Khi hài lòng với kết quả, bạn có thể tải ảnh về máy để lưu giữ hoặc chia sẻ với bạn bè để lấy ý kiến.',
      tips: ['Tải ảnh về để so sánh các mẫu', 'Chia sẻ để nhờ bạn bè góp ý', 'Lưu lại để tham khảo khi mua hàng'],
    },
    {
      icon: ShoppingCart,
      title: 'Bước 5: Đặt Hàng',
      description: 'Khi đã chọn được mẫu ưng ý, thêm vào giỏ hàng và tiến hành đặt hàng. Chúng tôi sẽ giao hàng tận nơi cho bạn.',
      tips: ['Kiểm tra kỹ thông tin sản phẩm', 'Điền đúng địa chỉ giao hàng', 'Liên hệ hotline nếu cần hỗ trợ'],
    },
  ];

  const faqs = [
    {
      question: 'Tính năng thử vòng cổ có chính xác không?',
      answer: 'Tính năng của chúng tôi giúp bạn hình dung được sản phẩm trên người. Tuy nhiên, màu sắc thực tế có thể khác đôi chút do ánh sáng và màn hình hiển thị.',
    },
    {
      question: 'Tôi có thể thử bao nhiêu mẫu?',
      answer: 'Bạn có thể thử không giới hạn số lượng mẫu. Hãy thoải mái khám phá toàn bộ bộ sưu tập của chúng tôi!',
    },
    {
      question: 'Ảnh của tôi có được lưu trữ không?',
      answer: 'Không. Ảnh của bạn chỉ được xử lý trên trình duyệt và không được tải lên máy chủ của chúng tôi. Hoàn toàn riêng tư và bảo mật.',
    },
    {
      question: 'Làm sao để có kết quả thử đẹp nhất?',
      answer: 'Sử dụng ảnh chân dung rõ nét, ánh sáng tốt, vùng cổ không bị che khuất và chụp thẳng mặt để có kết quả tốt nhất.',
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
              Hướng Dẫn <span className="text-gradient-gold">Sử Dụng</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hướng dẫn chi tiết cách sử dụng tính năng thử vòng cổ trực tuyến và đặt hàng tại LuxeNeck
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-3xl mx-auto space-y-8 mb-16">
            {tryOnSteps.map((step, index) => (
              <div key={index} className="card-luxury">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <p className="text-sm font-medium mb-2">Mẹo nhỏ:</p>
                      <ul className="space-y-1">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
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
          <div className="text-center mb-16">
            <Link to="/try-on">
              <Button className="btn-luxury">
                Bắt Đầu Thử Ngay
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-8">
              Câu Hỏi <span className="text-gradient-gold">Thường Gặp</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="card-luxury">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
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
