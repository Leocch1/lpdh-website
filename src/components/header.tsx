"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  { 
    href: "/services", 
    label: "Our Services",
    dropdown: [
      { href: "/services", label: "Services" },
      { href: "/services/find-doctor", label: "Find a Doctor" },
      { href: "/services/schedule-lab", label: "Schedule a Lab" }
    ]
  },
  { href: "/careers", label: "Careers" },
  { 
    href: "/contact", 
    label: "Contact Us",
    dropdown: [
      { href: "/contact", label: "Message Us" },
      { href: "/contact/directories", label: "LPDH Directories" }
    ]
  },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setIsContactDropdownOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const NavLinkItem = ({ href, label, dropdown }: { href: string; label: string; dropdown?: Array<{href: string, label: string}> }) => {
    if (dropdown) {
      const isContactDropdown = label === "Contact Us";
      const isServicesDropdown = label === "Our Services";
      const isDropdownOpen = isContactDropdown ? isContactDropdownOpen : isServicesDropdownOpen;
      const setDropdownOpen = isContactDropdown ? setIsContactDropdownOpen : setIsServicesDropdownOpen;
      const dropdownRef = isContactDropdown ? contactDropdownRef : servicesDropdownRef;

      return (
        <div 
          className="relative" 
          ref={dropdownRef}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <span
              className={cn(
                "text-lg font-semibold text-primary-foreground transition-colors md:text-base",
                (pathname === href || dropdown.some(item => pathname === item.href)) ? "font-semibold text-[#e8f996] [text-shadow:0_4px_4px_rgba(25,25,25,0.25)]" : "hover:text-[#e8f996]"
              )}
            >
              {label}   
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 text-primary-foreground hover:text-[#e8f996] transition-transform",
              isDropdownOpen && "rotate-180"
            )} />
          </div>
          
          {/* Desktop Dropdown */}
          {isDropdownOpen && (
            <div className="hidden md:block absolute left-0 top-full pt-2 z-50">
              <div className="bg-primary rounded-lg shadow-lg border border-primary-foreground/20 min-w-[200px] py-2">
                {dropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    className={cn(
                      "block px-4 py-2 text-sm text-primary-foreground hover:text-[#e8f996] hover:bg-primary-foreground/10 transition-colors",
                      pathname === item.href && "bg-primary-foreground/10 text-[#e8f996] font-semibold"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          "text-lg font-semibold text-primary-foreground transition-colors md:text-base",
          pathname === href ? "font-bold text-[#e8f996] [text-shadow:0_4px_4px_rgba(25,25,25,0.25)]" : "hover:text-[#e8f996]"
        )}
      >
        <span className="font-semibold">{label}</span>
      </Link>
    )
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-background [box-shadow:0_4px_13px_rgba(25,25,25,0.25)]">
      <div className="hidden bg-background py-2 text-xs text-muted-foreground md:block">
        <div className="container flex items-center justify-between pr-4 md:pr-8 lg:pr-12">
          <div className="flex-1 pl-32">
             <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-primary">EMERGENCY</p>
                <p className="text-foreground font-semibold">(09) 8820-9376</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                 <p className="font-semibold text-primary">LOCATION</p>
                 <p className="text-foreground font-semibold">#8009 J.I. Aguilar Ave., Pulanglupa II, Las Pinas City</p>
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
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
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
                      <div key={link.href}>
                        <NavLinkItem href={link.href} label={link.label} dropdown={link.dropdown} />
                        {/* Mobile dropdown items */}
                        {link.dropdown && (
                          (link.label === "Contact Us" && isContactDropdownOpen) ||
                          (link.label === "Our Services" && isServicesDropdownOpen)
                        ) && (
                          <div className="ml-4 mt-2 space-y-2">
                            {link.dropdown.map((item) => (
                              <Link 
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setIsContactDropdownOpen(false);
                                  setIsServicesDropdownOpen(false);
                                }}          
                                className={cn(
                                  "block text-base font-semibold text-primary-foreground transition-colors hover:text-yellow",
                                  pathname === item.href && "font-bold text-[#e8f996]"
                                )}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
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
              <NavLinkItem key={link.href} href={link.href} label={link.label} dropdown={link.dropdown} />
            ))}
          </nav>


          {/* Right side: Button */}
          <div className="flex flex-1 items-center justify-end">
            <Button asChild variant="secondary" className="bg-secondary/90 font-semibold hover:bg-white text-secondary-foreground hover:text-primary rounded-lg [box-shadow:0_4px_4px_rgba(25,25,25,0.25)]">
              <Link href="/services#appointment">Find a Doctor</Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
