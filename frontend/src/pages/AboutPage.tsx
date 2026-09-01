import { Award, Building2, GraduationCap, HeartHandshake, Languages, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import PublicFooter from "@/components/PublicFooter";
import PublicNavbar from "@/components/PublicNavbar";
import SeoHead from "@/components/SeoHead";
import { BRAND } from "@/lib/brand";
import { WHATSAPP_URL } from "@/lib/contact";
import doctorImage from "@/assets/doctor-new.png";

const milestones = [
  {
    icon: GraduationCap,
    label: "Medical education",
    title: "MBBS, Gajra Raja Medical College",
    copy: "A foundation in medicine shaped by rigorous clinical training and patient-centred practice.",
  },
  {
    icon: Award,
    label: "Further training",
    title: "PCH, Rani Lakshmi Bai Medical College",
    copy: "Continued professional training with a focus on practical, thoughtful care.",
  },
  {
    icon: Building2,
    label: "Public service",
    title: "Around 35 years in UP Government Health Services",
    copy: "Decades of caring for patients and leading teams across district health institutions.",
  },
];

const AboutPage = () => (
  <div className="app-shell min-h-screen">
    <SeoHead
      title={`${BRAND.shortName} | About the doctor — Gorakhpur home clinic`}
      description={`${BRAND.navbarName} offers doctor consultations in Gorakhpur after nearly 35 years in public health. Home clinic in Rapti Nagar. Speaks Hindi, understands English.`}
      path="/about"
    />
    <PublicNavbar />
    <main>
      <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-white/50 bg-card/70 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10"
          >
            <img
              src={doctorImage}
              alt={`${BRAND.shortName} at the Gorakhpur home clinic`}
              className="aspect-[4/4.3] w-full rounded-[1.4rem] object-cover object-top"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">About the doctor</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
              Experience built through a lifetime of service.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {BRAND.navbarName} ({BRAND.legalName}) brings nearly 35 years of public-health
              experience to a personal clinic setting—offering doctor consultations that are
              attentive, practical and grounded in decades of clinical responsibility.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium text-foreground">
              <Languages className="h-4 w-4 text-primary" />
              Speaks Hindi and understands English
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
              >
                Start a conversation
              </a>
              <a
                href="https://maps.app.goo.gl/zLogSQaep5GKxDGr9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-5 py-3 text-sm font-semibold"
              >
                <MapPin className="h-4 w-4 text-primary" /> Visit the clinic
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/25 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {milestones.map(({ icon: Icon, label, title, copy }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-3xl border border-border/70 bg-background/70 p-7 backdrop-blur-xl"
              >
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-10 text-xs font-semibold uppercase tracking-[0.15em] text-primary">{label}</p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-[2rem] bg-foreground p-8 text-background sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
            <HeartHandshake className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Leadership in care</p>
              <p className="mt-3 max-w-4xl text-xl leading-8 text-background/80">
                He served as Superintendent-in-Charge at Gorakhpur District Male Hospital and at
                Mau District Female Hospital, combining clinical work with responsibility for
                public healthcare delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
);

export default AboutPage;
