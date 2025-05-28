
export const getMockTedData = (query: string) => {
  // Base mock data structure based on the provided forest management example
  const mockData = {
    purpose: {
      layer: {
        nodes: [
          {
            id: "efficiency-improvement",
            name: "効率性向上((Efficiency Improvement))",
            description: "作業プロセスの最適化と生産性の向上を図る",
            parent_id: null
          },
          {
            id: "safety-enhancement", 
            name: "安全性向上((Safety Enhancement))",
            description: "作業者の安全確保と事故防止対策の強化",
            parent_id: null
          },
          {
            id: "environmental-impact-reduction",
            name: "環境への影響低減((Environmental Impact Reduction))",
            description: "持続可能な技術の導入と環境保護の推進",
            parent_id: null
          },
          {
            id: "precision-improvement",
            name: "精度の向上((Precision Improvement))",
            description: "測定や処理の正確性を高め、品質向上を実現",
            parent_id: null
          }
        ]
      },
      evaluation: {
        total_score: 85
      }
    },
    function: {
      layer: {
        nodes: [
          // Efficiency Improvement functions
          {
            id: "cut-path-optimization",
            name: "カットパス最適化((Cut Path Optimization))",
            description: "最適な経路設計により作業効率を最大化",
            parent_id: "efficiency-improvement"
          },
          {
            id: "target-identification",
            name: "ターゲット識別((Target Identification))", 
            description: "処理対象の正確な特定と分類",
            parent_id: "efficiency-improvement"
          },
          {
            id: "safety-zone-setting",
            name: "安全ゾーン設定((Safety Zone Setting))",
            description: "作業領域の安全範囲を明確に定義",
            parent_id: "safety-enhancement"
          },
          {
            id: "distance-measurement",
            name: "距離測定((Distance Measurement))",
            description: "対象物との正確な距離計測機能",
            parent_id: "efficiency-improvement"
          },
          // Safety Enhancement functions
          {
            id: "protective-equipment-use",
            name: "保護装備の使用((Protective Equipment Use))",
            description: "適切な安全装備の選択と着用管理",
            parent_id: "safety-enhancement"
          },
          {
            id: "safety-monitoring-system",
            name: "安全監視システムの導入((Safety Monitoring System Implementation))",
            description: "リアルタイム安全状況の監視と管理",
            parent_id: "safety-enhancement"
          },
          // Environmental functions
          {
            id: "reforestation-program",
            name: "再植林プログラムの実施((Reforestation Program Implementation))",
            description: "環境復元と持続可能な資源管理",
            parent_id: "environmental-impact-reduction"
          },
          {
            id: "sustainable-technology",
            name: "持続可能な技術の導入((Sustainable Technology Implementation))",
            description: "環境に配慮した技術の採用と普及",
            parent_id: "environmental-impact-reduction"
          },
          // Precision functions
          {
            id: "ui-optimization",
            name: "ユーザーインターフェースの最適化((UI Optimization))",
            description: "操作性と視認性の向上による精度向上",
            parent_id: "precision-improvement"
          },
          {
            id: "laser-guide-system",
            name: "レーザーガイドシステムの設計((Laser Guide System Design))",
            description: "高精度レーザー誘導システムの構築",
            parent_id: "precision-improvement"
          }
        ]
      },
      evaluation: {
        total_score: 82
      }
    },
    measure: {
      layer: {
        nodes: [
          // Cut Path Optimization measures
          {
            id: "supply-chain-optimization",
            name: "サプライチェーン最適化((Supply Chain Optimization))",
            description: "効率的な資材調達と配送システムの構築",
            parent_id: "cut-path-optimization"
          },
          {
            id: "market-expansion-strategy",
            name: "市場展開戦略((Market Expansion Strategy))",
            description: "新規市場への効果的な参入戦略",
            parent_id: "cut-path-optimization"
          },
          {
            id: "technology-licensing",
            name: "技術ライセンシング((Technology Licensing))",
            description: "技術の知的財産権管理と活用",
            parent_id: "cut-path-optimization"
          },
          // Target Identification measures
          {
            id: "ai-recognition-algorithm",
            name: "AI認識アルゴリズム((AI Recognition Algorithm))",
            description: "機械学習による対象物の自動識別",
            parent_id: "target-identification"
          },
          {
            id: "spectral-analysis",
            name: "スペクトル分析((Spectral Analysis))",
            description: "光スペクトラムによる物質特性の解析",
            parent_id: "target-identification"
          },
          // Safety Zone Setting measures
          {
            id: "partnership-development",
            name: "パートナーシップ開発((Partnership Development))",
            description: "協力関係の構築と維持",
            parent_id: "safety-zone-setting"
          },
          {
            id: "market-education",
            name: "市場教育((Market Education))",
            description: "顧客や市場への技術啓発活動",
            parent_id: "safety-zone-setting"
          },
          // Distance Measurement measures
          {
            id: "lidar-sensor",
            name: "LiDARセンサー((LiDAR Sensor))",
            description: "レーザー光による高精度距離測定技術",
            parent_id: "distance-measurement"
          },
          {
            id: "ultrasonic-measurement",
            name: "超音波測定((Ultrasonic Measurement))",
            description: "音波を利用した非接触距離計測",
            parent_id: "distance-measurement"
          },
          // Protective Equipment measures
          {
            id: "innovation-improvement",
            name: "イノベーションと改善((Innovation and Improvement))",
            description: "継続的な技術革新と品質向上",
            parent_id: "protective-equipment-use"
          },
          {
            id: "quality-control",
            name: "品質管理((Quality Control))",
            description: "製品・サービス品質の管理と保証",
            parent_id: "protective-equipment-use"
          },
          // Safety Monitoring measures
          {
            id: "realtime-monitoring",
            name: "リアルタイム監視((Real-time Monitoring))",
            description: "即座の状況把握と対応システム",
            parent_id: "safety-monitoring-system"
          },
          {
            id: "iot-sensors",
            name: "IoTセンサー((IoT Sensors))",
            description: "インターネット接続センサーネットワーク",
            parent_id: "safety-monitoring-system"
          }
        ]
      },
      evaluation: {
        total_score: 78
      }
    }
  };

  // Customize the mock data based on query keywords
  if (query.includes('医療') || query.includes('診断')) {
    mockData.purpose.layer.nodes = [
      {
        id: "diagnostic-accuracy",
        name: "診断精度向上((Diagnostic Accuracy Improvement))",
        description: "医療診断の正確性と信頼性を高める",
        parent_id: null
      },
      {
        id: "patient-safety",
        name: "患者安全性確保((Patient Safety Assurance))",
        description: "医療過程における患者の安全を最優先に確保",
        parent_id: null
      },
      {
        id: "treatment-efficiency",
        name: "治療効率向上((Treatment Efficiency Improvement))",
        description: "治療プロセスの最適化と時間短縮",
        parent_id: null
      }
    ];
  } else if (query.includes('農業') || query.includes('栽培')) {
    mockData.purpose.layer.nodes = [
      {
        id: "crop-yield-optimization",
        name: "収穫量最適化((Crop Yield Optimization))",
        description: "農作物の収穫量と品質の向上",
        parent_id: null
      },
      {
        id: "sustainable-farming",
        name: "持続可能な農業((Sustainable Farming))",
        description: "環境に配慮した持続可能な農業技術の実現",
        parent_id: null
      },
      {
        id: "resource-efficiency",
        name: "資源効率向上((Resource Efficiency))",
        description: "水、肥料、エネルギーの効率的利用",
        parent_id: null
      }
    ];
  }

  return mockData;
};
