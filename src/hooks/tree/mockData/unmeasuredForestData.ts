
export const unmeasuredForestData = {
  purpose: {
    layer: {
      nodes: [
        {
          id: "unmeasured-forest-data-collection",
          name: "未測量森林地域のデータ収集((Unmeasured Forest Data Collection))", 
          description: "これまで測量されていない森林地域の包括的データ収集",
          parent_id: null
        }
      ]
    },
    evaluation: {
      total_score: 88
    }
  },
  function: {
    layer: {
      nodes: [
        {
          id: "data-accuracy-improvement",
          name: "データ精度向上((Data Accuracy Improvement))",
          description: "未測量地域での高精度データ収集技術の確立",
          parent_id: "unmeasured-forest-data-collection"
        },
        {
          id: "new-species-discovery",
          name: "新種生物の発見((New Species Discovery))",
          description: "未開拓地域における新種生物の発見と記録",
          parent_id: "unmeasured-forest-data-collection"
        },
        {
          id: "forest-conservation-activity-support",
          name: "森林保全活動支援((Forest Conservation Activity Support))",
          description: "地域コミュニティと連携した森林保全活動の推進",
          parent_id: "unmeasured-forest-data-collection"
        },
        {
          id: "forest-loss-monitoring",
          name: "森林損失の監視((Forest Loss Monitoring))",
          description: "森林減少の早期発見と対策立案システム",
          parent_id: "unmeasured-forest-data-collection"
        }
      ]
    },
    evaluation: {
      total_score: 85
    }
  },
  measure: {
    layer: {
      nodes: [
        // Data Accuracy Improvement measures
        {
          id: "data-cleansing-technology-enhancement",
          name: "データクレンジング技術の強化((Data Cleansing Technology Enhancement))",
          description: "データ品質向上のためのクレンジング技術",
          parent_id: "data-accuracy-improvement"
        },
        {
          id: "data-collection-protocol-optimization",
          name: "データ収集プロトコルの最適化((Data Collection Protocol Optimization))",
          description: "効率的なデータ収集手順の最適化",
          parent_id: "data-accuracy-improvement"
        },
        {
          id: "realtime-data-analysis-integration",
          name: "リアルタイムデータ分析機能の統合((Real-time Data Analysis Integration))",
          description: "即時データ分析機能の統合システム",
          parent_id: "data-accuracy-improvement"
        },
        {
          id: "high-precision-sensor-development",
          name: "高精度センサーの開発((High Precision Sensor Development))",
          description: "測定精度向上のためのセンサー開発",
          parent_id: "data-accuracy-improvement"
        },
        // New Species Discovery measures
        {
          id: "environmental-data-analysis",
          name: "環境データ分析((Environmental Data Analysis))",
          description: "新種発見のための環境データ分析",
          parent_id: "new-species-discovery"
        },
        {
          id: "habitat-mapping",
          name: "生息地マッピング((Habitat Mapping))",
          description: "生物の生息地の詳細マッピング",
          parent_id: "new-species-discovery"
        },
        {
          id: "genetic-sampling",
          name: "遺伝子サンプリング((Genetic Sampling))",
          description: "遺伝子解析のためのサンプリング技術",
          parent_id: "new-species-discovery"
        },
        {
          id: "long-term-monitoring-program",
          name: "長期監視プログラム((Long-term Monitoring Program))",
          description: "継続的な生物多様性監視プログラム",
          parent_id: "new-species-discovery"
        },
        // Forest Conservation Activity Support measures
        {
          id: "community-engagement-promotion",
          name: "コミュニティエンゲージメントの促進((Community Engagement Promotion))",
          description: "地域コミュニティの参加促進",
          parent_id: "forest-conservation-activity-support"
        },
        {
          id: "data-collection-optimization-conservation",
          name: "データ収集の最適化((Data Collection Optimization))",
          description: "保全活動のためのデータ収集最適化",
          parent_id: "forest-conservation-activity-support"
        },
        {
          id: "ecosystem-analysis-improvement",
          name: "生態系分析の改善((Ecosystem Analysis Improvement))",
          description: "生態系の詳細分析機能の改善",
          parent_id: "forest-conservation-activity-support"
        },
        {
          id: "monitoring-system-integration",
          name: "監視システムの統合((Monitoring System Integration))",
          description: "包括的な監視システムの統合",
          parent_id: "forest-conservation-activity-support"
        },
        // Forest Loss Monitoring measures
        {
          id: "community-based-monitoring-participation",
          name: "コミュニティベースの監視参加((Community-based Monitoring Participation))",
          description: "地域住民による監視活動への参加",
          parent_id: "forest-loss-monitoring"
        },
        {
          id: "data-analysis-algorithm-development",
          name: "データ分析アルゴリズムの開発((Data Analysis Algorithm Development))",
          description: "森林損失検出のためのアルゴリズム開発",
          parent_id: "forest-loss-monitoring"
        },
        {
          id: "remote-sensing-technology-utilization",
          name: "リモートセンシング技術の活用((Remote Sensing Technology Utilization))",
          description: "衛星・航空機による遠隔監視技術",
          parent_id: "forest-loss-monitoring"
        },
        {
          id: "ground-monitoring-system-enhancement",
          name: "地上監視システムの強化((Ground Monitoring System Enhancement))",
          description: "地上設置型監視システムの強化",
          parent_id: "forest-loss-monitoring"
        }
      ]
    },
    evaluation: {
      total_score: 82
    }
  },
  implementation: {
    layer: {
      nodes: [
        // Data Cleansing Technology Enhancement implementations
        {
          id: "algorithm-optimization-cleansing",
          name: "アルゴリズム最適化((Algorithm Optimization))",
          description: "データクレンジングアルゴリズムの最適化",
          parent_id: "data-cleansing-technology-enhancement"
        },
        {
          id: "cloud-based-cleansing-service",
          name: "クラウドベースクレンジングサービス((Cloud-based Cleansing Service))",
          description: "クラウド基盤のデータクレンジングサービス",
          parent_id: "data-cleansing-technology-enhancement"
        },
        {
          id: "data-cleansing-automation-framework",
          name: "データクレンジング自動化フレームワーク((Data Cleansing Automation Framework))",
          description: "自動化されたデータクレンジングフレームワーク",
          parent_id: "data-cleansing-technology-enhancement"
        },
        {
          id: "data-standardization-tool",
          name: "データ標準化ツール((Data Standardization Tool))",
          description: "データの標準化処理ツール",
          parent_id: "data-cleansing-technology-enhancement"
        },
        {
          id: "anomaly-detection-system",
          name: "異常値検出システム((Anomaly Detection System))",
          description: "データ異常値の自動検出システム",
          parent_id: "data-cleansing-technology-enhancement"
        },

        // Data Collection Protocol Optimization implementations
        {
          id: "data-organization-algorithm-customization",
          name: "データ整理アルゴリズムのカスタマイズ((Data Organization Algorithm Customization))",
          description: "効率的なデータ整理のためのアルゴリズムカスタマイズ",
          parent_id: "data-collection-protocol-optimization"
        },
        {
          id: "automatic-data-verification-system",
          name: "取得データの自動検証システム((Automatic Data Verification System))",
          description: "収集データの自動品質検証システム",
          parent_id: "data-collection-protocol-optimization"
        },
        {
          id: "environment-adaptive-collection-protocol",
          name: "環境適応型収集プロトコルの開発((Environment Adaptive Collection Protocol))",
          description: "環境条件に適応する収集プロトコル",
          parent_id: "data-collection-protocol-optimization"
        },
        {
          id: "high-precision-sensor-selection",
          name: "高精度センサーの選択((High Precision Sensor Selection))",
          description: "用途に最適化された高精度センサーの選択",
          parent_id: "data-collection-protocol-optimization"
        },

        // Continue with other implementation nodes...
        // Environmental Data Analysis implementations
        {
          id: "data-collection-protocol-env",
          name: "データ収集プロトコル((Data Collection Protocol))",
          description: "環境データ収集のための標準化プロトコル",
          parent_id: "environmental-data-analysis"
        },
        {
          id: "data-organization-algorithm-env",
          name: "データ整理アルゴリズム((Data Organization Algorithm))",
          description: "環境データの効率的な整理アルゴリズム",
          parent_id: "environmental-data-analysis"
        },
        {
          id: "pattern-recognition-software",
          name: "パターン認識ソフトウェア((Pattern Recognition Software))",
          description: "生物パターンを認識するソフトウェア",
          parent_id: "environmental-data-analysis"
        },
        {
          id: "remote-sensing-technology-env",
          name: "リモートセンシング技術((Remote Sensing Technology))",
          description: "遠隔環境監視技術",
          parent_id: "environmental-data-analysis"
        },
        {
          id: "high-definition-sensor",
          name: "高精細センサー((High Definition Sensor))",
          description: "高解像度環境監視センサー",
          parent_id: "environmental-data-analysis"
        }
        // Add more implementation nodes as needed...
      ]
    },
    evaluation: {
      total_score: 79
    }
  }
};
