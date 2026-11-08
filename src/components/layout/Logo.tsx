import Image from "next/image";
import logoBlack from "@/assets/brand/logo-black.png";
import logoWhite from "@/assets/brand/logo-white.png";
import iconBlack from "@/assets/brand/icon-black.png";
import iconWhite from "@/assets/brand/icon-white.png";
import styles from "./Logo.module.css";

type Props = {
  /** "full" = stacked logo with wordmark, "mark" = standalone icon */
  variant: "full" | "mark";
  height: number;
  preload?: boolean;
  className?: string;
};

/**
 * The official marks, swapped by theme with CSS so the right one shows on first paint.
 * Never redrawn, cropped or stretched: only scaled by height. Decorative here; the
 * surrounding link or text carries the accessible name.
 */
export function Logo({ variant, height, preload = false, className }: Props) {
  const [light, dark] = variant === "full" ? [logoBlack, logoWhite] : [iconBlack, iconWhite];
  const width = Math.round((light.width / light.height) * height);
  return (
    <span className={`${styles.logo} ${className ?? ""}`} style={{ height, width }}>
      <Image src={light} alt="" width={width} height={height} preload={preload} className={styles.light} />
      <Image src={dark} alt="" width={width} height={height} preload={preload} className={styles.dark} />
    </span>
  );
}
