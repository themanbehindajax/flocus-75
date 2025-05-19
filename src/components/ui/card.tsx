
import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> {
  animate?: boolean;
  gradient?: boolean;
  glass?: boolean;
  floating?: boolean;
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, animate = false, gradient = false, glass = false, floating = false, ...props }, ref) => {
  if (animate) {
    const CardComponent = motion.div;
    
    const animateProps = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      whileHover: { 
        y: floating ? -5 : -2, 
        boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)" 
      },
    };
    
    return (
      <CardComponent
        ref={ref}
        className={cn(
          "rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
          gradient && "bg-gradient-to-br from-card to-background/80",
          glass && "backdrop-blur-lg bg-card/70 border-opacity-40",
          floating && "hover:shadow-elegant",
          className
        )}
        {...animateProps}
        {...props as any}
      />
    );
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
        gradient && "bg-gradient-to-br from-card to-background/80",
        glass && "backdrop-blur-lg bg-card/70 border-opacity-40",
        floating && "hover:-translate-y-1 hover:shadow-elegant transition-transform",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
