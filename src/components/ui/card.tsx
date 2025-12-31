import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border border-border/50 shadow-lg hover:shadow-xl",
        elevated: "bg-card border border-border/30 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        glass: "backdrop-blur-2xl bg-card/60 border border-border/40 shadow-xl hover:bg-card/80 hover:shadow-2xl",
        premium: "relative overflow-hidden bg-gradient-to-br from-card via-card to-luxury-aurora1/5 border border-luxury-aurora1/20 shadow-2xl shadow-luxury-aurora1/10 hover:border-luxury-aurora1/40 hover:shadow-luxury-aurora1/20",
        magical: "relative overflow-hidden bg-gradient-to-br from-card via-card to-magical-rose/5 border border-magical-gold/20 shadow-2xl shadow-magical-gold/10 hover:border-magical-gold/40 hover:shadow-magical-gold/20",
        glow: "bg-card border-2 border-luxury-glow/30 shadow-lg shadow-luxury-glow/10 hover:border-luxury-glow/50 hover:shadow-xl hover:shadow-luxury-glow/20",
        interactive: "bg-card border border-border/50 shadow-lg cursor-pointer hover:bg-accent/5 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 active:translate-y-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-display font-semibold leading-none tracking-tight text-foreground", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };