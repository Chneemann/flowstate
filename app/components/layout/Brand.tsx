export default function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9">
        <img
          src="logo.png"
          alt="Flowstate Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-widest flex items-center gap-1.5">
          Flowstate
        </h1>
        <p className="text-xs text-muted font-medium tracking-widest">
          Workspace Edition
        </p>
      </div>
    </div>
  );
}
