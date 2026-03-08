import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NecklaceCard from '@/components/NecklaceCard';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Necklace {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  material: string | null;
  category: string | null;
}

const Products = () => {
  const [necklaces, setNecklaces] = useState<Necklace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { value: null, label: 'Tất Cả' },
    { value: 'classic', label: 'Cổ Điển' },
    { value: 'luxury', label: 'Cao Cấp' },
    { value: 'modern', label: 'Hiện Đại' },
    { value: 'gemstone', label: 'Đá Quý' },
  ];

  useEffect(() => {
    const fetchNecklaces = async () => {
      let query = supabase
        .from('necklaces')
        .select('*')
        .eq('in_stock', true);

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (!error && data) {
        setNecklaces(data);
      }
      setLoading(false);
    };

    fetchNecklaces();
  }, [selectedCategory]);

  const filteredNecklaces = necklaces.filter((necklace) =>
    necklace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    necklace.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] mb-4">
              Bộ Sưu Tập Vòng Cổ
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Khám phá những thiết kế tinh tế, được chế tác từ những nguyên liệu cao cấp nhất
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm vòng cổ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 rounded-full border-border text-sm h-11"
              />
            </div>

            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value || 'all'}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 text-xs tracking-[0.05em] rounded-full border transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? 'bg-gold text-background border-gold'
                      : 'border-border text-muted-foreground hover:border-gold hover:text-gold'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted mb-4" />
                  <div className="h-3 bg-muted w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-muted w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : filteredNecklaces.length === 0 ? (
            <div className="text-center py-24">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-light mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-muted-foreground text-sm">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNecklaces.map((necklace) => (
                <NecklaceCard
                  key={necklace.id}
                  id={necklace.id}
                  name={necklace.name}
                  description={necklace.description}
                  price={necklace.price}
                  imageUrl={necklace.image_url}
                  material={necklace.material}
                  category={necklace.category}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
