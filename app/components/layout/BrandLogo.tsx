/**
 * @file BrandLogo.tsx
 * @description Client/Server component rendering the application brand logo and title header.
 */

import React from "react";

/**
 * Renders the brand logo image along with the application name and edition subtitle.
 *
 * @returns {JSX.Element} The rendered brand logo component.
 */
export default function BrandLogo() {
  return (
    <div className="flex items-center gap-3 mr-2">
      <div className="w-9 h-9">
        <img
          src="/logo.png"
          alt="Flowstate Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-widest flex items-center gap-1.5">
          Flowstate
        </h1>
        <p className="text-xs text-foreground-muted font-medium tracking-widest">
          Workspace Edition
        </p>
      </div>
    </div>
  );
}
