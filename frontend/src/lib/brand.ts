export const BRAND = {
  monogram: "JSP",
  shortName: "Dr. JSP",
  navbarName: "Dr. JSP Singh",
  fullName: "Dr. JSP Singh's Home Clinic",
  paymentName: "Dr. JSP Singh Clinic",
  /** Full registered name, kept for search and structured data. */
  legalName: "Dr. Jayshankar Prasad Singh",
} as const;

const rawSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const SITE = {
  url: (rawSiteUrl || "https://drjsp.in").replace(/\/$/, ""),
  ogImage: "/og-doctor.png",
  phone: "+917905152928",
  phoneDisplay: "+91 7905152928",
  email: "drjsp@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/zLogSQaep5GKxDGr9",
  street: "H-20, Rapti Nagar, Phase-4",
  city: "Gorakhpur",
  region: "Uttar Pradesh",
  postalCode: "273013",
  country: "IN",
} as const;

export const SEO = {
  homeTitle: "Dr. JSP | Doctor Consultation in Gorakhpur — Home Clinic & Video",
  homeDescription:
    "Book a doctor consultation with Dr. JSP in Gorakhpur. Home clinic in Rapti Nagar for in-person visits and video consultations. Speaks Hindi, understands English. MBBS, 35 years of care.",
  keywords:
    "Dr JSP, Dr JSP Singh, Dr JSP Gorakhpur, doctor consultation Gorakhpur, doctor near me Gorakhpur, video doctor consultation, online doctor consultation, home clinic Rapti Nagar, family doctor Gorakhpur, physician Gorakhpur, internal medicine clinic, Hindi speaking doctor, book doctor appointment Gorakhpur",
} as const;
