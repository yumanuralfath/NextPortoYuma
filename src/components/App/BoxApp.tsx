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
      className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
    >
      <img src={image} alt={name} className="w-16 h-16 rounded-lg shadow-md" />
      <span className="mt-4 text-lg font-semibold text-gray-700">{name}</span>
    </a>
  );
};

const BoxApp = () => {
  return (
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            App List
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
