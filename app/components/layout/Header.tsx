import Brand from "./Brand";
import Image from "next/image";

export default function Header() {
  return (
    <header className="h-20 border-b border-border backdrop-blur-md p-4 flex items-center md:justify-end justify-between sticky top-0 z-50">
      {/* Brand Element */}
      <div className="md:hidden flex items-center gap-3">
        <Brand />
      </div>
      {/* User Profil */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full relative overflow-hidden border border-border">
          <Image
            src="https://randomuser.me/api/portraits/women/1.jpg"
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm">Charlotte W.</p>
          <p className=" text-muted text-xs">Online</p>
        </div>
      </div>
    </header>
  );
}
