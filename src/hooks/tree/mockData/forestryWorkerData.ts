
export const forestryWorkerData = {
  purpose: {
    layer: {
      nodes: [
        {
          id: "forestry-worker-field-survey",
          name: "林業従事者の現場測量((Forestry Worker Field Survey))",
          description: "林業従事者による効率的な現場測量業務の支援",
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
          id: "terrain-survey-efficiency",
          name: "地形調査の効率化((Terrain Survey Efficiency))",
          description: "現場作業員による効率的な地形調査手法の確立",
          parent_id: "forestry-worker-field-survey"
        },
        {
          id: "undeveloped-area-discovery",
          name: "未開発地域の発見((Undeveloped Area Discovery))",
          description: "新たな林業開発可能地域の特定と評価",
          parent_id: "forestry-worker-field-survey"
        },
        {
          id: "forestry-management-optimization",
          name: "林業管理の最適化((Forestry Management Optimization))",
          description: "持続可能な林業経営のための管理システム最適化",
          parent_id: "forestry-worker-field-survey"
        },
        {
          id: "high-precision-data-collection-worker",
          name: "高精度データ収集((High Precision Data Collection))",
          description: "現場レベルでの高精度データ収集技術の実装",
          parent_id: "forestry-worker-field-survey"
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
        // Terrain Survey Efficiency measures
        {
          id: "data-collection-automation-terrain",
          name: "データ収集の自動化((Data Collection Automation))",
          description: "地形調査データの自動収集システム",
          parent_id: "terrain-survey-efficiency"
        },
        {
          id: "immediate-field-data-analysis",
          name: "現場データの即時解析((Immediate Field Data Analysis))",
          description: "現場でのリアルタイムデータ解析",
          parent_id: "terrain-survey-efficiency"
        },
        {
          id: "remote-operation-technology-utilization",
          name: "遠隔操作技術の活用((Remote Operation Technology Utilization))",
          description: "遠隔操作による効率的な調査技術",
          parent_id: "terrain-survey-efficiency"
        },
        {
          id: "high-precision-measurement-implementation",
          name: "高精度測定の実装((High Precision Measurement Implementation))",
          description: "現場での高精度測定技術の実装",
          parent_id: "terrain-survey-efficiency"
        },

        // Undeveloped Area Discovery measures
        {
          id: "data-integration-undeveloped",
          name: "データ統合((Data Integration))",
          description: "多様なデータソースの統合分析",
          parent_id: "undeveloped-area-discovery"
        },
        {
          id: "remote-sensing-undeveloped",
          name: "リモートセンシング((Remote Sensing))",
          description: "未開発地域の遠隔探査技術",
          parent_id: "undeveloped-area-discovery"
        },
        {
          id: "terrain-analysis-undeveloped",
          name: "地形分析((Terrain Analysis))",
          description: "地形データの詳細分析技術",
          parent_id: "undeveloped-area-discovery"
        },
        {
          id: "ecosystem-survey-undeveloped",
          name: "生態系調査((Ecosystem Survey))",
          description: "未開発地域の生態系調査",
          parent_id: "undeveloped-area-discovery"
        },

        // Forestry Management Optimization measures
        {
          id: "data-analysis-interpretation",
          name: "データ分析と解釈((Data Analysis and Interpretation))",
          description: "林業データの分析と解釈システム",
          parent_id: "forestry-management-optimization"
        },
        {
          id: "reforestation-strategy-implementation",
          name: "再植林戦略の実施((Reforestation Strategy Implementation))",
          description: "効果的な再植林戦略の実施",
          parent_id: "forestry-management-optimization"
        },
        {
          id: "sustainable-logging-plan",
          name: "持続可能な伐採計画((Sustainable Logging Plan))",
          description: "環境配慮型の伐採計画策定",
          parent_id: "forestry-management-optimization"
        },
        {
          id: "detailed-data-collection-mgmt",
          name: "詳細データ収集((Detailed Data Collection))",
          description: "林業管理のための詳細データ収集",
          parent_id: "forestry-management-optimization"
        },

        // High Precision Data Collection measures
        {
          id: "3d-mapping-technology-application",
          name: "3Dマッピング技術の適用((3D Mapping Technology Application))",
          description: "高精度3Dマッピング技術の適用",
          parent_id: "high-precision-data-collection-worker"
        },
        {
          id: "data-collection-automation-precision",
          name: "データ収集の自動化((Data Collection Automation))",
          description: "自動化された高精度データ収集",
          parent_id: "high-precision-data-collection-worker"
        },
        {
          id: "data-analysis-enhancement",
          name: "データ解析の強化((Data Analysis Enhancement))",
          description: "データ解析能力の強化",
          parent_id: "high-precision-data-collection-worker"
        },
        {
          id: "realtime-data-processing-precision",
          name: "リアルタイムデータ処理((Real-time Data Processing))",
          description: "リアルタイムでのデータ処理システム",
          parent_id: "high-precision-data-collection-worker"
        },
        {
          id: "calibration-technology-accuracy",
          name: "精度向上のための校正技術((Calibration Technology for Accuracy))",
          description: "測定精度向上のための校正技術",
          parent_id: "high-precision-data-collection-worker"
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
        // Data Collection Automation implementations
        {
          id: "energy-efficient-sensors",
          name: "エネルギー効率の良いセンサー((Energy Efficient Sensors))",
          description: "省電力で効率的なセンサーシステム",
          parent_id: "data-collection-automation-terrain"
        },
        {
          id: "cloud-based-data-storage-terrain",
          name: "クラウドベースデータストレージ((Cloud-based Data Storage))",
          description: "クラウド基盤のデータストレージシステム",
          parent_id: "data-collection-automation-terrain"
        },
        {
          id: "sensor-placement-technology",
          name: "センサー配置技術((Sensor Placement Technology))",
          description: "最適なセンサー配置技術",
          parent_id: "data-collection-automation-terrain"
        },
        {
          id: "data-sync-algorithm",
          name: "データ同期アルゴリズム((Data Sync Algorithm))",
          description: "効率的なデータ同期アルゴリズム",
          parent_id: "data-collection-automation-terrain"
        },
        {
          id: "automatic-data-preprocessing-software",
          name: "自動データ前処理ソフトウェア((Automatic Data Preprocessing Software))",
          description: "自動的なデータ前処理ソフトウェア",
          parent_id: "data-collection-automation-terrain"
        },

        // Immediate Field Data Analysis implementations
        {
          id: "customizable-dashboard",
          name: "カスタマイズ可能なダッシュボード((Customizable Dashboard))",
          description: "ユーザー定義可能なデータダッシュボード",
          parent_id: "immediate-field-data-analysis"
        },
        {
          id: "cloud-based-data-storage-analysis",
          name: "クラウドベースデータストレージ((Cloud-based Data Storage))",
          description: "分析用クラウドデータストレージ",
          parent_id: "immediate-field-data-analysis"
        },
        {
          id: "mobile-device-compatibility",
          name: "モバイルデバイス対応((Mobile Device Compatibility))",
          description: "モバイル機器での利用対応",
          parent_id: "immediate-field-data-analysis"
        },
        {
          id: "realtime-data-processing-algorithm-field",
          name: "リアルタイムデータ処理アルゴリズム((Real-time Data Processing Algorithm))",
          description: "現場でのリアルタイムデータ処理アルゴリズム",
          parent_id: "immediate-field-data-analysis"
        },
        {
          id: "integrated-data-platform-development",
          name: "統合データプラットフォームの開発((Integrated Data Platform Development))",
          description: "包括的な統合データプラットフォーム",
          parent_id: "immediate-field-data-analysis"
        }
        // Add more implementation nodes as needed...
      ]
    },
    evaluation: {
      total_score: 79
    }
  }
};
