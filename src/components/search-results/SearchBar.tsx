
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4">
      <div className="container mx-auto flex items-center gap-2">
        <Input 
          type="text" 
          defaultValue="補償光学の眼科分野への利用 (Adaptive Optics in Ophthalmology)"
          className="flex-1 h-12"
        />
        <Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600">
          Search
        </Button>
      </div>
    </div>
  );
};
