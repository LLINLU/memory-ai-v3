
import React from "react";
import { ImplementationCard } from "./ImplementationCard";

export const ImplementationList = () => {
  return (
    <div className="space-y-4">
      <ImplementationCard
        title="Commercial AO-SLO System"
        description="Commercially available adaptive optics system for clinical ophthalmology applications. Features real-time wavefront sensing and high-speed image acquisition."
        releases={3}
        badgeColor="bg-[#E8F1FF]"
        badgeTextColor="text-[#0EA5E9]"
      />
      <ImplementationCard
        title="Research-Grade AO Platform"
        description="Custom-built adaptive optics system integrating multiple imaging modalities. Enables simultaneous fluorescence imaging and structural assessment."
        releases={5}
        badgeColor="bg-[#F2FCE2]"
        badgeTextColor="text-[#16A34A]"
      />
    </div>
  );
};
