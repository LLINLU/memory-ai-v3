
export interface Paper {
  title: {
    japanese?: string;
    english: string;
  };
  authors: string;
  journal: string;
  tags: string[];
  abstract: string;
  date: string;
}

export const defaultPapers: Paper[] = [
  {
    title: {
      english: "(Cellular-level Assessment of Diabetic Retinopathy Using High-resolution AO-SLO)"
    },
    authors: "田中 健太, 佐藤 明子, 山田 雄一",
    journal: "日本眼科学会誌",
    tags: ["AO-SLO", "糖尿病網膜症"],
    abstract: "This study investigates the application of adaptive optics scanning laser ophthalmoscopy (AO-SLO) for early detection of cellular changes in diabetic retinopathy. The research demonstrates improved visualization of retinal microvasculature and photoreceptor abnormalities before clinical symptoms appear.",
    date: "2024-04-19"
  },
  {
    title: {
      english: "Multi-Modal Adaptive Optics Imaging Combined with OCT for Enhanced Retinal Diagnostics"
    },
    authors: "J. Zhang, M. Williams, K. Yamada",
    journal: "American Journal of Ophthalmology",
    tags: ["AO-OCT", "Multi-Modal"],
    abstract: "This paper presents a novel approach combining adaptive optics with optical coherence tomography for comprehensive retinal imaging. The multi-modal system achieves unprecedented resolution for in vivo assessment of retinal layers, offering new insights into pathophysiology of macular degeneration.",
    date: "2024-04-19"
  }
];

export const updatedPapers: Paper[] = [
  {
    title: {
      english: "(Adaptive Optics in Ophthalmology)"
    },
    authors: "鈴木 誠一, 高橋 直子, 山本 裕子",
    journal: "先端医療技術研究",
    tags: ["AO-SLO", "眼科", "イメージング"],
    abstract: "This comprehensive review examines the growing applications of adaptive optics in ophthalmology. The paper discusses recent technological advancements, clinical implementations, and future directions for improving retinal imaging and diagnosis of ocular diseases.",
    date: "2024-04-15"
  },
  {
    title: {
      english: "Clinical Value of Adaptive Optics in Diagnosis of Early-Stage Glaucoma"
    },
    authors: "L. Chen, A. Rodriguez, T. Nakamura",
    journal: "Journal of Clinical Ophthalmology",
    tags: ["Glaucoma", "Early Detection"],
    abstract: "This research demonstrates how adaptive optics can significantly improve the early detection of glaucoma by enabling visualization of individual nerve fiber layer defects before conventional diagnostic methods can detect them. The study includes a 3-year follow-up comparison with standard OCT imaging.",
    date: "2024-04-12"
  },
  {
    title: {
      english: "High-Resolution Imaging of Photoreceptor Mosaic in Retinitis Pigmentosa Using Adaptive Optics"
    },
    authors: "D. Johnson, M. Suzuki, H. Kim",
    journal: "Retinal Disease Research",
    tags: ["Retinitis Pigmentosa", "Photoreceptors"],
    abstract: "Using advanced adaptive optics technology, this study maps the progressive degeneration of photoreceptor cells in patients with retinitis pigmentosa. The research provides new insights into disease progression patterns and potential therapeutic windows for intervention.",
    date: "2024-04-10"
  }
];
