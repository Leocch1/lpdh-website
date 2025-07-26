import { Facebook } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#" },
  ];

  const exploreLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Our Services" },
    { href: "/updates", label: "Updates" },
    { href: "/contact", label: "Contact Us" },
  ];

  const legalLinks = [
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Privacy Policy" },
  ];

  return (
    <footer style={{ backgroundColor: '#47524A' }} className="text-white">
      <div className="container mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left col-span-1 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-white/80">
              Your health, our commitment. Providing compassionate care for our community.
            </p>
            <div className="mt-8 flex gap-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                  <social.icon className="h-6 w-6" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3 sm:text-left">
            <div>
              <p className="font-semibold text-white">Explore</p>
              <nav className="mt-4 flex flex-col space-y-2">
                {exploreLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="font-semibold text-white">Legal</p>
              <nav className="mt-4 flex flex-col space-y-2">
                {legalLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-sm text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="font-semibold text-white">Contact Information</p>
              <div className="mt-4 space-y-2 text-sm text-white/80">
                <p>#8009 CAA Road, Pulanglupa II, Las Pinas City</p>
                <p>(02) 8825 - 5236</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Las Pinas Doctors Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
