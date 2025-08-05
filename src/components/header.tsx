"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Paperclip, MapPin, ChevronDown, Activity } from "lucide-react";
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

const NON_EMERGENCY_NUMBER = {
  display: "(02) 8820-9375",
  tel: "+0288209375"
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

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [mobileContactDropdownOpen, setMobileContactDropdownOpen] = useState(false);
  const [mobileServicesDropdownOpen, setMobileServicesDropdownOpen] = useState(false);
  const [isIsoImageOpen, setIsIsoImageOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isNonEmergencyModalOpen, setIsNonEmergencyModalOpen] = useState(false);
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

  const NavLinkItem = ({ href, label, dropdown, isMobile = false }: { href: string; label: string; dropdown?: Array<{ href: string, label: string }>; isMobile?: boolean }) => {
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

  const PhoneCallModal = ({ isOpen, onOpenChange, title, number, numberDisplay, buttonColor }: { isOpen: boolean, onOpenChange: (open: boolean) => void, title: string, number: string, numberDisplay: string, buttonColor: string }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-6 text-center">
        <div className="relative">
          <DialogClose className="absolute -right-6 -top-6 z-20 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md">
            <X className="h-5 w-5 text-gray-500" />
          </DialogClose>
          <div className="flex flex-col items-center p-4">
            <Phone className={cn("h-10 w-10 mb-4", buttonColor)} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 mb-6">
              You are about to make a phone call to our {title} line.
            </p>
            <a
              href={`tel:${number}`}
              onClick={() => onOpenChange(false)}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-bold text-white transition-colors text-lg",
                buttonColor === 'text-red-600' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'
              )}
            >
              Call {numberDisplay}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-md">
      <PhoneCallModal
        isOpen={isNonEmergencyModalOpen}
        onOpenChange={setIsNonEmergencyModalOpen}
        title="Non-Emergency"
        number={NON_EMERGENCY_NUMBER.tel}
        numberDisplay={NON_EMERGENCY_NUMBER.display}
        buttonColor="text-primary"
      />

      <PhoneCallModal
        isOpen={isEmergencyModalOpen}
        onOpenChange={setIsEmergencyModalOpen}
        title="Emergency"
        number={EMERGENCY_NUMBER.tel}
        numberDisplay={EMERGENCY_NUMBER.display}
        buttonColor="text-red-600"
      />

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
                <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-xs uppercase tracking-wide leading-none">Non-Emergency</p>
                  <button onClick={() => setIsNonEmergencyModalOpen(true)} className="text-slate-800 hover:text-accent font-semibold text-sm transition-colors cursor-pointer">{NON_EMERGENCY_NUMBER.display}</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                  <Phone className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-600 text-xs uppercase tracking-wide leading-none">24/7 Emergency</p>
                  <button onClick={() => setIsEmergencyModalOpen(true)} className="text-slate-800 hover:text-red-600 font-semibold text-sm transition-colors cursor-pointer">{EMERGENCY_NUMBER.display}</button>
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
                  <DialogContent className="max-w-xl p-6">
                    <div className="relative bg-white rounded-lg overflow-hidden">
                      <DialogClose className="absolute -right-2 -top-2 z-20 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md">
                      </DialogClose>
                      <div className="flex flex-col">
                        <Image
                          src="/iso.jpg"
                          alt="ISO Certification"
                          width={800}
                          height={600}
                          className="w-full h-auto"
                        />
                        <a
                          href="https://www.certipedia.com/quality_marks/9108656567?locale=en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-4 bg-white text-primary hover:text-primary/80 font-medium transition-colors border-t"
                        >
                          View Information
                        </a>
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
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Non-Emergency</p>
                          <button onClick={() => { setIsNonEmergencyModalOpen(true); setIsMobileMenuOpen(false); }} className="text-slate-800 hover:text-primary font-semibold text-sm transition-colors cursor-pointer">{NON_EMERGENCY_NUMBER.display}</button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Emergency</p>
                          <button onClick={() => { setIsEmergencyModalOpen(true); setIsMobileMenuOpen(false); }} className="text-slate-800 hover:text-red-600 font-semibold text-sm transition-colors cursor-pointer">{EMERGENCY_NUMBER.display}</button>
                        </div>
                      </div>

                      {/* Add the ISO section here */}
                      <div className="mt-6 pt-6 border-t border-slate-300">
                        <button
                          onClick={() => {
                            setIsIsoImageOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="cursor-pointer transition-opacity hover:opacity-100"
                        >
                          <Image
                            src="/iso.jpg"
                            alt="ISO 9001:2015 Certified"
                            width={100}
                            height={40}
                            className="opacity-80 hover:opacity-100 transition-opacity"
                          />
                        </button>
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
                <>
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                    <button onClick={() => setIsNonEmergencyModalOpen(true)}>
                      <Phone className="h-4 w-4 mr-2" />
                      NON-EMERGENCY
                    </button>
                  </Button>
                  <Button asChild variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300">
                    <button onClick={() => setIsEmergencyModalOpen(true)}>
                      <Phone className="h-4 w-4 mr-2" />
                      EMERGENCY
                    </button>
                  </Button>
                </>
              )}
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white hover:border-primary">
                <Link href="/services/find-doctor">
                  <Activity className="h-4 w-4 mr-2" />
                  Find a Doctor
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