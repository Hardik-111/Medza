import { Check, Clock3, Stethoscope, Video } from "lucide-react";
import { motion } from "framer-motion";

import PricingTablePDF from "@/components/PricingTablePDF";
import PublicFooter from "@/components/PublicFooter";
import PublicNavbar from "@/components/PublicNavbar";
import SeoHead from "@/components/SeoHead";
import { consultationPlans, teleconsultPlans } from "@/components/ServicesSection";
import { BRAND } from "@/lib/brand";
import { WHATSAPP_URL } from "@/lib/contact";

const PlansPage = () => (
  <div className="app-shell min-h-screen">
    <SeoHead
      title={`${BRAND.shortName} | Consultation fees and plans in Gorakhpur`}
      description={`Consultation plans with ${BRAND.shortName} in Gorakhpur — in-person visits and video doctor consultations. Clear fees, WhatsApp support.`}
      path="/plans"
    />
    <PublicNavbar />
    <main>
      <section className="relative overflow-hidden px-5 pb-14 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Clear and considered</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
            Care plans without the guesswork.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Choose a single consultation or a plan for ongoing support. Appointment and video
            booking will open in a future release; you can contact the clinic now for help choosing.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            Ask about a plan on WhatsApp
          </a>
        </motion.div>
      </section>

      <section className="border-y border-border/60 bg-card/25 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">In person</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">Appointment plans</h2>
            </div>
            <Stethoscope className="hidden h-8 w-8 text-primary sm:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {consultationPlans.map((plan, index) => (
              <motion.article
                key={plan.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.06 }}
                className="rounded-3xl border border-border/70 bg-background/75 p-6 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">{plan.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {plan.price}
                  </span>
                </div>
                <div className="mt-6 flex gap-4 border-y border-border/60 py-3 text-xs text-muted-foreground">
                  <span>{plan.validity}</span>
                  <span>{plan.visits} visit{plan.visits === "1" ? "" : "s"}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">From home</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">Video consultation plans</h2>
              <p className="mt-3 text-sm text-muted-foreground">Preview only—online video booking is not live yet.</p>
            </div>
            <Video className="hidden h-8 w-8 text-primary sm:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {teleconsultPlans.map((plan) => (
              <article key={plan.title} className="rounded-3xl bg-foreground p-7 text-background">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">{plan.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-background/65">{plan.description}</p>
                  </div>
                  <p className="shrink-0 text-lg font-semibold text-primary">{plan.price}</p>
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm text-background/65">
                  <Clock3 className="h-4 w-4 text-primary" /> {plan.duration}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-12">
            <PricingTablePDF />
          </div>
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
);

export default PlansPage;
