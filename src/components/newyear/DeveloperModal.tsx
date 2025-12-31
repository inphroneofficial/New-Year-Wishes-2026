import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Globe,
  Instagram,
  Sparkles,
  Star,
  Brain,
} from "lucide-react";

export interface DeveloperModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeveloperModal({
  open,
  onOpenChange,
}: DeveloperModalProps) {
  const developerLinks = [
    {
      icon: <Instagram className="h-4 w-4 text-[hsl(340_75%_60%)]" />,
      label: "Instagram",
      url: "https://instagram.com/g_thangella_k",
    },
    {
      icon: <Mail className="h-4 w-4 text-[hsl(0_70%_55%)]" />,
      label: "Email",
      url: "mailto:imgtk17@gmail.com",
    },
    {
      icon: <Globe className="h-4 w-4 text-[hsl(170_70%_50%)]" />,
      label: "Portfolio",
      url: "https://thangella-craftech-solutions.vercel.app/",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-md md:max-w-lg p-0 overflow-hidden shadow-2xl">

        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--magical-gold) / 0.35), transparent)",
            }}
            animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="relative max-h-[80vh] overflow-y-auto p-6">

          {/* Header */}
          <DialogHeader className="text-center pb-4">
            <motion.div
              className="flex items-center justify-center gap-2 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles className="w-5 h-5 text-magical-gold" />
              <DialogTitle className="text-2xl font-display font-medium">
                A Note From the Creator
              </DialogTitle>
              <Sparkles className="w-5 h-5 text-magical-gold" />
            </motion.div>

            <DialogDescription className="text-muted-foreground">
              Crafted with care for this New Year journey ✨
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          {/* Avatar Section */}
          <motion.div
            className="flex flex-col items-center text-center space-y-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotateX: 6, rotateY: -6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{ perspective: 2000 }}
            >
              <div className="rounded-2xl p-[2px] bg-gradient-to-br from-magical-gold to-luxury-aurora-2 shadow-xl">
                <Avatar className="w-28 h-28 rounded-2xl bg-card shadow-inner">
                  <AvatarImage src="/GTK.png" alt="G. Thangella" />
                  <AvatarFallback className="rounded-2xl text-2xl font-display bg-gradient-to-br from-magical-gold/20 to-luxury-aurora-2/20">
                    GT
                  </AvatarFallback>
                </Avatar>
              </div>

              <motion.div
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-magical-gold flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-3.5 h-3.5 text-background" fill="currentColor" />
              </motion.div>
            </motion.div>

            <h3 className="text-xl font-display font-semibold">
              G. Thangella
            </h3>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A thoughtful design and gentle technology
              can turn moments into meaningful memories.
            </p>

            {/* Links */}
            <div className="flex gap-2 pt-2">
              {developerLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl glass-card hover:bg-muted/50"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Message Section */}
          <motion.div
            className="mt-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This New Year 2026 experience is a small reminder to pause,
                reflect, and step forward with hope, clarity, and intention.
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-display font-semibold flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-magical-gold" />
                Thoughtfully Created
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every detail — from motion to message — is designed with care,
                balance, and the human experience at heart.
              </p>
            </div>

            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>✨ With Intention</span>
              <span>🧠 With Thought</span>
              <span>💛 With Care</span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t bg-card/50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="luxury-button" asChild>
            <a href="mailto:imgtk17@gmail.com">Send a Note</a>
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
