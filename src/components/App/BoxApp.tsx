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
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
    >
      <div className="flex items-center space-x-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full" />
        <span className="text-lg font-semibold">{name}</span>
      </div>
    </a>
  );
};

const BoxApp = () => {
  return (
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">App List</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
