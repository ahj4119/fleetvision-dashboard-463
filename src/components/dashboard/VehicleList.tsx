import { Car, Battery, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";  // Add this import

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: "active" | "maintenance" | "issue";
  driver: string;
  lastUpdate: string;
}

const vehicles: Vehicle[] = [
  {
    id: "1",
    plate: "AB-123-CD",
    model: "Tesla Model 3",
    status: "active",
    driver: "Jean Dupont",
    lastUpdate: "Il y a 5 min",
  },
  {
    id: "2",
    plate: "EF-456-GH",
    model: "Renault Zoe",
    status: "maintenance",
    driver: "Marie Martin",
    lastUpdate: "Il y a 2h",
  },
  {
    id: "3",
    plate: "IJ-789-KL",
    model: "Peugeot e-208",
    status: "issue",
    driver: "Pierre Durant",
    lastUpdate: "Il y a 30 min",
  },
];

const statusConfig = {
  active: { color: "text-success", icon: Car },
  maintenance: { color: "text-warning", icon: Battery },
  issue: { color: "text-error", icon: AlertTriangle },
};

export const VehicleList = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">État des véhicules</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {vehicles.map((vehicle) => {
          const StatusIcon = statusConfig[vehicle.status].icon;
          return (
            <div key={vehicle.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  statusConfig[vehicle.status].color
                )}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{vehicle.plate}</p>
                  <p className="text-sm text-gray-500">{vehicle.model}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{vehicle.driver}</p>
                <p className="text-sm text-gray-500">{vehicle.lastUpdate}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};