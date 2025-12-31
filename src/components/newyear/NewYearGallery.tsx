import { memo, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Images, 
  Play, 
  Download, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Eye,
  Heart,
  Share2,
  ZoomIn
} from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  thumbnail: string;
  src: string;
  title: string;
  description?: string;
  category: 'fireworks' | 'celebration' | 'countdown' | 'party';
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    type: 'image',
    thumbnail: '/image 1.jpeg',
    src: '/image 1.jpeg',
    title: 'Midnight Fireworks',
    description: 'Spectacular fireworks lighting up the midnight sky',
    category: 'fireworks',
  },
  {
    id: '2',
    type: 'image',
    thumbnail: '/image 2.png',
    src: '/image 2.png',
    title: 'Celebration Lights',
    description: 'Magical celebration atmosphere',
    category: 'celebration',
  },
  {
    id: '3',
    type: 'image',
    thumbnail: '/image 3.png',
    src: '/image 3.png',
    title: 'Champagne Toast',
    description: 'Celebrating new beginnings with style',
    category: 'party',
  },
  {
    id: '4',
    type: 'image',
    thumbnail: '/image 4.png',
    src: '/image 4.png',
    title: 'Global Celebration',
    description: 'The world coming together to celebrate',
    category: 'celebration',
  },
  {
    id: '5',
    type: 'image',
    thumbnail: '/image 5.jpg',
    src: '/image 5.jpg',
    title: 'Countdown Magic',
    description: 'The magical countdown moment',
    category: 'countdown',
  },
  {
    id: '6',
    type: 'image',
    thumbnail: '/image 6.png',
    src: '/image 6.png',
    title: 'Party Sparklers',
    description: 'Sparkling celebrations with friends',
    category: 'party',
  },
  {
    id: '7',
    type: 'image',
    thumbnail: '/image 7.png',
    src: '/image 7.png',
    title: 'Golden Fireworks',
    description: 'Golden bursts of celebration',
    category: 'fireworks',
  },
  {
    id: '8',
    type: 'image',
    thumbnail: '/image 8.jpg',
    src: '/image 8.jpg',
    title: 'Dance Floor',
    description: 'Dancing into the new year',
    category: 'party',
  },
  {
    id: '9',
    type: 'image',
    thumbnail: '/image 9.jpg',
    src: '/image 9.jpg',
    title: 'New Year Crowd',
    description: 'Crowds celebrating together',
    category: 'celebration',
  },
  {
    id: '10',
    type: 'image',
    thumbnail: '/image 10.jpg',
    src: '/image 10.jpg',
    title: 'City Night Celebration',
    description: 'City lights and celebration vibes',
    category: 'celebration',
  },
  {
    id: '11',
    type: 'image',
    thumbnail: '/image 11.png',
    src: '/image 11.png',
    title: 'Final Fireworks',
    description: 'A grand finale to the celebration',
    category: 'fireworks',
  },
  {
    id: '12',
    type: 'image',
    thumbnail: '/image 12.png',
    src: '/image 12.png',
    title: 'Joyful Cheers',
    description: 'Friends cheering and welcoming the new year',
    category: 'party',
  },
  {
    id: '13',
    type: 'image',
    thumbnail: '/image 13.png',
    src: '/image 13.png',
    title: 'Midnight Countdown',
    description: 'The final seconds before the new year begins',
    category: 'countdown',
  },
  {
    id: '14',
    type: 'image',
    thumbnail: '/image 14.png',
    src: '/image 14.png',
    title: 'New Beginnings',
    description: 'A peaceful start to a brand new year',
    category: 'celebration',
  },
];



const categories = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'fireworks', label: 'Fireworks', emoji: '🎆' },
  { id: 'celebration', label: 'Celebration', emoji: '🎉' },
  { id: 'party', label: 'Party', emoji: '🥳' },
  { id: 'countdown', label: 'Countdown', emoji: '⏰' },
];

