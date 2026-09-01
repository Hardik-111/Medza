import { CalendarDays, Lock, MessageCircle, QrCode, Sparkles, Video } from "lucide-react";
import { motion } from "framer-motion";

import PublicFooter from "@/components/PublicFooter";
import PublicNavbar from "@/components/PublicNavbar";
import SeoHead from "@/components/SeoHead";
import { teleconsultPlans } from "@/components/ServicesSection";
import { BRAND } from "@/lib/brand";
import { WHATSAPP_URL } from "@/lib/contact";

const VideoCallPage = () => (
  <div className="app-shell min-h-screen">
    <SeoHead
      title={`${BRAND.shortName} | Video doctor consultation from Gorakhpur`}
      description={`Video doctor consultation with ${BRAND.shortName}. Speak from home in Hindi or English. Call or WhatsApp to arrange a time. Online booking is coming soon.`}
      path="/video-call"
    />
    <PublicNavbar />
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Coming in a future release
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
            A personal consultation, wherever you are.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Secure online booking and two-way video consultations are not live yet. The experience
            below is a preview; every booking, payment and call control remains disabled.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {teleconsultPlans.map((plan) => (
            <article key={plan.title} className="rounded-3xl border border-border/70 bg-background/70 p-6 backdrop-blur-xl">
              <Video className="h-5 w-5 text-primary" />
              <h2 className="mt-8 font-semibold tracking-[-0.025em]">{plan.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{plan.duration}</p>
              <p className="mt-5 text-xl font-semibold text-primary">{plan.price}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div
            aria-disabled="true"
            className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/60 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur-xl sm:p-8"
          >
            <div className="absolute inset-0 z-10 cursor-not-allowed bg-background/45 backdrop-grayscale" />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
              <div className="max-w-xs rounded-2xl border border-border/70 bg-background/90 p-5 text-center shadow-xl backdrop-blur-xl">
                <Lock className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">Video booking is disabled</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  No API, payment, camera or call-room action can be started from this page.
                </p>
              </div>
            </div>
            <div className="space-y-5 opacity-50">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Preferred date
                  <input disabled type="date" className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
                </label>
                <label className="text-sm font-medium">
                  Time slot
                  <select disabled className="mt-2 w-full rounded-xl border bg-background px-4 py-3">
                    <option>Select a time</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium">
                Consultation duration
                <select disabled className="mt-2 w-full rounded-xl border bg-background px-4 py-3">
                  <option>Standard — 15 minutes</option>
                </select>
              </label>
              <div className="rounded-2xl border bg-primary/5 p-5">
                <p className="flex items-center gap-2 font-semibold"><QrCode className="h-5 w-5 text-primary" /> QR payment</p>
                <p className="mt-2 text-sm text-muted-foreground">Payment will only become available when video booking launches.</p>
              </div>
              <button disabled className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                Book and pay
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[2rem] bg-foreground p-8 text-background">
            <div>
              <CalendarDays className="h-7 w-7 text-primary" />
              <p className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Until launch</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Speak with the clinic directly.</h2>
              <p className="mt-4 text-sm leading-7 text-background/65">
                We can discuss your needs and guide you to the appropriate in-person consultation.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
);

export default VideoCallPage;
