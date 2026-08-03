import Brand from "./Brand";
import Navbar from "./Navbar";

export default function Sidebar() {
  return (
    <aside className="flex-col h-full w-64 p-6 select-none border-r border-border shrink-0">
      {/* Brand Element */}
      <Brand />
      {/* Navbar Element */}
      <Navbar />
    </aside>
  );
}
