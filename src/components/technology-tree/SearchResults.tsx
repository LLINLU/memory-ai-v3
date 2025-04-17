
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SearchResults = () => {
  return (
    <div className="h-full p-4 overflow-auto bg-[#fffdf5]">
      <h3 className="text-xl font-bold mb-4">Research Results</h3>
      <div className="bg-[#f3f2e8] p-4 rounded-lg">
        <div className="mb-4">
          <h4 className="font-semibold">Adaptive Optics: Medical Applications</h4>
          <p className="text-sm text-gray-600">32 papers • 9 implementations</p>
        </div>
        <ul className="space-y-4">
          <li className="bg-white p-3 rounded border border-gray-200">
            <h5 className="font-medium">High-resolution retinal imaging using adaptive optics</h5>
            <p className="text-sm text-gray-600">Journal of Vision Science, 2023</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Retinal Imaging</span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Clinical</span>
            </div>
          </li>
          <li className="bg-white p-3 rounded border border-gray-200">
            <h5 className="font-medium">Advancements in corneal imaging with adaptive optics technology</h5>
            <p className="text-sm text-gray-600">Ophthalmology Research, 2022</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Corneal Imaging</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">Technique</span>
            </div>
          </li>
        </ul>
        <Button variant="outline" className="w-full mt-4">
          View all 32 papers
        </Button>
      </div>
    </div>
  );
};
