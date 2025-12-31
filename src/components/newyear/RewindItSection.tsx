import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Download,
  Shield,
  CloudOff,
  Camera,
  Mic,
  Heart,
  Sparkles,
  Calendar,
  BarChart3,
  Clock,
  Lock,
  Smartphone,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface RewindItSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
  { icon: CloudOff, label: '100% Offline', desc: 'No cloud, no tracking' },
  { icon: Camera, label: 'Photos & Memories', desc: 'Capture moments' },
  { icon: Mic, label: 'Voice Notes', desc: 'Record thoughts' },
  { icon: Heart, label: 'Mood Tracking', desc: 'Track emotions' },
  { icon: Calendar, label: 'Daily Flashbacks', desc: 'Relive memories' },
  { icon: BarChart3, label: 'Mood Analytics', desc: 'Visual insights' },
  { icon: Clock, label: 'Time Capsules', desc: 'Future messages' },
  { icon: Lock, label: 'Private & Secure', desc: 'Your data stays yours' },
];

const RewindItSection = memo(({ open, onOpenChange }: RewindItSectionProps) => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
  }, []);

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/REWIND-IT.apk';
    link.download = 'REWIND-IT.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border/50 p-0 rounded-2xl">
        
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(var(--magical-gold)), transparent)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(var(--magical-rose)), transparent)' }}
          />
        </div>

        <div className="relative p-6 md:p-10">

         {/* Header */}
<div className="text-center mb-10 relative">

  {/* Ambient 3D Glow Background */}
  <motion.div
    className="absolute inset-0 -z-10 flex items-center justify-center"
    animate={{
      opacity: [0.4, 0.7, 0.4],
      scale: [0.9, 1.05, 0.9],
    }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  >
    <div
      className="w-72 h-72 rounded-full blur-[120px]"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--magical-gold) / 0.25), transparent 70%)",
      }}
    />
  </motion.div>

  {/* 3D Card */}
  <motion.div
    className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 rounded-3xl overflow-hidden"
    style={{
      perspective: 1000,
    }}
    whileHover={{
      rotateX: -8,
      rotateY: 8,
      scale: 1.05,
    }}
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {/* Card Glow */}
    <motion.div
      className="absolute inset-0"
      animate={{
        opacity: [0.5, 0.9, 0.5],
      }}
      transition={{ duration: 4, repeat: Infinity }}
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))",
        boxShadow:
          "0 30px 80px hsl(var(--magical-gold) / 0.5), inset 0 0 40px hsl(0 0% 100% / 0.15)",
      }}
    />

    {/* Image Cover */}
    <motion.img
      src="/REWIND-IT.png"
      alt="Rewind-It App Icon"
      className="absolute inset-0 w-full h-full object-cover"
      animate={{
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        filter:
          "drop-shadow(0 15px 40px hsl(var(--magical-gold) / 0.6))",
      }}
    />

    {/* Glass Overlay */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, hsl(0 0% 100% / 0.25), transparent)",
      }}
    />
  </motion.div>

  {/* Title */}
  <DialogTitle className="text-3xl md:text-4xl font-display font-light">
    <span className="text-gradient-luxury">Rewind-It</span>
  </DialogTitle>

  <DialogDescription className="text-muted-foreground text-lg mt-2">
    Your Private Memory Journal
  </DialogDescription>
</div>


          {/* Tagline */}
          <motion.div
            className="text-center mb-8 glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl font-light leading-relaxed">
              Capture, relive, and protect your life's precious moments with
              <span className="text-magical-gold"> complete privacy</span>.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card p-4 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <feature.icon className="w-6 h-6 mx-auto mb-2 text-magical-gold" />
                <p className="text-sm font-medium mb-1">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Download + Demo */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row gap-4 justify-center">

              {/* Download */}
              <Button
                onClick={handleDownload}
                disabled={downloadStarted}
                className="px-10 py-6 rounded-full text-lg h-auto w-full md:w-auto"
                style={{
                  background: downloadStarted
                    ? 'linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 26%))'
                    : 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
                  boxShadow: '0 0 40px hsl(var(--magical-gold) / 0.4)',
                }}
              >
                {downloadStarted ? (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Download Started
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6 mr-2" />
                    Download APK
                    <Smartphone className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Demo */}
              <Button
                variant="outline"
                onClick={() => window.open('https://rewindit.vercel.app/', '_blank')}
                className="px-10 py-6 rounded-full text-lg h-auto w-full md:w-auto border-magical-gold/40 hover:bg-magical-gold/10"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Demo
              </Button>

            </div>

            {!isAndroid && (
              <div className="glass-card p-5 rounded-2xl max-w-md mx-auto mt-4">
                <p className="font-medium mb-1">Best experience on Android</p>
                <p className="text-sm text-muted-foreground">
                  Download the APK and install it on an Android device.
                </p>
              </div>
            )}
          </motion.div>

         {/* Trust */}
<motion.div
  className="mt-8 pt-6 border-t border-border/20
             flex flex-wrap justify-center gap-6 text-xs"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {[
    { icon: Shield, label: "No Ads" },
    { icon: CloudOff, label: "No Cloud" },
    { icon: Lock, label: "No Tracking" },
    { icon: Sparkles, label: "Offline First" },
  ].map((item, i) => (
    <motion.span
      key={i}
      className="flex items-center gap-2 text-muted-foreground"
      whileHover={{ scale: 1.08 }}
    >
      <item.icon className="w-4 h-4 text-magical-gold" />
      {item.label}
    </motion.span>
  ))}
</motion.div>

{/* Footer Text */}
<motion.div
  className="mt-8 text-center space-y-2"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
  <motion.p
    className="text-sm md:text-base font-display font-semibold tracking-wide
               text-foreground/80"
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 4, repeat: Infinity }}
  >
    Your memories belong to you. Always.
  </motion.p>

  <motion.p
    className="text-xs md:text-sm font-display font-medium tracking-wider
               text-muted-foreground"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    App Designed & Developed by{" "}
    <span className="text-magical-gold font-semibold">
      Thangella
    </span>
  </motion.p>
</motion.div>

        </div>
      </DialogContent>
    </Dialog>
  );
});

RewindItSection.displayName = 'RewindItSection';
export default RewindItSection;
