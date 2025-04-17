
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
          <li className="bg-white p-4 rounded border border-gray-200">
            <h5 className="font-medium text-lg mb-1">High-resolution retinal imaging using adaptive optics</h5>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>Authors: Smith J., Johnson M., Williams R.</span>
              <span>•</span>
              <span>Journal of Vision Science</span>
              <span>•</span>
              <span>March 2023</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              This groundbreaking study explores the application of adaptive optics in high-resolution retinal imaging, 
              demonstrating significant improvements in visualization of retinal microstructures. The research presents 
              novel techniques for real-time correction of optical aberrations in the human eye.
            </p>
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Retinal Imaging</span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Clinical</span>
            </div>
          </li>
          <li className="bg-white p-4 rounded border border-gray-200">
            <h5 className="font-medium text-lg mb-1">Advancements in corneal imaging with adaptive optics technology</h5>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>Authors: Chen H., Rodriguez A., Kumar P.</span>
              <span>•</span>
              <span>Ophthalmology Research</span>
              <span>•</span>
              <span>December 2022</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              This comprehensive study investigates recent developments in corneal imaging using adaptive optics. 
              The research presents innovative approaches to overcome traditional limitations in corneal visualization 
              and introduces new methodologies for clinical applications.
            </p>
            <div className="flex gap-2 mb-3">
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
