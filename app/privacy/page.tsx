/**
 * @file app/privacy/page.tsx
 * @description Server component rendering the privacy policy page with a title header and back button navigation.
 */

import { GoBackButton } from "../components/ui/buttons/GoBackButton";

/**
 * Renders the privacy policy page containing the main title and layout container alongside a back navigation button.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered privacy policy page component.
 */
export default async function PrivacyPage() {
  return (
    <section className="flex-1 overflow-y-auto w-full">
      <div className="relative p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">
          Privacy Policy<span className="text-primary">.</span>
        </h1>
        <GoBackButton />
        <div className="space-y-6 text-sm mt-3 text-foreground-muted leading-relaxed">
          {/* Overview */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Data Protection at a
              Glance
            </h2>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">
                General Information
              </h3>
              <p>
                The following notes provide a simple overview of what happens to
                your personal data when you visit this website. Personal data is
                any data that can be used to personally identify you.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">
                Data Collection on This Website
              </h3>
              <p>
                Data processing on this website is carried out by the website
                operator. Your data is collected when you provide it to us, or
                automatically by our IT systems when you visit the site.
              </p>
            </div>
          </div>

          {/* Responsible Party */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Responsible Party
              (Controller)
            </h2>
            <p>
              The controller responsible for data processing on this website is:
            </p>
            <div className="font-mono text-xs bg-background/60 p-4 rounded-xl border border-border text-foreground space-y-1">
              <p className="font-semibold">André Kempf</p>
              <p>Großschneidersweg 2a</p>
              <p>76149 Karlsruhe, Germany</p>
              <p className="pt-2">
                Email:{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  dev@andre-kempf.com
                </span>
              </p>
            </div>
          </div>

          {/* Hosting & Server Log Files */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Hosting & Server
              Infrastructure
            </h2>
            <p>
              This website is hosted externally on web servers operated by
              Netcup GmbH. Personal data processed on this website is stored on
              the host&apos;s secure servers.
            </p>
            <p>
              The hosting provider automatically processes technical access data
              in server environment variables necessary to establish a stable
              connection and deliver page assets securely.
            </p>
          </div>

          {/* Server Analytics */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Server Analytics &
              Privacy-First Tracking
            </h2>
            <p>
              To evaluate website reach and optimize user experience, this
              website processes minimal access metrics (e.g., total daily views,
              coarse device category, and daily visitor counts).
            </p>
            <div className="p-4 rounded-xl bg-background/60 border border-border space-y-2 text-xs font-mono">
              <p className="text-emerald-400 font-semibold">
                // Key privacy guarantees:
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground-muted">
                <li>
                  <strong className="text-foreground">No Cookies:</strong> We do
                  not store cookies or local storage identifiers on your device.
                </li>
                <li>
                  <strong className="text-foreground">Anonymized IPs:</strong>{" "}
                  IP addresses are instantly hashed with a daily salt and never
                  stored in plain text.
                </li>
                <li>
                  <strong className="text-foreground">
                    Zero Third Parties:
                  </strong>{" "}
                  Analytics data is processed locally on our own server and
                  never shared with external tracking services.
                </li>
              </ul>
            </div>
            <p className="text-xs text-foreground-muted">
              The legal basis for this processing is our legitimate interest in
              maintaining and optimizing our online portfolio (Art. 6(1)(f)
              GDPR).
            </p>
          </div>

          {/* Your Rights */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Your Rights
            </h2>
            <p>
              You have the right at any time to receive information free of
              charge about the origin, recipient, and purpose of your stored
              personal data. You also have a right to request the correction or
              deletion of this data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
