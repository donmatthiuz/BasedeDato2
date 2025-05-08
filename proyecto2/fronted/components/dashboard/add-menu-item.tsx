'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Save, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// In a real app, this would come from an API or database
const CATEGORIES = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Beverages",
  "Sides"
];

const AddMenuItem = () => {
  const [menuItems, setMenuItems] = useState([]);
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

  const handleAddItem = () => {
    // Basic validation
    if (!newItem.name || !newItem.price || !newItem.category) {
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
          <Button variant="outline" onClick={handleSaveMenu}>
            <Save className="mr-2 h-4 w-4" />
            Save Menu
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
                <Label htmlFor="price">Price ($) *</Label>
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
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={newItem.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {menuItems.length > 0 ? (
        <Tabs defaultValue={Object.keys(groupedItems)[0] || ""} className="space-y-4">
          <TabsList>
            {Object.keys(groupedItems).map(category => (
              <TabsTrigger key={category} value={category}>
                {category} ({groupedItems[category].length})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(groupedItems).map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedItems[category].map(item => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <CardDescription className="text-sm">${item.price.toFixed(2)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.description || "No description provided"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No menu items added yet</p>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Menu Item
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddMenuItem;