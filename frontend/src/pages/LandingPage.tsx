import PublicFooter from "@/components/PublicFooter";
import PublicNavbar from "@/components/PublicNavbar";
import SeoHead from "@/components/SeoHead";
import doctorImage from "@/assets/doctor-new.png";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  HeartPulse,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENABLE_BACKEND_FEATURES } from "@/config/features";
import { BRAND, SEO, SITE } from "@/lib/brand";

const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

const faqs = [
  {
    q: "How do I book a doctor consultation with Dr. JSP in Gorakhpur?",
    a: "Call or WhatsApp the clinic to book an in-person visit at the Rapti Nagar home clinic. Online appointment booking is coming soon.",
  },
  {
    q: "Does Dr. JSP offer video doctor consultations?",
    a: "Yes. Video consultations are available by request. Call or WhatsApp to confirm a time. Online video booking will open in a future release.",
  },
  {
    q: "Where is Dr. JSP’s clinic?",
    a: `${SITE.street}, ${SITE.city}, ${SITE.region} ${SITE.postalCode}. Monday to Saturday, 9 AM to 7 PM.`,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (ENABLE_BACKEND_FEATURES && localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);
  const startConsultation = () => navigate("/appointments");

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/20">
      <SeoHead title={SEO.homeTitle} description={SEO.homeDescription} path="/" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[42rem] overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute right-[-10rem] top-[13rem] h-[28rem] w-[28rem] rounded-full bg-teal-200/25 blur-3xl dark:bg-cyan-500/5" />
      </div>
      <PublicNavbar />
      <main>
        <section
          id="home"
          className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:pb-32 lg:pt-28"
        >
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }} className="relative z-10">
            <motion.div
              variants={reveal}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" /> DOCTOR CONSULTATION IN GORAKHPUR
            </motion.div>
            <motion.h1
              variants={reveal}
              className="max-w-3xl text-5xl font-semibold tracking-[-0.065em] text-foreground sm:text-6xl lg:text-7xl"
            >
              {BRAND.shortName} — a doctor who knows{" "}
              <span className="text-primary">you, not just your symptoms.</span>
            </motion.h1>
            <motion.p variants={reveal} className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              In-person doctor consultations at the Rapti Nagar home clinic, plus video consultations by request.
              Thoughtful, one-to-one care for you and your family—in Hindi, with English understood.
            </motion.p>
            <motion.div variants={reveal} className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={startConsultation}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition duration-300 hover:-translate-y-1 hover:shadow-primary/35"
              >
                View appointments <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/about")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/35 hover:bg-card"
              >
                <Play className="h-4 w-4 fill-current" /> Meet {BRAND.shortName}
              </button>
            </motion.div>
            <motion.div variants={reveal} className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
              {["Nearly 35 years of public service", "Home clinic, Rapti Nagar", "Video doctor consultation"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {item}
                  </span>
                )
              )}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[34rem] lg:max-w-none"
          >
            <div className="absolute -inset-7 rounded-[3rem] bg-gradient-to-br from-primary/20 via-transparent to-cyan-300/25 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-card/70 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10">
              <div className="relative aspect-[4/4.55] overflow-hidden rounded-[1.4rem] bg-slate-100 dark:bg-slate-800">
                <img
                  src={doctorImage}
                  alt={`${BRAND.shortName}, physician at a home clinic in Gorakhpur`}
                  className="h-full w-full object-cover object-top transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent px-6 pb-6 pt-24 text-white">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                    Internal medicine · Gorakhpur
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">{BRAND.navbarName}</h2>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-5 flex items-center gap-3 rounded-2xl border border-white/60 bg-background/90 p-3.5 pr-5 shadow-xl backdrop-blur-xl dark:border-white/10"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">Trusted care</span>
                  <span className="text-xs text-muted-foreground">for every stage of life</span>
                </span>
              </motion.div>
            </div>
          </motion.div>
        </section>
        <section id="video-call" className="border-y border-border/60 bg-card/25 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Video consultations</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                Online doctor consultation, wherever you are.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                Speak with {BRAND.shortName} by video, or visit the Gorakhpur home clinic. Call to confirm a time and
                receive the details personally.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-foreground p-6 text-background shadow-2xl shadow-foreground/15">
                <Video className="h-6 w-6 text-primary" />
                <p className="mt-12 text-xl font-semibold tracking-[-0.035em]">Book a video call</p>
                <p className="mt-2 text-sm leading-6 text-background/65">Online booking is coming soon.</p>
                <a href="/video-call" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  View consultation options <ArrowRight className="h-4 w-4 transition-transform hover:translate-x-1" />
                </a>
                <a href={`tel:${SITE.phone}`} className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">
                  Call {SITE.phoneDisplay}
                </a>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background/70 p-6 backdrop-blur-xl">
                <MapPin className="h-6 w-6 text-primary" />
                <p className="mt-12 text-xl font-semibold tracking-[-0.035em]">Visit the clinic</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {SITE.street}, {SITE.city}.
                </p>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Get directions <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Common questions</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            Finding a doctor consultation near you.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <article
                key={item.q}
                className="rounded-3xl border border-border/70 bg-background/70 p-6 backdrop-blur-xl"
              >
                <h3 className="text-lg font-semibold tracking-[-0.03em]">{item.q}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="experience"
          className={ENABLE_BACKEND_FEATURES ? "mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" : "hidden"}
        >
          <div className="overflow-hidden rounded-[2rem] bg-foreground px-7 py-10 text-background sm:px-12 sm:py-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">A calmer way to care</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                Everything you need, in one considered place.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-background/65">
                From your first appointment to ongoing support, every interaction is designed to feel simple, private and
                reassuring.
              </p>
              {ENABLE_BACKEND_FEATURES ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="mt-9 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:scale-[1.03]"
                >
                  Start your care journey <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={`tel:${SITE.phone}`}
                  className="mt-9 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:scale-[1.03]"
                >
                  <Phone className="h-4 w-4" /> Call the clinic
                </a>
              )}
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3 lg:mt-0">
              <div className="rounded-3xl bg-white/10 p-6">
                <CalendarDays className="h-6 w-6 text-primary" />
                <p className="mt-12 text-3xl font-semibold tracking-[-0.05em]">10K+</p>
                <p className="mt-1 text-sm text-background/60">patients supported</p>
              </div>
              <div className="mt-8 rounded-3xl bg-primary p-6 text-primary-foreground">
                <HeartPulse className="h-6 w-6" />
                <p className="mt-12 text-3xl font-semibold tracking-[-0.05em]">35+</p>
                <p className="mt-1 text-sm text-primary-foreground/70">years of practice</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};
export default LandingPage;
