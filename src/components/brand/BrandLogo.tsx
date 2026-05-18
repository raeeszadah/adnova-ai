import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BRAND_LOCKUP_ASPECT_RATIO,
  BRAND_LOGO_MARK_PATH,
  BRAND_LOGO_PATH,
  BRAND_NAV_LOGO_HEIGHT_PX,
} from "@/lib/brand-config";

export type BrandLogoVariant = "lockup" | "mark";

export type BrandLogoSize =
  | "xs"
  | "sm"
  | "md"
  | "nav"
  | "lg"
  | "xl"
  | "2xl";

const LOCKUP_HEIGHT_PX: Record<Exclude<BrandLogoSize, "nav">, number> = {
  xs: 30,
  sm: 34,
  md: 42,
  lg: 46,
  xl: 54,
  "2xl": 64,
};

const LOCKUP_HEIGHT_CLASS: Record<Exclude<BrandLogoSize, "nav">, string> = {
  xs: "h-[30px]",
  sm: "h-[34px]",
  md: "h-[42px]",
  lg: "h-[46px]",
  xl: "h-[54px]",
  "2xl": "h-16",
};

/** Square mark — icon only */
const MARK_HEIGHT_PX: Record<Exclude<BrandLogoSize, "nav">, number> = {
  xs: 30,
  sm: 34,
  md: 38,
  lg: 42,
  xl: 46,
  "2xl": 52,
};

const MARK_HEIGHT_CLASS: Record<Exclude<BrandLogoSize, "nav">, string> = {
  xs: "h-[30px] w-[30px]",
  sm: "h-[34px] w-[34px]",
  md: "h-[38px] w-[38px]",
  lg: "h-[42px] w-[42px]",
  xl: "h-[46px] w-[46px]",
  "2xl": "h-[52px] w-[52px]",
};

/** Navbar lockup: scales with breakpoint, capped for h-20 chrome */
const NAV_HEIGHT_CLASS =
  "h-[52px] w-auto sm:h-[58px] md:h-[70px] max-h-[4.375rem]";

export type BrandLogoProps = {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
};

/** Transparent SaaS branding — lockup or compact mark; no boxes or duplicate wordmark */
export function BrandLogo({
  variant = "lockup",
  size = "md",
  className,
  priority = false,
}: BrandLogoProps) {
  if (variant === "mark" && size !== "nav") {
    const h = MARK_HEIGHT_PX[size];
    return (
      <Image
        src={BRAND_LOGO_MARK_PATH}
        alt=""
        width={h}
        height={h}
        className={cn(
          "block shrink-0 object-contain",
          MARK_HEIGHT_CLASS[size],
          className
        )}
        priority={priority}
      />
    );
  }

  if (size === "nav") {
    const heightPx = BRAND_NAV_LOGO_HEIGHT_PX;
    const widthPx = Math.round(heightPx * BRAND_LOCKUP_ASPECT_RATIO);

    return (
      <Image
        src={BRAND_LOGO_PATH}
        alt="AdNova AI"
        width={widthPx}
        height={heightPx}
        unoptimized
        priority={priority}
        className={cn(
          "block shrink-0 object-contain object-left",
          NAV_HEIGHT_CLASS,
          className
        )}
      />
    );
  }

  const heightPx = LOCKUP_HEIGHT_PX[size];
  const widthPx = Math.round(heightPx * BRAND_LOCKUP_ASPECT_RATIO);

  return (
    <Image
      src={BRAND_LOGO_PATH}
      alt="AdNova AI"
      width={widthPx}
      height={heightPx}
      unoptimized
      priority={priority}
      className={cn(
        "block w-auto shrink-0 object-contain object-left",
        LOCKUP_HEIGHT_CLASS[size],
        className
      )}
    />
  );
}
