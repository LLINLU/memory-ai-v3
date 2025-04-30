
export const level1Items = [
  { id: "ophthalmology", name: "Ophthalmology", info: "42 papers • 12 implementations", description: "The medical field focused on diagnosing and treating eye conditions, such as cataracts, glaucoma, and vision loss." },
  { id: "adaptive-optics", name: "Adaptive Optics", info: "38 papers • 15 implementations", description: "A technology that corrects optical distortions in real time to produce sharper images, often used in retinal imaging to visualize fine details at the cellular level." },
  { id: "medical-imaging", name: "Medical Imaging", info: "45 papers • 18 implementations", description: "The techniques used to create visual representations of the interior of the body for clinical analysis and diagnosis." },
  { id: "optical-engineering", name: "Optical Engineering", info: "32 papers • 14 implementations", description: "A discipline that focuses on designing and optimizing optical systems, including lenses, mirrors, and other light-controlling elements." },
  { id: "laser-technology", name: "Laser Technology", info: "29 papers • 10 implementations", description: "Advanced technology that utilizes stimulated emission of radiation to generate coherent light, with various applications in medicine, communications, and manufacturing." },
  { id: "microscopy", name: "Microscopy", info: "36 papers • 14 implementations", description: "The technical field concerned with making very small objects visible to the human eye through specialized imaging techniques." },
  { id: "vision-science", name: "Vision Science", info: "31 papers • 9 implementations", description: "An interdisciplinary field studying the neurological, computational, and cognitive processes of visual perception." }
];

export const level2Items = {
  "ophthalmology": [
    { id: "retinal-disorders", name: "Retinal Disorders", info: "35 papers • 8 implementations", description: "Conditions affecting the retina, including macular degeneration, diabetic retinopathy, and retinal detachment." },
    { id: "glaucoma", name: "Glaucoma", info: "27 papers • 5 implementations", description: "A group of eye conditions characterized by damage to the optic nerve, often caused by abnormally high pressure in the eye." },
    { id: "cataracts", name: "Cataracts", info: "24 papers • 6 implementations", description: "A clouding of the normally clear lens of the eye, leading to decreased vision, especially in older adults." },
    { id: "corneal-diseases", name: "Corneal Diseases", info: "21 papers • 4 implementations", description: "Disorders affecting the transparent front part of the eye, including keratoconus and corneal ulcers." }
  ],
  "adaptive-optics": [
    { id: "wavefront-sensing", name: "Wavefront Sensing", info: "28 papers • 7 implementations", description: "A technique used to measure how light waves are distorted as they pass through the eye. It maps these distortions, or aberrations, to help diagnose vision problems more precisely than standard methods." },
    { id: "medical-applications", name: "Medical Applications", info: "22 papers • 6 implementations", description: "The use of adaptive optics technology in medical fields, particularly for diagnostic imaging and surgical guidance." },
    { id: "deformable-mirrors", name: "Deformable Mirrors", info: "25 papers • 8 implementations", description: "An optical device with a surface that can be precisely adjusted to correct distortions in a light wavefront. It is commonly used in adaptive optics systems to improve image clarity." },
    { id: "ocular-structure", name: "By Ocular Structure", info: "20 papers • 5 implementations", description: "Adaptive optics applications targeting specific structures within the eye, such as the retina, cornea, and lens." },
    { id: "real-time-correction", name: "Real-time Correction", info: "19 papers • 5 implementations", description: "Systems that can dynamically adjust to changing optical conditions in real-time for continuous optimal imaging." }
  ],
  "medical-imaging": [
    { id: "mri-techniques", name: "MRI Techniques", info: "18 papers • 3 implementations", description: "Advanced magnetic resonance imaging methods for improved tissue differentiation and functional assessment." },
    { id: "ct-scanning", name: "CT Scanning", info: "15 papers • 2 implementations", description: "Computed tomography techniques that use X-rays to create detailed images of internal body structures." },
    { id: "ultrasound-imaging", name: "Ultrasound Imaging", info: "17 papers • 4 implementations", description: "Non-invasive diagnostic method using high-frequency sound waves to produce images of structures within the body." },
    { id: "pet-scanning", name: "PET Scanning", info: "14 papers • 2 implementations", description: "Positron emission tomography that detects radioactive tracers to visualize metabolic processes in the body." }
  ],
  "optical-engineering": [
    { id: "lens-design", name: "Lens Design", info: "20 papers • 4 implementations", description: "The process of designing optical lenses for specific applications, considering factors like focal length, aberrations, and field of view." },
    { id: "optical-materials", name: "Optical Materials", info: "16 papers • 3 implementations", description: "Study and development of materials with specific optical properties for use in optical systems." },
    { id: "optical-coatings", name: "Optical Coatings", info: "18 papers • 4 implementations", description: "Thin-film coatings applied to optical components to enhance performance characteristics like reflection, transmission, or absorption." },
    { id: "fiber-optics", name: "Fiber Optics", info: "22 papers • 5 implementations", description: "Technology using thin flexible fibers as waveguides to transmit light signals for communications or imaging." }
  ],
  "laser-technology": [
    { id: "medical-lasers", name: "Medical Lasers", info: "16 papers • 4 implementations", description: "Laser systems specifically designed for medical applications, including surgery and therapy." },
    { id: "laser-spectroscopy", name: "Laser Spectroscopy", info: "14 papers • 3 implementations", description: "Analytical techniques that use laser light to study interactions between matter and electromagnetic radiation." },
    { id: "laser-materials", name: "Laser Materials", info: "12 papers • 2 implementations", description: "Materials used as gain media in lasers, determining wavelength and other operational characteristics." }
  ],
  "microscopy": [
    { id: "confocal-microscopy", name: "Confocal Microscopy", info: "19 papers • 5 implementations", description: "Optical imaging technique that increases optical resolution and contrast by using point illumination and a spatial pinhole." },
    { id: "electron-microscopy", name: "Electron Microscopy", info: "17 papers • 4 implementations", description: "Microscopy technique that uses a beam of electrons to create an image of the specimen for detailed surface analysis." },
    { id: "super-resolution", name: "Super-resolution", info: "15 papers • 3 implementations", description: "Techniques that enhance resolution beyond the diffraction limit of conventional light microscopy." }
  ],
  "vision-science": [
    { id: "visual-perception", name: "Visual Perception", info: "14 papers • 3 implementations", description: "Study of how visual stimuli are processed and interpreted by the brain." },
    { id: "color-vision", name: "Color Vision", info: "13 papers • 2 implementations", description: "Research on how humans and animals perceive and process color information." },
    { id: "visual-pathways", name: "Visual Pathways", info: "12 papers • 2 implementations", description: "Study of the neural pathways involved in processing visual information from the retina to the brain." }
  ]
};

