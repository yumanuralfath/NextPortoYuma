import { apps } from "./AppsLists";

interface AppCardProps {
  name: string;
  image: string;
  link: string;
}

const AppCard = ({ name, image, link }: AppCardProps) => {
  return (
    <a
      href={link}
      rel="noopener noreferrer"
      className="flex flex-col items-center bg-black/70 border border-cyan-400 rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/40"
    >
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-lg shadow-md border border-pink-500"
      />
      <span className="mt-4 text-lg font-semibold text-cyan-300">{name}</span>
    </a>
  );
};

const BoxApp = () => {
  return (
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-black via-[#0f0f1b] to-black text-white font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1a1a2e] border border-purple-500 rounded-3xl shadow-[0_0_20px_rgba(255,0,255,0.3)] p-10">
          <h2 className="text-4xl font-bold text-center mb-10 text-cyan-400 drop-shadow-[0_0_10px_#00ffff]">
            ⚡ App List ⚡
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {apps.map((app, index) => (
              <AppCard
                key={index}
                name={app.name}
                image={app.image}
                link={app.link}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxApp;
