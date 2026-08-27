/**
 * @file app/components/ui/buttons/ActionButton.tsx
 * @description Client/Server UI component rendering a styled link button with customizable variants and optional Lucide icons.
 */

import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

/**
 * Properties for the ActionButton component.
 *
 * @interface ActionButtonProps
 * @extends {ButtonHTMLAttributes<HTMLButtonElement>}
 * @property {string} [href] - Optional navigation target URL. Renders a Next.js Link component if defined.
 * @property {"primary" | "secondary" | "danger"} [variant="primary"] - Visual style variant of the button.
 * @property {ReactNode} children - Button label content or child nodes.
 * @property {LucideIcon} [icon] - Optional Lucide icon component to display alongside the text label.
 */
interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
  icon?: LucideIcon;
}

/**
 * Renders a customizable button or link element styled with Tailwind CSS, supporting variants, icons, and disabled states.
 *
 * @param {ActionButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered button or link component.
 */
export function ActionButton({
  href,
  variant = "primary",
  children,
  icon: Icon,
  type = "button",
  disabled,
  className = "",
  ...props
}: ActionButtonProps) {
  const baseStyles =
    "group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-medium transition-all duration-200 ease-out active:scale-[0.97] px-4 py-2.5 rounded-xl text-sm tracking-wide shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-background font-semibold hover:bg-primary-hover hover:text-foreground hover:-translate-y-0.5 hover:shadow-md",
    secondary:
      "bg-card text-foreground border border-foreground-muted/50 hover:bg-background-muted hover:border-foreground hover:-translate-y-0.5",
    danger:
      "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive hover:text-foreground hover.border-destructive hover:-translate-y-0.5",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  const content = (
    <>
      {Icon && (
        <Icon className="w-4 h-4 transition-transform duration-200 ease-out group-hover:scale-110 shrink-0" />
      )}
      <span>{children}</span>
    </>
  );

  // If an href is passed -> Link button
  if (href) {
    return (
      <Link
        href={disabled ? "#" : href}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
        className={`${combinedStyles} ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {content}
      </Link>
    );
  }

  // Otherwise, it's a real HTML button
  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedStyles}
      {...props}
    >
      {content}
    </button>
  );
}
