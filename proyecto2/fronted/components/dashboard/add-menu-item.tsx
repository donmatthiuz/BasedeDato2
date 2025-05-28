'use client';
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Save, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useApi from "@/hooks/useApi";
import source_link from "@/repositori/source_repo";
import useID from "@/hooks/useID";

// In a real app, this would come from an API or database
const CATEGORIES = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Beverages",
  "Sides"
];

interface MenuItem {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  disponible: boolean;
  restaurante_id: string;
  imagen_id: string;
}



const AddMenuItem = () => {
  const { userID, setUserID } = useID();
  const {llamado_whit_link: getUsuario} = useApi(``)
  const {llamado: insertMenu} = useApi(`${source_link}/api/menu`)

  const [menus_items_d, setMenusitemsD] = useState<MenuItem[]>([])
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {

    const fetchMenuItems = async () => {
      const response = await getUsuario(`${source_link}/api/usuario?_id=${userID}`, "GET")

      

      const nombre = response[0].nombre
  
      const respuesta_id = await getUsuario(`${source_link}/api/restaurante?nombre=${nombre}`, "GET")

      console.log("Respuesta id", respuesta_id)
  
      
      const respuesta = await getUsuario(`${source_link}/api/menu?restaurante_id=${respuesta_id[0]._id}`, "GET")

      console.log(respuesta)
      setMenusitemsD(respuesta)
  
    }


    fetchMenuItems()

   

  }, [])


  const delete_menu = async(id_menu: string) =>{

    const respuesta = await insertMenu({
      _id: id_menu
    },"DELETE")


    if (respuesta){

      alert('ELIMINADO DE MANERA EXITOSA')
      

    }



  }

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setNewItem({ ...newItem, category: value });
  };


  

  const handleAddItem = async() => {

    const response = await getUsuario(`${source_link}/api/usuario?_id=${userID}`, "GET")

    const nombre = response[0].nombre

    const respuesta_id = await getUsuario(`${source_link}/api/restaurante?nombre=${nombre}`, "GET")

    console.log(respuesta_id[0]._id)

    const respuesta_menu = await insertMenu({
      nombre: newItem.name,
      descripcion: newItem.description,
      precio: newItem.price,
      disponible: true,
      restaurante_id: respuesta_id[0]._id
    },"POST")

    if (respuesta_menu){
      alert("Insertado de manera exitosa");
    }
    
    // Basic validation
    if (!newItem.name || !newItem.price ) {
      alert("Please fill in all required fields");
      return;
    }

    const itemWithId = {
      ...newItem,
      id: `item-${Date.now()}`,
      price: parseFloat(newItem.price)
    };

    setMenuItems([...menuItems, itemWithId]);
    
    // Reset form
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true
    });
    
    setIsAdding(false);
  };

  const handleRemoveItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleSaveMenu = () => {
    // In a real app, this would send the data to an API
    console.log("Saving menu items:", menuItems);
    alert("Menu items saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Menu</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAdding(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          
        </div>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Menu Item</CardTitle>
            <CardDescription>Enter the details for the new menu item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newItem.name} 
                  onChange={handleInputChange} 
                  placeholder="Spaghetti Carbonara"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (Q) *</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={newItem.price} 
                  onChange={handleInputChange} 
                  placeholder="12.99"
                  required 
                />
              </div>
            </div>
            
            
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={newItem.description} 
                onChange={handleInputChange} 
                placeholder="A delicious pasta dish with eggs, cheese, pancetta, and black pepper"
                rows={3} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Menu
            </Button>
          </CardFooter>
        </Card>
      )}


  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {menus_items_d.map(item => (
      <Card key={item._id}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{item.nombre}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => delete_menu(item._id)}
            >
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
          <CardDescription className="text-sm">
            ${item.precio.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {item.descripcion || "Sin descripción"}
          </p>
        </CardContent>
      </Card>
    ))}
  </div>

    </div>
  );
};

export default AddMenuItem;