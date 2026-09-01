import { Menu, Phone } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BRAND } from "@/lib/brand";
import { WHATSAPP_URL } from "@/lib/contact";

const links = [
  { label: "Home", to: "/" },
  { label: "Plans", to: "/plans" },
  { label: "Appointments", to: "/appointments" },
  { label: "Video call", to: "/video-call" },
  { label: "About", to: "/about" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${
    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  }`;

const PublicNavbar = () => (
  <header className="glass-navbar sticky top-0 z-50 border-b">
    <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
      <Link to="/" className="group flex items-center gap-2.5" aria-label={`${BRAND.fullName} home`}>
        <span className="relative flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-foreground text-background shadow-lg shadow-foreground/10 transition-transform group-hover:scale-105">
          <span className="text-[11px] font-bold leading-none tracking-[0.06em]">{BRAND.monogram}</span>
          <svg
            viewBox="0 0 28 7"
            aria-hidden="true"
            className="mt-0.5 h-2 w-7 fill-none stroke-primary"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 4h5l2-2.5L11 6l3-5 3 3h10" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.03em]">{BRAND.navbarName}</span>
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"} className={navLinkClass}>
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg shadow-foreground/15 transition hover:-translate-y-0.5 sm:inline-flex"
        >
          WhatsApp
        </a>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col">
            <div className="mt-8 flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-medium transition ${
                      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-auto space-y-3 border-t pt-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background"
              >
                Contact on WhatsApp
              </a>
              <a
                href="tel:+917905152928"
                className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <Phone className="h-4 w-4" /> +91 7905152928
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  </header>
);

export default PublicNavbar;
