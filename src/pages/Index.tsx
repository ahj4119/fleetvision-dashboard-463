import { Car, Users, AlertTriangle, Fuel } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleList } from "@/components/dashboard/VehicleList";

const Index = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Vue d'ensemble</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Véhicules actifs"
              value="12"
              icon={<Car className="w-5 h-5 text-primary" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Chauffeurs en service"
              value="8"
              icon={<Users className="w-5 h-5 text-primary" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Alertes actives"
              value="3"
              icon={<AlertTriangle className="w-5 h-5 text-primary" />}
              trend={{ value: 2, isPositive: false }}
            />
            <StatCard
              title="Consommation moyenne"
              value="7.2L/100km"
              icon={<Fuel className="w-5 h-5 text-primary" />}
              trend={{ value: 5, isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Carte des véhicules</h2>
              <div className="bg-gray-100 h-96 rounded flex items-center justify-center">
                <p className="text-gray-500">Carte à implémenter</p>
              </div>
            </div>
            
            <VehicleList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;