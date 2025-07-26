
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinkItem = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        "text-lg text-primary-foreground/90 transition-colors hover:text-white md:text-base",
        pathname === href && "font-semibold text-white"
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="hidden bg-background py-2 text-xs text-muted-foreground md:block">
        <div className="container flex items-center justify-between pr-12">
          <div className="flex-1 pl-32">
             <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-primary">EMERGENCY</p>
                <p className="text-foreground">(09) 8825-5236</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                 <p className="font-semibold text-primary">LOCATION</p>
                 <p className="text-foreground">#8009 CAA Road, Pulanglupa II, Las Pinas City</p>
              </div>
            </div>
            <Image
              src="/iso.jpg"
              alt="ISO 9001:2015 Certified"
              data-ai-hint="iso certificate"
              width={120}
              height={50}
            />
          </div>
        </div>
      </div>
      <header className="bg-primary text-primary-foreground">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile: Hamburger */}
          <div className="flex-1 md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/90 hover:text-primary-foreground">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-primary text-primary-foreground">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="p-4">
                  <div className="mb-8">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <Logo />
                    </Link>
                  </div>
                  <nav className="flex flex-col items-start gap-6">
                    {navLinks.map((link) => (
                      <NavLinkItem key={link.href} {...link} />
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
           {/* Mobile: Logo in center */}
           <div className="flex justify-center md:hidden flex-1">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-8 text-sm md:flex">
            {navLinks.map((link) => (
              <NavLinkItem key={link.href} {...link} />
            ))}
          </nav>


          {/* Right side: Button */}
          <div className="flex flex-1 items-center justify-end">
            <Button asChild variant="secondary" className="bg-secondary/90 hover:bg-white text-secondary-foreground hover:text-primary rounded-lg">
              <Link href="/services#appointment">Find a Doctor</Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
