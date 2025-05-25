export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-4 bg-black text-cyan-400 border-t border-cyan-700 text-center font-mono shadow-[0_-2px_10px_rgba(0,255,255,0.3)]">
      <p className="text-sm tracking-widest">{year} - Yuma Nur Alfath </p>
    </footer>
  );
};