interface NewYearGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewYearGallery = memo(forwardRef<HTMLDivElement, NewYearGalleryProps>(({ open, onOpenChange }, ref) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const handleDownload = async (item: GalleryItem) => {
    setDownloadingId(item.id);
    try {
      const response = await fetch(item.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const navigateItem = (direction: 'prev' | 'next') => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === selectedItem.id);
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
      : (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[newIndex]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden bg-background border-border/50 p-0 rounded-2xl">
        {/* Subtle background accents - no animation, no blur */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(var(--magical-gold)), transparent)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(var(--magical-rose)), transparent)' }}
          />
        </div>

        <div className="relative flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex-shrink-0 p-4 md:p-6 pb-2 md:pb-4 border-b border-border/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
                    boxShadow: '0 0 30px hsl(var(--magical-gold) / 0.4)',
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Images className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
                <div>
                  <DialogTitle className="text-xl md:text-2xl font-display font-light">
                    <span className="text-gradient-luxury">2026 Gallery</span>
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-body text-xs md:text-sm">
                    Capture the magic • {filteredItems.length} items
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-primary/20 text-foreground border border-primary/40'
                      : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Gallery - Horizontal scroll on mobile, Grid on larger screens */}
<div className="flex-1 overflow-y-auto p-4 md:p-6">

  {/* 📱 MOBILE — Horizontal Scroll */}
  <div className="md:hidden">
    <motion.div
      layout
      className="
        flex gap-4 overflow-x-auto
        pb-4 -mx-4 px-4
        snap-x snap-mandatory
        scrollbar-hide
      "
    >
      <AnimatePresence>
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.03 }}
            className="
              relative snap-center
              min-w-[65%] max-w-[65%]
              rounded-2xl overflow-hidden
              cursor-pointer aspect-[3/4]
            "
            onClick={() => setSelectedItem(item)}
          >
            {/* Image */}
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Video Icon */}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
                  <Play className="w-5 h-5 text-foreground ml-0.5" />
                </div>
              </div>
            )}

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm font-medium text-foreground truncate">
                {item.title}
              </p>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-background/70 backdrop-blur"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(item.id);
                }}
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedItems.has(item.id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-background/70 backdrop-blur"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item);
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            {/* Liked Indicator */}
            {likedItems.has(item.id) && (
              <div className="absolute top-2 left-2">
                <Heart className="w-4 h-4 fill-red-500 text-red-500 drop-shadow-lg" />
              </div>
            )}

            {/* Border */}
            <div className="absolute inset-0 rounded-2xl border border-border/20 pointer-events-none" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  </div>

  {/* 🖥 DESKTOP — Grid (UNCHANGED) */}
  <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
    {/* your existing desktop grid here */}
  </div>

            {/* Desktop Grid */}
            <motion.div
              className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative group rounded-xl md:rounded-2xl overflow-hidden cursor-pointer aspect-[4/3]"
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Video indicator */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Play className="w-4 h-4 md:w-5 md:h-5 text-foreground ml-0.5" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <p className="text-xs md:text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground truncate">{item.description}</p>
                    </div>
                    
                    {/* Quick actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 md:h-8 md:w-8 p-0 bg-background/70 backdrop-blur-sm hover:bg-background/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 md:w-4 md:h-4 ${likedItems.has(item.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 md:h-8 md:w-8 p-0 bg-background/70 backdrop-blur-sm hover:bg-background/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                      >
                        {downloadingId === item.id ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </motion.div>
                        ) : (
                          <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Liked indicator */}
                    {likedItems.has(item.id) && (
                      <div className="absolute top-2 left-2">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500 drop-shadow-lg" />
                      </div>
                    )}
                    
                    {/* Premium border */}
                    <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-border/20 group-hover:border-magical-gold/40 transition-colors duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Footer Stats */}
          <div className="flex-shrink-0 p-3 md:p-4 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-magical-gold" />
                <span>{filteredItems.length} items</span>
              </div>
              {likedItems.size > 0 && (
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>{likedItems.size} liked</span>
                </div>
              )}
            </div>
            <span className="hidden sm:inline">Click to view • Tap ❤️ to save favorites</span>
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-background/98 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/50 backdrop-blur-sm h-10 w-10"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 backdrop-blur-sm h-10 w-10 md:h-12 md:w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateItem('prev');
                }}
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 backdrop-blur-sm h-10 w-10 md:h-12 md:w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateItem('next');
                }}
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </Button>

              {/* Content */}
              <motion.div
                className="relative w-[90vw] max-w-5xl max-h-[80vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {selectedItem.type === 'video' ? (
                  <video
                    src={selectedItem.src}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[70vh] rounded-2xl shadow-2xl object-contain"
                  />
                ) : (
                  <img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="w-full h-auto max-h-[70vh] rounded-2xl shadow-2xl object-contain"
                  />
                )}
                
                {/* Info bar */}
                <motion.div 
                  className="mt-4 p-4 rounded-xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div>
                    <h3 className="text-lg font-display font-medium text-foreground">{selectedItem.title}</h3>
                    {selectedItem.description && (
                      <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      className="flex-1 sm:flex-none glass-card"
                      onClick={() => toggleLike(selectedItem.id)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${likedItems.has(selectedItem.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      Like
                    </Button>
                    <Button
                      onClick={() => handleDownload(selectedItem)}
                      className="flex-1 sm:flex-none rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}));

NewYearGallery.displayName = 'NewYearGallery';

export default NewYearGallery;
