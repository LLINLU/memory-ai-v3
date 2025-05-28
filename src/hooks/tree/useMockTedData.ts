
export const getMockTedData = (query: string) => {
  // Forest management mock data based on the provided structure
  const mockData = {
    purpose: {
      layer: {
        nodes: [
          {
            id: "portable-laser-forest-management",
            name: "携帯型レーザー計測による森林管理((Portable Laser Forest Management))",
            description: "携帯型レーザー技術を用いた効率的な森林管理システムの実現",
            parent_id: null
          },
          {
            id: "unmeasured-forest-data-collection",
            name: "未測量森林地域のデータ収集((Unmeasured Forest Data Collection))", 
            description: "これまで測量されていない森林地域の包括的データ収集",
            parent_id: null
          },
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
          // Portable Laser Forest Management functions
          {
            id: "realtime-data-analysis",
            name: "リアルタイムデータ分析の実現((Real-time Data Analysis))",
            description: "森林データのリアルタイム収集と即座の分析機能",
            parent_id: "portable-laser-forest-management"
          },
          {
            id: "forest-conservation-efficiency",
            name: "森林保全の効率化((Forest Conservation Efficiency))",
            description: "データ駆動型アプローチによる森林保全活動の最適化",
            parent_id: "portable-laser-forest-management"
          },
          {
            id: "ecosystem-monitoring-enhancement", 
            name: "生態系モニタリングの充実((Ecosystem Monitoring Enhancement))",
            description: "包括的な生態系監視システムの構築と運用",
            parent_id: "portable-laser-forest-management"
          },
          {
            id: "precision-data-collection-improvement",
            name: "精密データ収集の向上((Precision Data Collection Improvement))",
            description: "高精度レーザー技術による詳細な森林データ取得",
            parent_id: "portable-laser-forest-management"
          },
          // Unmeasured Forest functions
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
          },
          // Forestry Worker functions
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
            id: "high-precision-data-collection",
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
          // Real-time Data Analysis measures
          {
            id: "data-sharing-security-enhancement",
            name: "データ共有のセキュリティ強化((Data Sharing Security Enhancement))",
            description: "森林データの安全な共有と保護システム",
            parent_id: "realtime-data-analysis"
          },
          {
            id: "data-collection-automation",
            name: "データ収集の自動化((Data Collection Automation))",
            description: "自動化されたデータ収集システムの構築",
            parent_id: "realtime-data-analysis"
          },
          {
            id: "ui-optimization",
            name: "ユーザーインターフェースの最適化((UI Optimization))",
            description: "直感的で効率的なユーザーインターフェースの設計",
            parent_id: "realtime-data-analysis"
          },
          {
            id: "immediate-environmental-data-analysis",
            name: "環境データの即時分析((Immediate Environmental Data Analysis))",
            description: "収集された環境データの即座の解析処理",
            parent_id: "realtime-data-analysis"
          },
          // Forest Conservation Efficiency measures
          {
            id: "target-intervention-optimization",
            name: "ターゲット介入の最適化((Target Intervention Optimization))",
            description: "効果的な森林保全介入ポイントの特定",
            parent_id: "forest-conservation-efficiency"
          },
          {
            id: "data-driven-decision-making",
            name: "データ駆動型意思決定((Data-driven Decision Making))",
            description: "データに基づく科学的な森林管理決定",
            parent_id: "forest-conservation-efficiency"
          },
          {
            id: "detailed-data-collection",
            name: "詳細データ収集((Detailed Data Collection))",
            description: "森林状態の詳細な情報収集システム",
            parent_id: "forest-conservation-efficiency"
          },
          // Ecosystem Monitoring measures
          {
            id: "realtime-data-analysis-ecosystem",
            name: "リアルタイムデータ分析((Real-time Data Analysis))",
            description: "生態系データのリアルタイム解析機能",
            parent_id: "ecosystem-monitoring-enhancement"
          },
          {
            id: "impact-assessment-modeling",
            name: "影響評価モデリング((Impact Assessment Modeling))",
            description: "環境変化の影響を予測するモデリングシステム",
            parent_id: "ecosystem-monitoring-enhancement"
          },
          {
            id: "early-warning-system",
            name: "環境変化の早期警告システム((Early Warning System))",
            description: "環境変化の早期発見と警告システム",
            parent_id: "ecosystem-monitoring-enhancement"
          },
          {
            id: "high-precision-data-acquisition",
            name: "高精度データ取得((High Precision Data Acquisition))",
            description: "生態系の詳細な情報を高精度で取得",
            parent_id: "ecosystem-monitoring-enhancement"
          },
          // Precision Data Collection measures
          {
            id: "3d-mapping-integration",
            name: "3Dマッピング統合((3D Mapping Integration))",
            description: "三次元地形データの統合マッピングシステム",
            parent_id: "precision-data-collection-improvement"
          },
          {
            id: "data-correction-algorithm",
            name: "データ補正アルゴリズム((Data Correction Algorithm))",
            description: "測定データの精度向上のための補正処理",
            parent_id: "precision-data-collection-improvement"
          },
          {
            id: "realtime-data-processing",
            name: "リアルタイムデータ処理((Real-time Data Processing))",
            description: "収集データの即時処理と解析システム",
            parent_id: "precision-data-collection-improvement"
          },
          {
            id: "optical-distance-measurement",
            name: "光学距離測定((Optical Distance Measurement))",
            description: "レーザー光学技術による高精度距離測定",
            parent_id: "precision-data-collection-improvement"
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
          // Data Sharing Security implementations
          {
            id: "access-control-list-setting",
            name: "アクセスコントロールリストの設定((Access Control List Setting))",
            description: "データアクセス権限の詳細な管理システム",
            parent_id: "data-sharing-security-enhancement"
          },
          {
            id: "data-sharing-protocol-update",
            name: "データ共有プロトコルの更新((Data Sharing Protocol Update))",
            description: "最新のセキュリティ基準に準拠したプロトコル",
            parent_id: "data-sharing-security-enhancement"
          },
          {
            id: "two-factor-authentication",
            name: "二要素認証の実装((Two-factor Authentication))",
            description: "多層認証による高度なセキュリティ確保",
            parent_id: "data-sharing-security-enhancement"
          },
          {
            id: "regular-security-audit",
            name: "定期的なセキュリティ監査の実施((Regular Security Audit))",
            description: "継続的なセキュリティ評価と改善システム",
            parent_id: "data-sharing-security-enhancement"
          },
          {
            id: "encryption-algorithm-application",
            name: "暗号化アルゴリズムの適用((Encryption Algorithm Application))",
            description: "最新暗号化技術によるデータ保護システム",
            parent_id: "data-sharing-security-enhancement"
          },
          // Data Collection Automation implementations
          {
            id: "portable-laser-scanner",
            name: "ポータブルレーザースキャナー((Portable Laser Scanner))",
            description: "携帯可能な高精度レーザースキャニング装置",
            parent_id: "data-collection-automation"
          },
          {
            id: "environmental-sensor-placement",
            name: "環境センサー配置((Environmental Sensor Placement))",
            description: "森林環境の包括的モニタリング用センサー",
            parent_id: "data-collection-automation"
          },
          {
            id: "weather-resistant-device-case",
            name: "耐候性装置ケース((Weather-resistant Device Case))",
            description: "厳しい森林環境に対応する保護ケース",
            parent_id: "data-collection-automation"
          },
          {
            id: "automatic-data-sync-software",
            name: "自動データ同期ソフトウェア((Automatic Data Sync Software))",
            description: "クラウドとの自動データ同期システム",
            parent_id: "data-collection-automation"
          },
          // UI Optimization implementations
          {
            id: "accessibility-guideline-compliance",
            name: "アクセシビリティガイドラインの遵守((Accessibility Guideline Compliance))",
            description: "全ユーザーが利用可能なインターフェース設計",
            parent_id: "ui-optimization"
          },
          {
            id: "interactive-design-adoption",
            name: "インタラクティブデザインの採用((Interactive Design Adoption))",
            description: "直感的で応答性の高いユーザーインターフェース",
            parent_id: "ui-optimization"
          },
          {
            id: "data-visualization-tool-integration",
            name: "データ可視化ツールの統合((Data Visualization Tool Integration))",
            description: "複雑なデータを分かりやすく表示するツール",
            parent_id: "ui-optimization"
          },
          {
            id: "performance-optimization-technology",
            name: "パフォーマンス最適化技術((Performance Optimization Technology))",
            description: "高速で効率的なシステム動作の実現",
            parent_id: "ui-optimization"
          },
          {
            id: "user-research-based-design",
            name: "ユーザー研究に基づく設計((User Research-based Design))",
            description: "実際のユーザーニーズに基づいたインターフェース",
            parent_id: "ui-optimization"
          },
          // Immediate Environmental Data Analysis implementations
          {
            id: "cloud-based-analysis-platform",
            name: "クラウドベース解析プラットフォーム((Cloud-based Analysis Platform))",
            description: "スケーラブルなクラウド分析基盤システム",
            parent_id: "immediate-environmental-data-analysis"
          },
          {
            id: "data-filtering-technology",
            name: "データフィルタリング技術((Data Filtering Technology))",
            description: "ノイズ除去と重要データ抽出システム",
            parent_id: "immediate-environmental-data-analysis"
          },
          {
            id: "realtime-data-transfer-technology",
            name: "リアルタイムデータ転送技術((Real-time Data Transfer Technology))",
            description: "低遅延でのデータ伝送システム",
            parent_id: "immediate-environmental-data-analysis"
          },
          {
            id: "machine-learning-model-for-analysis",
            name: "分析のための機械学習モデル((Machine Learning Model for Analysis))",
            description: "AI技術を活用した高度な分析システム",
            parent_id: "immediate-environmental-data-analysis"
          },
          {
            id: "high-speed-processing-algorithm",
            name: "高速処理アルゴリズム((High-speed Processing Algorithm))",
            description: "リアルタイム分析のための最適化アルゴリズム",
            parent_id: "immediate-environmental-data-analysis"
          }
        ]
      },
      evaluation: {
        total_score: 79
      }
    }
  };

  // Customize based on query keywords
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
