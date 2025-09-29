import { Home, Car, Users, Fuel, Wrench, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Vue d'ensemble", path: "/" },
  { icon: Car, label: "Véhicules", path: "/vehicles" },
  { icon: Users, label: "Chauffeurs", path: "/drivers" },
  { icon: Fuel, label: "Carburant", path: "/fuel" },
  { icon: Wrench, label: "Maintenance", path: "/maintenance" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

export const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-primary p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Fleet Manager</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="flex items-center px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white font-medium">AD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-gray-400">admin@fleet.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};