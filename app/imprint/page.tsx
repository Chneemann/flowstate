/**
 * @file app/imprint/page.tsx
 * @description Server component rendering the legal notice (imprint) page with a title header and back button navigation.
 */

import { GoBackButton } from "../components/ui/buttons/GoBackButton";

/**
 * Renders the imprint/legal notice page containing the main title and layout container.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered imprint page component.
 */
export default async function ImprintPage() {
  return (
    <section className="flex-1 overflow-y-auto w-full">
      <div className="relative p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">
          Legal Notice<span className="text-primary">.</span>
        </h1>
        <GoBackButton />
        <div className="space-y-6 text-sm mt-3 text-foreground-muted leading-relaxed">
          {/* Information in accordance with § 5 DDG & § 18 MStV */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Information Pursuant to §
              5 DDG
            </h2>
            <div className="font-mono text-xs bg-background/60 p-4 rounded-xl border border-border text-foreground">
              <p className="font-semibold">André Kempf</p>
              <p className="text-primary-hover">Full-Stack Web Developer</p>
              <p>Großschneidersweg 2a</p>
              <p>76149 Karlsruhe, Germany</p>
            </div>
            <p className="text-xs text-foreground-muted">
              Also responsible for content pursuant to § 18 Abs. 2 MStV.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Contact
            </h2>
            <div className="p-4 rounded-xl bg-background/60 border border-border font-mono text-xs">
              <p className="text-foreground-muted">
                <span className="text-foreground">Email:</span>{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  dev@andre-kempf.com
                </span>
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Disclaimer & Legal Notes
            </h2>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-sm">
                Liability for Content
              </h3>
              <p>
                As a service provider, I am responsible for my own content on
                these pages according to general laws pursuant to § 7 Abs. 1
                DDG. However, according to §§ 8 to 10 DDG, I am not obligated to
                monitor transmitted or stored third-party information or to
                investigate circumstances that indicate illegal activity.
              </p>
            </div>
            <div className="space-y-1 pt-3 border-t border-border">
              <h3 className="font-semibold text-foreground text-sm">
                Liability for Links
              </h3>
              <p>
                My website contains links to external third-party websites over
                whose content I have no control. Therefore, I cannot accept any
                liability for these external contents. The respective provider
                or operator of the pages is always responsible for the content
                of the linked pages.
              </p>
            </div>
            <div className="space-y-1 pt-3 border-t border-border">
              <h3 className="font-semibold text-foreground text-sm">
                Copyright
              </h3>
              <p>
                The content and works created on these pages are subject to
                German copyright law. Duplication, processing, distribution, or
                any form of commercialization beyond the scope of copyright law
                require the prior written consent of the author or creator.
              </p>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-mono">
              <span className="text-primary">//</span> Dispute Resolution
            </h2>
            <p>
              The European Commission provides a platform for online dispute
              resolution (OS):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .<br />I am neither willing nor obligated to participate in
              dispute resolution proceedings before a consumer arbitration
              board.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
