export default function AuthShell({ children }) {
  return (
    <div className="relative isolate grid min-h-screen place-items-center overflow-hidden px-4 pb-10 pt-24">
      <div aria-hidden="true" className="absolute -z-10 h-80 w-80 animate-float rounded-full bg-brand/20 blur-3xl" style={{ top: '15%', left: '10%' }} />
      <div aria-hidden="true" className="absolute -z-10 h-72 w-72 animate-float-slow rounded-full bg-saffron/20 blur-3xl" style={{ bottom: '10%', right: '8%' }} />
      {children}
    </div>
  );
}
