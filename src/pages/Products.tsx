import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NecklaceCard from '@/components/NecklaceCard';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Bộ Sưu Tập <span className="text-gradient-gold">Vòng Cổ</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá những thiết kế tinh tế, được chế tác từ những nguyên liệu cao cấp nhất
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm vòng cổ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat.value || 'all'}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="rounded-full"
                  size="sm"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="card-luxury animate-pulse">
                  <div className="aspect-square bg-secondary rounded-xl mb-4" />
                  <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredNecklaces.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-muted-foreground">
                Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
