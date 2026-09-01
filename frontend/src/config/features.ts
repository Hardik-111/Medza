/**
 * Keep this false while the site is operating as a public, frontend-only clinic site.
 * Set VITE_ENABLE_BACKEND_FEATURES=true to restore authentication, profile, booking,
 * payments, and the authenticated dashboard.
 */
export const ENABLE_BACKEND_FEATURES = import.meta.env.VITE_ENABLE_BACKEND_FEATURES === "true";
