
export const level1Items = [
  { id: "ophthalmology", name: "Ophthalmology", info: "42 papers • 12 implementations" },
  { id: "adaptive-optics", name: "Adaptive Optics", info: "38 papers • 15 implementations" },
  { id: "medical-imaging", name: "Medical Imaging", info: "45 papers • 18 implementations" },
  { id: "optical-engineering", name: "Optical Engineering", info: "32 papers • 14 implementations" }
];

export const level2Items = {
  "ophthalmology": [
    { id: "retinal-disorders", name: "Retinal Disorders", info: "35 papers • 8 implementations" },
    { id: "glaucoma", name: "Glaucoma", info: "27 papers • 5 implementations" }
  ],
  "adaptive-optics": [
    { id: "wavefront-sensing", name: "Wavefront Sensing", info: "28 papers • 7 implementations" },
    { id: "medical-applications", name: "Medical Applications", info: "22 papers • 6 implementations" },
    { id: "deformable-mirrors", name: "Deformable Mirrors", info: "25 papers • 8 implementations" },
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
    { id: "retinal-imaging", name: "Retinal Imaging", info: "32 papers • 9 implementations" },
    { id: "corneal-imaging", name: "Corneal Imaging", info: "18 papers • 4 implementations" }
  ],
  "deformable-mirrors": [
    { id: "mems-technology", name: "MEMS Technology", info: "14 papers • 2 implementations" }
  ],
  "ocular-structure": [
    { id: "anterior-segment", name: "Anterior Segment", info: "20 papers • 5 implementations" }
  ]
};
