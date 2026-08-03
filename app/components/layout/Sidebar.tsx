import BrandLogo from "./BrandLogo";
import Navbar from "./Navbar";
import SignOutButton from "./buttons/SignOutButton";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col justify-between h-full w-64 p-6 select-none border-r border-border shrink-0">
      {/* Upper Section */}
      <div className="flex flex-col">
        <BrandLogo />
        <Navbar />
      </div>

      {/* Lower Section */}
      <div className="flex justify-center">
        <SignOutButton />
      </div>
    </aside>
  );
}
