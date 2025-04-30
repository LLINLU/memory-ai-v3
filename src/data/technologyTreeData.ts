
export const level1Items = [
  { id: "ophthalmology", name: "Ophthalmology", info: "42 papers • 12 implementations", description: "The medical field focused on diagnosing and treating eye conditions, such as cataracts, glaucoma, and vision loss." },
  { id: "adaptive-optics", name: "Adaptive Optics", info: "38 papers • 15 implementations", description: "A technology that corrects optical distortions in real time to produce sharper images, often used in retinal imaging to visualize fine details at the cellular level." },
  { id: "medical-imaging", name: "Medical Imaging", info: "45 papers • 18 implementations", description: "The techniques used to create visual representations of the interior of the body for clinical analysis and diagnosis." },
  { id: "optical-engineering", name: "Optical Engineering", info: "32 papers • 14 implementations" }
];

export const level2Items = {
  "ophthalmology": [
    { id: "retinal-disorders", name: "Retinal Disorders", info: "35 papers • 8 implementations" },
    { id: "glaucoma", name: "Glaucoma", info: "27 papers • 5 implementations" }
  ],
  "adaptive-optics": [
    { id: "wavefront-sensing", name: "Wavefront Sensing", info: "28 papers • 7 implementations", description: "A technique used to measure how light waves are distorted as they pass through the eye. It maps these distortions, or aberrations, to help diagnose vision problems more precisely than standard methods." },
    { id: "medical-applications", name: "Medical Applications", info: "22 papers • 6 implementations" },
    { id: "deformable-mirrors", name: "Deformable Mirrors", info: "25 papers • 8 implementations", description: "An optical device with a surface that can be precisely adjusted to correct distortions in a light wavefront. It is commonly used in adaptive optics systems to improve image clarity." },
    { id: "ocular-structure", name: "By Ocular Structure", info: "20 papers • 5 implementations" }
  ],
  "medical-imaging": [
    { id: "mri-techniques", name: "MRI Techniques", info: "18 papers • 3 implementations" },
    { id: "ct-scanning", name: "CT Scanning", info: "15 papers • 2 implementations" }
  ],
  "optical-engineering": [
    { id: "lens-design", name: "Lens Design", info: "20 papers • 4 implementations" },
    { id: "optical-materials", name: "Optical Materials", info: "16 papers • 3 implementations" }
  ]
};

export const level3Items = {
  "wavefront-sensing": [
    { id: "shack-hartmann", name: "Shack-Hartmann Sensors", info: "12 papers • 3 implementations" }
  ],
  "medical-applications": [
    { id: "retinal-imaging", name: "Retinal Imaging", info: "32 papers • 9 implementations", description: "A non-invasive technique that captures detailed images of the retina—the light-sensitive tissue at the back of the eye." },
    { id: "corneal-imaging", name: "Corneal Imaging", info: "18 papers • 4 implementations" }
  ],
  "deformable-mirrors": [
    { id: "mems-technology", name: "MEMS Technology", info: "14 papers • 2 implementations" }
  ],
  "ocular-structure": [
    { id: "anterior-segment", name: "Anterior Segment", info: "20 papers • 5 implementations" }
  ]
};
