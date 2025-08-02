  "use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Paperclip, MapPin, ChevronDown, Clock, Activity } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";

const EMERGENCY_NUMBER = {
  display: "(02) 8820-9376",
  tel: "+0288209376"
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { 
    href: "/services", 
    label: "Our Services",
    dropdown: [
      { href: "/services", label: "Services" },
      { href: "/services/admission", label: "Admission" },
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

const PRIMARY_GREEN_HEX = '#169a53';
const MEDIUM_GREEN_HEX = '#73bd92';
const LIGHT_GREEN_HEX = '#c2d7c9';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [mobileContactDropdownOpen, setMobileContactDropdownOpen] = useState(false);
  const [mobileServicesDropdownOpen, setMobileServicesDropdownOpen] = useState(false);
  const [isIsoImageOpen, setIsIsoImageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastDirection = useRef<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const threshold = 80; // height of upper header (h-20)
      
      // Determine scroll direction
      const direction = currentScroll > lastScrollY.current ? 'down' : 'up';
      
      // Only update state if we've moved far enough in the same direction
      if (direction !== lastDirection.current) {
        // Direction changed, need to move at least 20px in new direction
        if (Math.abs(currentScroll - lastScrollY.current) > 20) {
          lastDirection.current = direction;
          setIsScrolled(currentScroll > threshold);
        }
      } else {
        // Same direction, update normally
        setIsScrolled(currentScroll > threshold);
      }
      
      lastScrollY.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
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

  const NavLinkItem = ({ href, label, dropdown, isMobile = false }: { href: string; label: string; dropdown?: Array<{href: string, label: string}>; isMobile?: boolean }) => {
    if (dropdown) {
      const isContactDropdown = label === "Contact Us";
      const isServicesDropdown = label === "Our Services";
      
      // Use different state for mobile vs desktop
      const isDropdownOpen = isMobile 
        ? (isContactDropdown ? mobileContactDropdownOpen : mobileServicesDropdownOpen)
        : (isContactDropdown ? isContactDropdownOpen : isServicesDropdownOpen);
      
      const setDropdownOpen = isMobile
        ? (isContactDropdown ? setMobileContactDropdownOpen : setMobileServicesDropdownOpen)
        : (isContactDropdown ? setIsContactDropdownOpen : setIsServicesDropdownOpen);
      
      const dropdownRef = isContactDropdown ? contactDropdownRef : servicesDropdownRef;

      return (
        <div 
          className="relative" 
          ref={!isMobile ? dropdownRef : undefined}
          onMouseEnter={!isMobile ? () => setDropdownOpen(true) : undefined}
          onMouseLeave={!isMobile ? () => setDropdownOpen(false) : undefined}
        >
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <span
              className={cn(
                "text-base font-medium text-slate-700 transition-colors hover:text-primary",
                (pathname === href || dropdown.some(item => pathname === item.href)) ? "text-primary font-semibold" : ""
              )}
            >
              {label}   
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 text-slate-600 hover:text-primary transition-transform",
              isDropdownOpen && "rotate-180"
            )} />
          </div>
          
          {/* Desktop Dropdown */}
          {!isMobile && isDropdownOpen && (
            <div className="hidden lg:block absolute left-0 top-full pt-2 z-50">
              <div className="bg-white rounded-lg shadow-xl border border-slate-200 min-w-[200px] py-2">
                {dropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-sm text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors",
                      pathname === item.href && "text-primary font-semibold"
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
          "text-base font-medium text-slate-700 transition-colors hover:text-primary",
          pathname === href ? "text-primary font-semibold" : ""
        )}
      >
        {label}
      </Link>
    )
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Upper Header - Contact Info */}
      <div className={cn(
        "hidden bg-slate-50 border-b border-slate-200 text-sm lg:block transition-all duration-300",
        isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-20 opacity-100"
      )}>
        <div className="w-full px-12 sm:px-16 lg:px-20 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex-shrink-0">
              <Link href="/" className="transition-opacity hover:opacity-80">
                <Logo />
              </Link>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                  <Phone className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-600 text-xs uppercase tracking-wide leading-none">Emergency</p>
                  <Link href={`tel:${EMERGENCY_NUMBER.tel}`} className="text-slate-800 hover:text-red-600 font-semibold text-sm transition-colors">{EMERGENCY_NUMBER.display}</Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <p className="font-semibold text-primary text-xs uppercase tracking-wide">Location</p>
                   <p className="text-slate-800 font-semibold">#8009 J.I. Aguilar Ave., Pulanglupa II, Las Pinas City</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <p className="font-semibold text-primary text-xs uppercase tracking-wide">Hours</p>
                   <p className="text-slate-800 font-semibold">24/7 Emergency Care</p>
                </div>
              </div>
              <div className="border-l border-slate-300 pl-6">
                <button 
                  onClick={() => setIsIsoImageOpen(true)}
                  className="cursor-pointer transition-opacity hover:opacity-100"
                >
                  <Image
                    src="/iso.jpg"
                    alt="ISO 9001:2015 Certified"
                    data-ai-hint="iso certificate"
                    width={100}
                    height={40}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                </button>

                <Dialog open={isIsoImageOpen} onOpenChange={setIsIsoImageOpen}>
                  <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
                    <div className="relative">
                      <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 hover:bg-black/60 transition-colors">
                        <X className="h-6 w-6 text-white" />
                      </DialogClose>
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src="/iso.jpg"
                          alt="ISO 9001:2015 Certified"
                          className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
                          width={1000}
                          height={800}
                          priority
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Header - Navigation */}
      <header className={cn(
        "bg-white border-b border-slate-200 transition-all duration-300",
        isScrolled ? "shadow-md" : ""
      )}>
        <div className="w-full px-12 sm:px-16 lg:px-20">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile: Hamburger */}
            <div className="flex-shrink-0 lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-700 hover:text-primary hover:bg-slate-100">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-white">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <div className="p-4">
                    <div className="mb-8">
                      <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="scale-75 block">
                        <Logo />
                      </Link>
                    </div>
                    <nav className="flex flex-col items-start gap-6">
                      {navLinks.map((link) => (
                        <div key={link.href} className="w-full">
                          <NavLinkItem href={link.href} label={link.label} dropdown={link.dropdown} isMobile={true} />
                          {/* Mobile dropdown items */}
                          {link.dropdown && (
                            (link.label === "Contact Us" && mobileContactDropdownOpen) ||
                            (link.label === "Our Services" && mobileServicesDropdownOpen)
                          ) && (
                            <div className="ml-4 mt-2 space-y-2">
                              {link.dropdown.map((item) => (
                                <Link 
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setMobileContactDropdownOpen(false);
                                    setMobileServicesDropdownOpen(false);
                                  }}          
                                  className={cn(
                                    "block text-base font-medium text-slate-600 transition-colors hover:text-primary py-1",
                                    pathname === item.href && "text-primary font-semibold"
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
                    
                    {/* Mobile CTA Buttons */}
                    <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                      <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white hover:border-primary">
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                          <Activity className="h-4 w-4 mr-2" />
                          Find a Doctor
                        </Link>
                      </Button>
                      <Button asChild className="w-full bg-primary hover:bg-primary text-white font-semibold shadow-sm">
                        <Link href="/services#appointment" onClick={() => setIsMobileMenuOpen(false)}>
                          <Paperclip className="h-4 w-4 mr-2" />
                          Get Result Online
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Mobile contact info */}
                    <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Emergency</p>
                          <Link href={`tel:${EMERGENCY_NUMBER.tel}`} className="text-slate-800 hover:text-red-600 font-semibold text-sm transition-colors">{EMERGENCY_NUMBER.display}</Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Hours</p>
                          <p className="text-sm font-semibold text-slate-800">24/7 Emergency Care</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
             {/* Mobile: Logo in center (no buttons beside it) */}
             <div className="flex justify-center lg:hidden flex-1">
              <Link href="/" className="transition-opacity hover:opacity-80 scale-75">
                <Logo />
              </Link>
            </div>

            {/* Mobile: Empty div to maintain flexbox layout */}
            <div className="flex-shrink-0 lg:hidden w-10"></div>

            {/* Desktop Nav - Starts from left, with logo */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              <div className={cn(
                "transition-all duration-300",
                isScrolled ? "opacity-100 scale-75" : "opacity-0 scale-0 w-0"
              )}>
                <Link href="/" className="transition-opacity hover:opacity-80">
                  <Logo />
                </Link>
              </div>
              <nav className="flex items-center gap-8 text-sm">
                {navLinks.map((link) => (
                  <NavLinkItem key={link.href} href={link.href} label={link.label} dropdown={link.dropdown} isMobile={false} />
                ))}
              </nav>
            </div>

            {/* Desktop: CTA Buttons */}
      <div className="hidden lg:flex items-center justify-end gap-3 flex-shrink-0">
        {isScrolled && (
          // EMERGENCY Button - Adjusted sizing
          <Button asChild
              // Reduced padding from p-4 to px-4 py-2 (standard shadcn size)
              // Adjusted text-size from text-base to text-sm to match other buttons
              className={`group relative px-3 py-1 rounded-xl backdrop-blur-xl border-2 border-red-500/30
                          bg-gradient-to-br from-red-900/40 via-black/60 to-black/80 shadow-2xl
                          hover:shadow-red-500/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95
                          transition-all duration-500 ease-out cursor-pointer hover:border-red-400/60 overflow-hidden
                          `}
          >
            <Link href={`tel:${EMERGENCY_NUMBER.tel}`} className="relative z-10 flex items-center justify-center w-48 h-48">
              {/* Inner absolute divs for hover effects */}
              <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
              ></div>
              <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 via-red-400/20 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>

              {/* Content of the button (Icon and Text) - ensure z-index to be on top of hover effects */}
              <div className="relative z-20 flex items-center space-x-2">
                  {/* Icon container - adjusted padding from p-3 to p-2 for smaller size */}
                  <div
                      className="p-2 rounded-lg backdrop-blur-sm transition-all duration-300
                                bg-gradient-to-br from-red-500/30 to-red-600/10 group-hover:from-red-400/40 group-hover:to-red-500/20"
                  >
                      <Phone className="h-4 w-4 fill-current text-red-400 group-hover:text-white drop-shadow-lg transition-all duration-300 group-hover:scale-110" />
                  </div>
                  {/* Text content - adjusted from text-base to text-sm */}
                  <span className="text-red-400 font-bold text-sm group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                      EMERGENCY
                  </span>
              </div>
            </Link>
          </Button>
        )}
        {/* Find a Doctor Button - Adjusted sizing */}
        <Button asChild
            className={`group relative px-4 py-2 rounded-xl backdrop-blur-xl border-2 border-[${PRIMARY_GREEN_HEX}]/30
                        bg-gradient-to-br from-[${PRIMARY_GREEN_HEX}]/40 via-black/60 to-black/80 shadow-2xl
                        hover:shadow-[${PRIMARY_GREEN_HEX}]/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95
                        transition-all duration-500 ease-out cursor-pointer hover:border-[${MEDIUM_GREEN_HEX}]/60 overflow-hidden
                        `}
        >
            <Link href="/services/find-doctor" className="relative z-10 flex items-center justify-center w-48 h-48">
                {/* Inner absolute divs for hover effects */}
                <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-[${MEDIUM_GREEN_HEX}]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out`}
                ></div>
                <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[${PRIMARY_GREEN_HEX}]/10 via-[${MEDIUM_GREEN_HEX}]/20 to-[${PRIMARY_GREEN_HEX}]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Content of the button (Icon and Text) - ensure z-index to be on top of hover effects */}
                <div className="relative z-20 flex items-center space-x-1">
                    {/* Icon container - adjusted padding from p-3 to p-2 for smaller size */}
                    <div
                        className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300
                                  bg-gradient-to-br from-[${PRIMARY_GREEN_HEX}]/30 to-[${MEDIUM_GREEN_HEX}]/10 group-hover:from-[${MEDIUM_GREEN_HEX}]/40 group-hover:to-[${PRIMARY_GREEN_HEX}]/20`}
                    >
                        {/* Changed icon size from h-6 w-6 to h-4 w-4 to match other buttons */}
                        <Activity className={`h-4 w-4 fill-current text-[${PRIMARY_GREEN_HEX}] group-hover:text-[${LIGHT_GREEN_HEX}] drop-shadow-lg transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    {/* Text content - adjusted from text-base to text-sm */}
                    <span className={`text-[${PRIMARY_GREEN_HEX}] font-bold text-sm group-hover:text-[${LIGHT_GREEN_HEX}] transition-colors duration-300 drop-shadow-sm`}>
                        Find a Doctor
                    </span>
                </div>
      </Link>
  </Button>
  <Button asChild className="bg-primary hover:bg-primary text-white font-semibold shadow-sm">
    <Link href="/get-result">
      <Paperclip className="h-4 w-4 mr-2" />
      Get Result Online
    </Link>
  </Button>
</div>
          </div>
        </div>
      </header>
    </div>
  );
}