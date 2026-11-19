import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const socialLinks = [
  { label: "X", href: "https://x.com/" },
  { label: "Facebook", href: "https://facebook.com/" },
  { label: "Instagram", href: "https://instagram.com/" },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[#29130f] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-14 lg:grid-cols-4 lg:gap-12 lg:px-8">

        {/* Brand */}
        <div className="sm:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🍕</span>
            <span className="text-2xl font-extrabold">
              Pizza<span className="text-orange-400">Hub</span>
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-orange-100/70">
            Discover local pizza restaurants, explore delicious menus,
            and enjoy a simple food ordering experience with PizzaHub.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition hover:bg-orange-600"
              >
                {social.label.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold">Quick Links</h3>

          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-orange-100/70 transition hover:text-orange-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold">Contact Us</h3>

          <div className="mt-5 space-y-4 text-sm text-orange-100/70">
            <p className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-orange-400" />
              <span>Find your favorite local pizza restaurants.</span>
            </p>

            <p className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-orange-400" />
              <a
                href="mailto:support@pizzahub.example"
                className="break-all transition hover:text-orange-400"
              >
                Contact Support
              </a>
            </p>

            <p className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-orange-400" />
              <span>Customer Support</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-orange-100/50 sm:px-6 md:flex-row md:text-left lg:px-8">
          <p>
            © {currentYear} PizzaHub. All rights reserved.
          </p>

          <p>
            Made with ❤️ for pizza lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
