interface QueryContext {
  query: string;
  scenario?: string;
  researchAreas?: any[];
  searchMode?: string;
}

interface GeneratedNode {
  id: string;
  name: string;
  info: string;
  description: string;
  isGenerated: true;
}

export const generateDynamicTree = (context: QueryContext) => {
  const { query, scenario, researchAreas, searchMode } = context;
  
  // Extract key terms from the query for dynamic generation
  const isForestryRelated = query?.includes('森林') || query?.includes('林業') || 
                           scenario?.includes('森林') || scenario?.includes('林業');
  
  const isOpticsRelated = query?.includes('光学') || query?.includes('レーザー') ||
                         query?.includes('アダプティブ') || query?.includes('adaptive optics');

  if (isForestryRelated) {
    return generateForestryTree();
  } else if (isOpticsRelated) {
    return generateOpticsTree();
  } else {
    return generateGenericTree(query, scenario);
  }
};

const generateForestryTree = () => {
  const level1Items = [
    {
      id: "forest-measurement",
      name: "森林計測・監視",
      info: "45論文 • 18事例",
      description: "森林資源の正確な測定と継続的な監視システムの開発",
      isGenerated: true
    },
    {
      id: "precision-forestry",
      name: "精密林業技術",
      info: "38論文 • 15事例", 
      description: "レーザー技術を活用した高精度な森林管理手法",
      isGenerated: true
    },
    {
      id: "safety-systems",
      name: "作業安全システム",
      info: "32論文 • 12事例",
      description: "林業作業における安全性向上のための監視・警告システム",
      isGenerated: true
    },
    {
      id: "environmental-assessment",
      name: "環境影響評価",
      info: "28論文 • 10事例",
      description: "森林生態系への影響を最小化する技術開発と評価手法",
      isGenerated: true
    }
  ];

  const level2Items = {
    "forest-measurement": [
      {
        id: "lidar-scanning",
        name: "LiDARスキャニング",
        info: "25論文 • 8事例",
        description: "3次元レーザースキャニングによる森林構造の詳細測定",
        isGenerated: true
      },
      {
        id: "tree-detection",
        name: "立木検出・分類",
        info: "18論文 • 6事例",
        description: "個別樹木の自動検出と樹種分類システム",
        isGenerated: true
      }
    ],
    "precision-forestry": [
      {
        id: "selective-harvesting",
        name: "選択的伐採システム",
        info: "20論文 • 7事例",
        description: "レーザーガイダンスによる高精度な選択的伐採技術",
        isGenerated: true
      },
      {
        id: "growth-monitoring",
        name: "成長監視システム",
        info: "15論文 • 5事例",
        description: "継続的な森林成長モニタリングと予測システム",
        isGenerated: true
      }
    ],
    "safety-systems": [
      {
        id: "collision-avoidance",
        name: "衝突回避システム",
        info: "16論文 • 6事例",
        description: "作業機械と作業者の衝突を防ぐレーザー検知システム",
        isGenerated: true
      },
      {
        id: "hazard-detection",
        name: "危険検知システム",
        info: "12論文 • 4事例",
        description: "落下物や不安定な樹木の早期検知システム",
        isGenerated: true
      }
    ],
    "environmental-assessment": [
      {
        id: "biodiversity-monitoring",
        name: "生物多様性モニタリング",
        info: "14論文 • 5事例",
        description: "森林生態系の生物多様性を継続的に監視する技術",
        isGenerated: true
      },
      {
        id: "carbon-assessment",
        name: "炭素蓄積評価",
        info: "12論文 • 4事例",
        description: "森林の炭素蓄積量を正確に評価する測定技術",
        isGenerated: true
      }
    ]
  };

  const level3Items = {
    "lidar-scanning": [
      {
        id: "terrestrial-lidar",
        name: "地上型LiDAR",
        info: "12論文 • 4事例",
        description: "高解像度の地上設置型レーザースキャナーシステム",
        isGenerated: true
      },
      {
        id: "mobile-lidar",
        name: "移動型LiDAR",
        info: "10論文 • 3事例",
        description: "車両搭載型の移動式レーザースキャニングシステム",
        isGenerated: true
      }
    ],
    "tree-detection": [
      {
        id: "ai-classification",
        name: "AI樹種分類",
        info: "8論文 • 3事例",
        description: "機械学習による自動樹種識別システム",
        isGenerated: true
      },
      {
        id: "crown-analysis",
        name: "樹冠解析",
        info: "7論文 • 2事例",
        description: "樹冠形状の詳細解析による健康状態評価",
        isGenerated: true
      }
    ],
    "selective-harvesting": [
      {
        id: "laser-guidance",
        name: "レーザーガイダンス",
        info: "9論文 • 3事例",
        description: "伐採機械の高精度誘導システム",
        isGenerated: true
      },
      {
        id: "optimal-cutting",
        name: "最適伐採計画",
        info: "8論文 • 3事例",
        description: "最適な伐採順序と方法を決定するシステム",
        isGenerated: true
      }
    ]
  };

  return { level1Items, level2Items, level3Items };
};

