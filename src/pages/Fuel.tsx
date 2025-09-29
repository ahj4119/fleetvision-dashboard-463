import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Fuel as FuelIcon } from "lucide-react";

const Fuel = () => {
  const fuelRecords = [
    { id: 1, vehicle: "ABC-123", date: "2024-02-20", liters: 45, cost: "89.50€", consumption: "7.2L/100km" },
    { id: 2, vehicle: "DEF-456", date: "2024-02-19", liters: 52, cost: "103.50€", consumption: "8.1L/100km" },
    { id: 3, vehicle: "GHI-789", date: "2024-02-18", liters: 48, cost: "95.20€", consumption: "6.9L/100km" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Gestion du Carburant</h1>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un plein
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Consommation moyenne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.4L/100km</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Coût total mensuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,850€</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Litres consommés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,450L</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des Pleins</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Litres</TableHead>
                    <TableHead>Coût</TableHead>
                    <TableHead>Consommation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.vehicle}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.liters}L</TableCell>
                      <TableCell>{record.cost}</TableCell>
                      <TableCell>{record.consumption}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Fuel;