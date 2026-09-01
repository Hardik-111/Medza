import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

import { BRAND } from "@/lib/brand";
import { WHATSAPP_URL } from "@/lib/contact";

const PublicFooter = () => (
  <footer className="border-t border-border/60 py-10">
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-8">
      <Link to="/" className="flex items-center gap-2 text-foreground">
        <HeartPulse className="h-4 w-4 text-primary" />
        <span className="font-semibold">{BRAND.fullName}</span>
      </Link>
      <p>H-20, Rapti Nagar, Phase-4, Gorakhpur</p>
      <div className="flex items-center gap-4">
        <a className="transition hover:text-foreground" href="tel:+917905152928">
          +91 7905152928
        </a>
        <a
          className="text-primary transition hover:text-foreground"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
