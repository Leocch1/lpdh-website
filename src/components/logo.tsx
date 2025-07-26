import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/LPDH LOGO OFFICIAL.png"
        alt="LPDH+" // Added alt text for accessibility
        width={130} // Set width based on the original SVG
        height={40} // Set height based on the original SVG
        priority // Assuming the logo is a high-priority image
      />
    </div>
  );
}
