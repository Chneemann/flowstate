/**
 * @file app/page.tsx
 * @description Welcome landing page with responsive hero section, features showcase, and auth check.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Footer from "@/app/components/layout/Footer";
import { Zap, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";

/**
 * Properties for a feature item displayed in the features showcase.
 *
 * @interface Feature
 * @property {string} id - Unique identifier for the feature.
 * @property {string} title - The title of the feature.
 * @property {string} description - Explanatory text detailing the feature.
 * @property {React.ReactNode} icon - Icon element representing the feature.
 */
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: "velocity",
    title: "Hyper Velocity",
    description:
      "Eliminate switching friction with optimized workflows keeping you directly in the zone.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "metrics",
    title: "Clean Metrics",
    description:
      "Visualize focus states and process summaries clearly without visual clutter.",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: "security",
    title: "Full Security",
    description:
      "Encrypted data and robust authentication guards protecting your workspace session.",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
];

/**
 * Renders the welcome landing page with session validation and responsive layout.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered welcome page component.
 */
export default async function WelcomePage() {
  const session = typeof auth === "function" ? await auth() : null;

  if (session) {
    redirect("/summary");
  }

  return (
    <div className="relative min-h-dvh w-full flex flex-col justify-between overflow-x-hidden bg-background text-foreground selection:bg-primary selection:text-background">
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-20 sm:-top-32 -z-10 transform-gpu overflow-hidden blur-2xl sm:blur-3xl"
      >
        <div
          className="relative left-[calc(50%-10rem)] aspect-1155/678 w-20rem sm:w-50rem -translate-x-1/2 rotate-30deg bg-linear-to-tr from-accent to-primary opacity-20 sm:opacity-15"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto z-10">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Master your work in seamless{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Flowstate
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-foreground-muted max-w-xl mx-auto leading-relaxed px-2">
            Eliminate friction, organize your focus, and achieve effortless
            productivity with your modern workspace companion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-3 w-full max-w-xs sm:max-w-none mx-auto">
            <Link
              href="/register/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-primary text-background shadow-md hover:bg-primary-hover transition-colors duration-200 gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg border border-border bg-card hover:bg-border/40 text-foreground transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Showcase */}
        <section
          aria-label="Key Features"
          className="mt-8 sm:mt-12 w-full max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((feature) => (
              <article
                key={feature.id}
                className="group relative flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 p-4 sm:p-5 rounded-xl border border-border bg-card backdrop-blur-sm transition-all duration-300 hover:border-primary/40"
              >
                <div className="shrink-0 sm:mb-3 rounded-lg p-2.5 bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-background">
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground mb-0.5 sm:mb-1">
                    {feature.title}
                  </h2>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
