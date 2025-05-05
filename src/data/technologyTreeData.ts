
export const level1Items = [
  { id: "astronomy", name: "Improve Astronomical Observations", info: "42 papers • 15 implementations", description: "Enhancing vision through Earth's turbulent atmosphere to achieve near-diffraction-limited resolution for astronomical observations." },
  { id: "biomedical", name: "Advance Biomedical Imaging", info: "38 papers • 14 implementations", description: "Applying adaptive optics to medical and biological imaging to improve resolution and clarity at the cellular level." },
  { id: "defense", name: "Support Defense and Surveillance", info: "35 papers • 12 implementations", description: "Using adaptive optics in defense applications for enhanced imaging, targeting, and laser propagation through atmosphere." }
];

export const level2Items = {
  "astronomy": [
    { id: "turbulence-compensation", name: "Atmospheric Turbulence Compensation", info: "18 papers • 6 implementations", description: "Techniques to correct for optical distortions caused by atmospheric turbulence to achieve clearer astronomical imaging." },
    { id: "wavefront-reconstruction", name: "Wavefront Reconstruction", info: "14 papers • 5 implementations", description: "Methods to analyze and mathematically reconstruct the wavefront of light distorted by atmospheric turbulence." },
    { id: "wavefront-correction", name: "Wavefront Correction", info: "16 papers • 4 implementations", description: "Technologies that physically manipulate light waves to compensate for atmospheric distortions." }
  ],
  "biomedical": [
    { id: "high-resolution-microscopy", name: "High-Resolution Microscopy / Retinal Imaging", info: "20 papers • 7 implementations", description: "Applications of adaptive optics to achieve cellular-level resolution in microscopy and retinal imaging for medical diagnostics." },
    { id: "depth-correction", name: "Depth Correction in OCT", info: "12 papers • 4 implementations", description: "Methods to improve optical coherence tomography by correcting for depth-dependent aberrations." },
    { id: "live-imaging", name: "Live Imaging Feedback", info: "14 papers • 3 implementations", description: "Systems that provide real-time adaptive correction for live tissue imaging in medical applications." }
  ],
  "defense": [
    { id: "image-stabilization", name: "Image Stabilization and Target Tracking", info: "16 papers • 5 implementations", description: "Technologies for maintaining stable imaging of moving targets through atmospheric disturbances." },
    { id: "beam-propagation", name: "Atmospheric Compensation for Beam Propagation", info: "13 papers • 4 implementations", description: "Systems that pre-compensate laser beams to counteract atmospheric effects for long-range propagation." },
    { id: "precision-guidance", name: "Precision Guidance Systems", info: "14 papers • 3 implementations", description: "Adaptive optics technologies integrated with guidance systems for improved accuracy and performance." }
  ]
};

export const level3Items = {
  "turbulence-compensation": [
    { id: "laser-guide-star", name: "Laser Guide Star Systems", info: "10 papers • 3 implementations", description: "Artificial reference stars created using lasers to measure atmospheric distortion for adaptive optics systems, including Sodium Layer and Rayleigh techniques." },
    { id: "shack-hartmann-astronomy", name: "Shack-Hartmann Sensor", info: "8 papers • 3 implementations", description: "Optical device that measures the distortion of wavefronts using an array of lenslets and a camera sensor, commonly used in astronomical adaptive optics." }
  ],
  "wavefront-reconstruction": [
    { id: "matrix-vector", name: "Matrix-Vector Processing", info: "7 papers • 2 implementations", description: "Computational methods using matrix operations to efficiently process wavefront sensor data and calculate correction commands." },
    { id: "modal-decomposition", name: "Modal Decomposition Algorithms", info: "7 papers • 3 implementations", description: "Mathematical techniques that break down complex wavefront aberrations into simpler components (modes) for more efficient correction." }
  ],
  "wavefront-correction": [
    { id: "deformable-mirrors-astronomy", name: "Deformable Mirrors", info: "9 papers • 2 implementations", description: "High-precision mirrors with large-actuator counts that can rapidly change shape to correct wavefront aberrations in astronomical observations." },
    { id: "tip-tilt-astronomy", name: "Tip-Tilt Mirrors", info: "7 papers • 2 implementations", description: "Fast-steering mirrors that correct for the largest atmospheric aberrations (tip and tilt) to stabilize the image position." }
  ],
  "high-resolution-microscopy": [
    { id: "wavefront-sensors-bio", name: "Wavefront Sensors", info: "11 papers • 4 implementations", description: "Optical devices used in biomedical imaging to measure wavefront distortions, including Shack-Hartmann and Curvature sensing approaches." },
    { id: "deformable-mirrors-bio", name: "Deformable Mirrors", info: "9 papers • 3 implementations", description: "Adaptive mirrors that correct for optical aberrations in biological tissue to enable high-resolution cellular imaging." }
  ],
  "depth-correction": [
    { id: "ao-oct", name: "Adaptive Optics OCT Modules", info: "6 papers • 2 implementations", description: "Specialized modules that integrate adaptive optics with optical coherence tomography to improve imaging depth and resolution in tissue." },
    { id: "fpga-controllers", name: "Low-Latency FPGA Controllers", info: "6 papers • 2 implementations", description: "Field-programmable gate array systems designed for high-speed, low-latency processing of wavefront sensing data for real-time correction." }
  ],
  "live-imaging": [
    { id: "real-time-imaging", name: "Real-Time Imaging Systems", info: "8 papers • 2 implementations", description: "Integrated systems that provide continuous adaptive correction during live tissue imaging for medical diagnostics and procedures." },
    { id: "control-algorithms", name: "Control Algorithms", info: "6 papers • 1 implementation", description: "Specialized software algorithms that optimize the performance of adaptive optics systems for biomedical applications." }
  ],
  "image-stabilization": [
    { id: "tip-tilt-defense", name: "Tip-Tilt Mirrors", info: "9 papers • 3 implementations", description: "Fast-steering mirrors used in defense systems to rapidly compensate for platform motion and atmospheric effects." },
    { id: "real-time-sensors", name: "Real-Time Sensors and Controllers", info: "7 papers • 2 implementations", description: "High-speed sensing and control systems optimized for tracking moving targets through atmospheric turbulence." }
  ],
  "beam-propagation": [
    { id: "deformable-mirrors-defense", name: "Deformable Mirrors", info: "7 papers • 2 implementations", description: "Advanced mirror systems that pre-shape laser beams to compensate for atmospheric distortion in long-range targeting and communication." },
    { id: "shack-hartmann-defense", name: "Shack-Hartmann Sensor", info: "6 papers • 2 implementations", description: "Wavefront sensors adapted for defense applications to measure atmospheric distortion for beam propagation correction." }
  ],
  "precision-guidance": [
    { id: "adaptive-tracking", name: "Adaptive Laser Tracking", info: "8 papers • 2 implementations", description: "Advanced tracking systems that use adaptive optics to maintain lock on targets through atmospheric turbulence." },
    { id: "real-time-control", name: "Real-Time Control Algorithms", info: "6 papers • 1 implementation", description: "Specialized algorithms optimized for high-speed decision making in guidance systems with adaptive optics." }
  ]
};