export const level3Items = {
  "wavefront-sensing": [
    { id: "shack-hartmann", name: "Shack-Hartmann Sensors", info: "12 papers • 3 implementations", description: "Optical devices that measure wavefront distortions using an array of microlenses and a camera sensor." },
    { id: "pyramid-sensors", name: "Pyramid Sensors", info: "10 papers • 2 implementations", description: "Wavefront sensors using a pyramidal prism to split incoming light into four beams for aberration measurement." },
    { id: "curvature-sensing", name: "Curvature Sensing", info: "9 papers • 2 implementations", description: "Technique that measures the curvature of the wavefront to determine optical aberrations." }
  ],
  "medical-applications": [
    { id: "retinal-imaging", name: "Retinal Imaging", info: "32 papers • 9 implementations", description: "A non-invasive technique that captures detailed images of the retina—the light-sensitive tissue at the back of the eye." },
    { id: "corneal-imaging", name: "Corneal Imaging", info: "18 papers • 4 implementations", description: "High-resolution imaging of the cornea to detect abnormalities and guide surgical procedures." },
    { id: "surgical-guidance", name: "Surgical Guidance", info: "15 papers • 3 implementations", description: "Use of adaptive optics for enhanced visualization during ophthalmic surgeries." },
    { id: "disease-monitoring", name: "Disease Monitoring", info: "14 papers • 3 implementations", description: "Longitudinal imaging to track progression of ocular diseases and response to treatment." }
  ],
  "deformable-mirrors": [
    { id: "mems-technology", name: "MEMS Technology", info: "14 papers • 2 implementations", description: "Microelectromechanical systems used to create miniature deformable mirrors with high precision." },
    { id: "piezoelectric-actuators", name: "Piezoelectric Actuators", info: "12 papers • 2 implementations", description: "Actuators that convert electrical signals into precise mechanical displacements for mirror control." },
    { id: "bimorph-mirrors", name: "Bimorph Mirrors", info: "10 papers • 1 implementation", description: "Mirrors with two active layers that bend in response to applied voltage for wavefront correction." }
  ],
  "ocular-structure": [
    { id: "anterior-segment", name: "Anterior Segment", info: "20 papers • 5 implementations", description: "Imaging and analysis of the front portion of the eye, including cornea, iris, and lens." },
    { id: "posterior-segment", name: "Posterior Segment", info: "18 papers • 4 implementations", description: "Visualization of the back portion of the eye, including retina, choroid, and optic nerve." },
    { id: "tear-film-analysis", name: "Tear Film Analysis", info: "12 papers • 2 implementations", description: "Assessment of tear film dynamics and composition using advanced optical techniques." }
  ],
  "real-time-correction": [
    { id: "closed-loop-systems", name: "Closed-loop Systems", info: "15 papers • 3 implementations", description: "Feedback control systems that continuously monitor and adjust for optical aberrations." },
    { id: "predictive-algorithms", name: "Predictive Algorithms", info: "13 papers • 2 implementations", description: "Computational methods that anticipate wavefront changes for faster correction." }
  ],
  "mri-techniques": [
    { id: "functional-mri", name: "Functional MRI", info: "11 papers • 2 implementations", description: "Neuroimaging technique measuring brain activity by detecting changes in blood flow." },
    { id: "diffusion-tensor", name: "Diffusion Tensor Imaging", info: "10 papers • 2 implementations", description: "MRI technique tracking water diffusion for neural tract mapping." },
    { id: "spectroscopic-mri", name: "Spectroscopic MRI", info: "9 papers • 1 implementation", description: "Technique combining spectroscopy with MRI to analyze biochemical composition." }
  ],
  "ct-scanning": [
    { id: "low-dose-ct", name: "Low-dose CT", info: "8 papers • 1 implementation", description: "Techniques that minimize radiation exposure while maintaining diagnostic image quality." },
    { id: "dual-energy-ct", name: "Dual-energy CT", info: "7 papers • 1 implementation", description: "Advanced CT using two X-ray energies for enhanced tissue characterization." }
  ],
  "ultrasound-imaging": [
    { id: "doppler-ultrasound", name: "Doppler Ultrasound", info: "9 papers • 2 implementations", description: "Technique measuring blood flow velocity through vessels using the Doppler effect." },
    { id: "contrast-enhanced", name: "Contrast-enhanced Ultrasound", info: "8 papers • 1 implementation", description: "Ultrasound imaging using microbubble contrast agents for improved visualization." }
  ],
  "pet-scanning": [
    { id: "fdg-pet", name: "FDG-PET", info: "7 papers • 1 implementation", description: "PET scanning using fluorodeoxyglucose to visualize tissue metabolic activity." },
    { id: "pet-ct-fusion", name: "PET-CT Fusion", info: "6 papers • 1 implementation", description: "Combined technique providing both functional and anatomical information in a single scan." }
  ],
  "retinal-disorders": [
    { id: "amd-research", name: "Age-related Macular Degeneration", info: "14 papers • 3 implementations", description: "Studies on the leading cause of vision loss in older adults affecting the central retina." },
    { id: "diabetic-retinopathy", name: "Diabetic Retinopathy", info: "13 papers • 2 implementations", description: "Research on retinal complications arising from diabetes mellitus." }
  ],
  "glaucoma": [
    { id: "pressure-monitoring", name: "Pressure Monitoring", info: "11 papers • 2 implementations", description: "Technologies for continuous or frequent monitoring of intraocular pressure." },
    { id: "optic-nerve-imaging", name: "Optic Nerve Imaging", info: "10 papers • 2 implementations", description: "Advanced techniques to visualize and assess optic nerve damage in glaucoma." }
  ],
  "lens-design": [
    { id: "aspheric-lenses", name: "Aspheric Lenses", info: "9 papers • 2 implementations", description: "Lenses with non-spherical surfaces designed to reduce optical aberrations." },
    { id: "gradient-index", name: "Gradient Index Optics", info: "8 papers • 1 implementation", description: "Materials with varying refractive index used to create compact optical systems." }
  ],
  "optical-materials": [
    { id: "metamaterials", name: "Metamaterials", info: "7 papers • 1 implementation", description: "Engineered materials with properties not found in nature, used for specialized optical functions." },
    { id: "photonic-crystals", name: "Photonic Crystals", info: "6 papers • 1 implementation", description: "Materials with periodic structure that affects the motion of photons for optical applications." }
  ],
  "confocal-microscopy": [
    { id: "spinning-disk", name: "Spinning Disk Confocal", info: "8 papers • 2 implementations", description: "Technique using multiple pinholes on a spinning disk for rapid confocal image acquisition." },
    { id: "laser-scanning", name: "Laser Scanning Confocal", info: "7 papers • 1 implementation", description: "Method using lasers and scanning mirrors to create high-resolution optical sections." }
  ],
  "visual-perception": [
    { id: "spatial-vision", name: "Spatial Vision", info: "6 papers • 1 implementation", description: "Study of how the visual system processes spatial information and patterns." },
    { id: "motion-perception", name: "Motion Perception", info: "5 papers • 1 implementation", description: "Research on how the brain detects and interprets movement in the visual field." }
  ]
};