const generateOpticsTree = () => {
  // Keep existing adaptive optics tree structure
  const level1Items = [
    { id: "astronomy", name: "天文観測の改善", info: "42論文 • 15事例", description: "天文観測のために、地球の乱流大気を通して視界を強化し、回折限界に近い解像度を達成する。", isGenerated: true },
    { id: "biomedical", name: "生体医学イメージングの進歩", info: "38論文 • 14事例", description: "細胞レベルでの解像度と明瞭さを向上させるため、医療および生物学的イメージングに適応光学を応用する。", isGenerated: true },
    { id: "defense", name: "防衛と監視の支援", info: "35論文 • 12事例", description: "大気を通した強化されたイメージング、ターゲティング、およびレーザー伝播のために防衛アプリケーションで適応光学を使用する。", isGenerated: true }
  ];

  // Return the existing structure for optics
  return {
    level1Items,
    level2Items: {
      "astronomy": [
        { id: "turbulence-compensation", name: "大気乱流補正", info: "18論文 • 6事例", description: "より明確な天文イメージングを達成するために、大気乱流によって引き起こされる光学的歪みを補正するための技術。", isGenerated: true }
      ]
    },
    level3Items: {
      "turbulence-compensation": [
        { id: "laser-guide-star", name: "レーザーガイドスターシステム", info: "10論文 • 3事例", description: "ナトリウム層技術とレイリー技術を含む適応光学システムのための大気歪みを測定するためにレーザーを使用して作成された人工参照星。", isGenerated: true }
      ]
    }
  };
};

const generateGenericTree = (query?: string, scenario?: string) => {
  // Generate a generic technology tree based on query terms
  const queryTerms = (query || scenario || "").toLowerCase();
  
  if (queryTerms.includes('ai') || queryTerms.includes('machine learning') || queryTerms.includes('深層学習')) {
    return generateAITree();
  } else if (queryTerms.includes('sensor') || queryTerms.includes('センサー') || queryTerms.includes('iot')) {
    return generateSensorTree();
  } else {
    return generateDefaultTree();
  }
};

const generateAITree = () => {
  return {
    level1Items: [
      { id: "machine-learning", name: "機械学習応用", info: "50論文 • 20事例", description: "機械学習技術の実用的応用と研究開発", isGenerated: true },
      { id: "deep-learning", name: "深層学習システム", info: "45論文 • 18事例", description: "ニューラルネットワークを活用した高度な学習システム", isGenerated: true }
    ],
    level2Items: {
      "machine-learning": [
        { id: "supervised-learning", name: "教師あり学習", info: "25論文 • 10事例", description: "ラベル付きデータを用いた予測モデルの構築", isGenerated: true }
      ]
    },
    level3Items: {
      "supervised-learning": [
        { id: "classification", name: "分類アルゴリズム", info: "12論文 • 5事例", description: "データの自動分類のためのアルゴリズム開発", isGenerated: true }
      ]
    }
  };
};

const generateSensorTree = () => {
  return {
    level1Items: [
      { id: "sensor-networks", name: "センサーネットワーク", info: "40論文 • 16事例", description: "分散センサーシステムによるデータ収集と監視", isGenerated: true },
      { id: "iot-systems", name: "IoTシステム", info: "35論文 • 14事例", description: "モノのインターネットによる相互接続システム", isGenerated: true }
    ],
    level2Items: {
      "sensor-networks": [
        { id: "wireless-sensors", name: "無線センサー", info: "20論文 • 8事例", description: "ワイヤレス通信機能を持つセンサーデバイス", isGenerated: true }
      ]
    },
    level3Items: {
      "wireless-sensors": [
        { id: "energy-harvesting", name: "エネルギーハーベスティング", info: "10論文 • 4事例", description: "環境エネルギーを利用した自立型センサーシステム", isGenerated: true }
      ]
    }
  };
};

const generateDefaultTree = () => {
  return {
    level1Items: [
      { id: "research-methodology", name: "研究手法", info: "30論文 • 12事例", description: "効果的な研究アプローチと方法論", isGenerated: true },
      { id: "technology-development", name: "技術開発", info: "28論文 • 10事例", description: "新しい技術の開発と実装プロセス", isGenerated: true }
    ],
    level2Items: {
      "research-methodology": [
        { id: "experimental-design", name: "実験設計", info: "15論文 • 6事例", description: "科学的実験の設計と実施方法", isGenerated: true }
      ]
    },
    level3Items: {
      "experimental-design": [
        { id: "statistical-analysis", name: "統計解析", info: "8論文 • 3事例", description: "実験データの統計的解析手法", isGenerated: true }
      ]
    }
  };
};
