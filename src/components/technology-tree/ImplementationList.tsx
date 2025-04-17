
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
        pressReleases={[
          {
            title: "Launch of Next-Generation AO-SLO System",
            url: "#release-1"
          },
          {
            title: "Clinical Trial Results for AO-SLO Implementation",
            url: "#release-2"
          },
          {
            title: "FDA Approval for Commercial AO-SLO System",
            url: "#release-3"
          }
        ]}
      />
      <ImplementationCard
        title="Research-Grade AO Platform"
        description="Custom-built adaptive optics system integrating multiple imaging modalities. Enables simultaneous fluorescence imaging and structural assessment."
        releases={5}
        badgeColor="bg-[#E8F1FF]"
        badgeTextColor="text-[#0EA5E9]"
        pressReleases={[
          {
            title: "New Research Platform Development",
            url: "#release-1"
          },
          {
            title: "Integration of Multi-Modal Imaging",
            url: "#release-2"
          },
          {
            title: "Breakthrough in Fluorescence Detection",
            url: "#release-3"
          },
          {
            title: "Enhanced Resolution Achievement",
            url: "#release-4"
          },
          {
            title: "Platform Optimization Results",
            url: "#release-5"
          }
        ]}
      />
    </div>
  );
};

