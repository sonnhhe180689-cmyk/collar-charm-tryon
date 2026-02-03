-- Create necklaces table for product catalog
CREATE TABLE public.necklaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  overlay_image_url TEXT, -- For try-on feature
  category TEXT DEFAULT 'classic',
  material TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL, -- For anonymous users
  necklace_id UUID REFERENCES public.necklaces(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  necklace_id UUID REFERENCES public.necklaces(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.necklaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for necklaces (products should be viewable by everyone)
CREATE POLICY "Necklaces are viewable by everyone" 
ON public.necklaces FOR SELECT 
USING (true);

-- Cart items policies (based on session_id)
CREATE POLICY "Anyone can view their cart items" 
ON public.cart_items FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add cart items" 
ON public.cart_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their cart items" 
ON public.cart_items FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete their cart items" 
ON public.cart_items FOR DELETE 
USING (true);

-- Orders policies (public insert for checkout)
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Orders viewable by email" 
ON public.orders FOR SELECT 
USING (true);

-- Order items policies
CREATE POLICY "Order items insertable" 
ON public.order_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Order items viewable" 
ON public.order_items FOR SELECT 
USING (true);

-- Insert sample necklaces
INSERT INTO public.necklaces (name, description, price, image_url, overlay_image_url, category, material) VALUES
('Vòng Cổ Ngọc Trai Cổ Điển', 'Vòng cổ ngọc trai tự nhiên cao cấp, thiết kế thanh lịch phù hợp mọi dịp', 2500000, '/placeholder.svg', '/placeholder.svg', 'classic', 'Ngọc trai tự nhiên'),
('Vòng Cổ Vàng Lá', 'Vòng cổ vàng 18K thiết kế hình lá tinh tế, biểu tượng của sự sang trọng', 8500000, '/placeholder.svg', '/placeholder.svg', 'luxury', 'Vàng 18K'),
('Vòng Cổ Kim Cương Trái Tim', 'Vòng cổ kim cương hình trái tim lãng mạn, món quà hoàn hảo cho người thương', 15000000, '/placeholder.svg', '/placeholder.svg', 'luxury', 'Vàng trắng & Kim cương'),
('Vòng Cổ Bạc Hoa Sen', 'Vòng cổ bạc 925 với mặt hoa sen, biểu tượng của sự thuần khiết', 850000, '/placeholder.svg', '/placeholder.svg', 'modern', 'Bạc 925'),
('Vòng Cổ Đá Ruby', 'Vòng cổ đá ruby đỏ rực rỡ, mang đến may mắn và thịnh vượng', 12000000, '/placeholder.svg', '/placeholder.svg', 'gemstone', 'Vàng & Ruby'),
('Vòng Cổ Choker Velvet', 'Vòng cổ choker nhung đen thời thượng, phong cách hiện đại', 450000, '/placeholder.svg', '/placeholder.svg', 'modern', 'Nhung & Hợp kim');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for necklaces
CREATE TRIGGER update_necklaces_updated_at
BEFORE UPDATE ON public.necklaces
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();