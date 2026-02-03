import necklacePearl from '@/assets/necklace-pearl.jpg';
import necklaceGoldLeaf from '@/assets/necklace-gold-leaf.jpg';
import necklaceDiamondHeart from '@/assets/necklace-diamond-heart.jpg';
import necklaceSilverLotus from '@/assets/necklace-silver-lotus.jpg';
import necklaceRuby from '@/assets/necklace-ruby.jpg';
import necklaceChoker from '@/assets/necklace-choker.jpg';

export const necklaceImages: Record<string, string> = {
  'pearl': necklacePearl,
  'gold-leaf': necklaceGoldLeaf,
  'diamond-heart': necklaceDiamondHeart,
  'silver-lotus': necklaceSilverLotus,
  'ruby': necklaceRuby,
  'choker': necklaceChoker,
};

export const getNecklaceImage = (imageUrl: string): string => {
  // Check if it's a placeholder, return a matching image based on keywords
  if (imageUrl === '/placeholder.svg' || !imageUrl) {
    return necklacePearl; // default
  }
  return imageUrl;
};

export const getOverlayImage = (imageUrl: string): string => {
  // For try-on feature, we use the same images as overlay
  return getNecklaceImage(imageUrl);
};
