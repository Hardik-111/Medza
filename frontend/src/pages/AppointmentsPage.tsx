import { Bell, CalendarCheck, Clock3, Lock, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import PublicFooter from "@/components/PublicFooter";
import PublicNavbar from "@/components/PublicNavbar";
import SeoHead from "@/components/SeoHead";
import { BRAND } from "@/lib/brand";
import { WHATSAPP_URL } from "@/lib/contact";

const slots = [
  { time: "9:00 AM", booked: true },
  { time: "10:00 AM", booked: false },
  { time: "11:00 AM", booked: true },
  { time: "2:00 PM", booked: false },
  { time: "4:00 PM", booked: false },
  { time: "6:00 PM", booked: true },
];

const AppointmentsPage = () => (
  <div className="app-shell min-h-screen">
    <SeoHead
      title={`${BRAND.shortName} | Book a doctor appointment in Gorakhpur`}
      description={`Request a doctor appointment with ${BRAND.shortName} at the Rapti Nagar home clinic in Gorakhpur. Call or WhatsApp to book. Online scheduling is coming soon.`}
      path="/appointments"
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
            Appointments, made calmer.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Online scheduling is being prepared carefully. When it launches, you will be able to
            see availability, request a time and receive confirmation directly from the clinic.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div
            aria-disabled="true"
            className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/60 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur-xl sm:p-8"
          >
            <div className="absolute inset-0 z-10 cursor-not-allowed bg-background/35 backdrop-grayscale-[35%]" />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
              <div className="max-w-xs rounded-2xl border border-border/70 bg-background/90 p-5 text-center shadow-xl backdrop-blur-xl">
                <Lock className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">Online booking is not available yet</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The fields below are a preview of the future experience.
                </p>
              </div>
            </div>
            <div className="space-y-6 opacity-60">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  Full name
                  <input disabled className="mt-2 w-full rounded-xl border bg-background px-4 py-3" placeholder="Your name" />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Phone number
                  <input disabled className="mt-2 w-full rounded-xl border bg-background px-4 py-3" placeholder="+91" />
                </label>
              </div>
              <label className="block space-y-2 text-sm font-medium">
                Consultation
                <select disabled className="mt-2 w-full rounded-xl border bg-background px-4 py-3">
                  <option>First visit</option>
                </select>
              </label>
              <div>
                <p className="text-sm font-medium">Available time</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      disabled
                      key={slot.time}
                      className={`rounded-xl border px-3 py-3 text-xs font-medium ${
                        slot.booked ? "bg-muted text-muted-foreground line-through opacity-50" : "bg-background"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
              <button disabled className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                Request appointment
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Clock3,
                title: "Clear availability",
                copy: "Unavailable dates and booked time slots will appear muted and cannot be selected.",
              },
              {
                icon: CalendarCheck,
                title: "Doctor confirmation",
                copy: "The clinic will review each request before the appointment is confirmed.",
              },
              {
                icon: Bell,
                title: "Patient updates",
                copy: "Confirmation and schedule changes will be shared with the patient after review.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-border/70 bg-background/70 p-6 backdrop-blur-xl">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] bg-foreground p-7 text-background sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="text-xl font-semibold">Need an appointment now?</p>
            <p className="mt-2 text-sm text-background/65">Contact the clinic directly and we will help find a suitable time.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground sm:mt-0"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp the clinic
          </a>
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
);

export default AppointmentsPage;
