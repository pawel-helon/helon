import { cn } from "@/lib/utils";
import { Inter, Poppins } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export function Text({
  variant,
  className,
  children,
}: {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "p-base-thick" | "p-base-thin" | "p-small-thick" | "p-small-thin";
  children: React.ReactNode;
  className?: string;
}) {
  switch (variant) {
    case "h1":
      return (
        <h1 className={cn("text-4xl leading-tight font-semibold text-foreground antialiased", inter.className, className)}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={cn("text-2xl leading-tight font-semibold text-foreground antialiased", inter.className, className)}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={cn("text-xl leading-tight font-semibold text-foreground antialiased", inter.className, className)}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className={cn("text-lg leading-tight font-semibold text-foreground antialiased", inter.className, className)}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 className={cn("text-base leading-tight font-semibold text-foreground antialiased", inter.className, className)}>
          {children}
        </h5>
      );
    case "p-base-thick":
      return (
        <p className={cn("text-sm leading-snug font-medium text-foreground", className)}>
          {children}
        </p>
      );
    case "p-base-thin":
      return (
        <p className={cn("text-sm leading-snug font-normal text-muted-foreground", className)}>
          {children}
        </p>
      );
    case "p-small-thick":
      return (
        <p className={cn("text-xs font-medium", className)}>
          {children}
        </p>
      )
    case "p-small-thin":
      return (
        <p className={cn("text-xs font-normal text-muted-foreground", className)}>
          {children}
        </p>
      );
    default:
      throw Error("Invalid variant");
  }
}
