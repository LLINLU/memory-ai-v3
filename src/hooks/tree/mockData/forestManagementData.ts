
export const forestManagementData = {
  purpose: {
    layer: {
      nodes: [
        {
          id: "portable-laser-forest-management",
          name: "携帯型レーザー計測による森林管理((Portable Laser Forest Management))",
          description: "携帯型レーザー技術を用いた効率的な森林管理システムの実現",
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
        // Data Sharing Security Enhancement implementations
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
        },

        // Target Intervention Optimization implementations
        {
          id: "custom-laser-scanning-technology",
          name: "カスタムレーザースキャニング技術((Custom Laser Scanning Technology))",
          description: "特定用途に最適化されたレーザースキャニング技術",
          parent_id: "target-intervention-optimization"
        },
        {
          id: "data-driven-vegetation-management-system",
          name: "データ駆動型植生管理システム((Data-driven Vegetation Management System))",
          description: "データに基づく効率的な植生管理システム",
          parent_id: "target-intervention-optimization"
        },
        {
          id: "terrain-analysis-algorithm-application",
          name: "地形分析アルゴリズムの適用((Terrain Analysis Algorithm Application))",
          description: "地形データを活用した最適化アルゴリズム",
          parent_id: "target-intervention-optimization"
        },
        {
          id: "multivariate-analysis-model",
          name: "多変量解析モデル((Multivariate Analysis Model))",
          description: "複数要因を考慮した統合分析モデル",
          parent_id: "target-intervention-optimization"
        },
        {
          id: "sustainability-indicator-integration",
          name: "持続可能性指標の統合((Sustainability Indicator Integration))",
          description: "環境持続性を評価する指標システム",
          parent_id: "target-intervention-optimization"
        },

        // Data-driven Decision Making implementations
        {
          id: "sensor-network-technology",
          name: "センサーネットワーク技術((Sensor Network Technology))",
          description: "分散センサーによる包括的データ収集",
          parent_id: "data-driven-decision-making"
        },
        {
          id: "data-collection-algorithm",
          name: "データ収集アルゴリズム((Data Collection Algorithm))",
          description: "効率的なデータ収集のための最適化アルゴリズム",
          parent_id: "data-driven-decision-making"
        },
        {
          id: "data-analysis-tool",
          name: "データ解析ツール((Data Analysis Tool))",
          description: "高度なデータ分析機能を提供するツール",
          parent_id: "data-driven-decision-making"
        },
        {
          id: "geographic-information-system",
          name: "地理情報システム((Geographic Information System))",
          description: "地理的データの統合管理システム",
          parent_id: "data-driven-decision-making"
        },
        {
          id: "machine-learning-model",
          name: "機械学習モデル((Machine Learning Model))",
          description: "予測分析のための機械学習システム",
          parent_id: "data-driven-decision-making"
        },

        // Detailed Data Collection implementations
        {
          id: "custom-data-processing-algorithm",
          name: "カスタムデータ処理アルゴリズム((Custom Data Processing Algorithm))",
          description: "特定要件に最適化されたデータ処理アルゴリズム",
          parent_id: "detailed-data-collection"
        },
        {
          id: "user-friendly-interface",
          name: "ユーザーフレンドリーインターフェース((User-friendly Interface))",
          description: "直感的で使いやすいユーザーインターフェース",
          parent_id: "detailed-data-collection"
        },
        {
          id: "realtime-data-transfer-technology-detail",
          name: "リアルタイムデータ転送技術((Real-time Data Transfer Technology))",
          description: "即時データ転送のための高速通信技術",
          parent_id: "detailed-data-collection"
        },
        {
          id: "environment-resistant-hardware",
          name: "環境耐性ハードウェア((Environment Resistant Hardware))",
          description: "厳しい環境条件に対応する耐性ハードウェア",
          parent_id: "detailed-data-collection"
        },
        {
          id: "high-resolution-laser-scanner",
          name: "高解像度レーザースキャナー((High Resolution Laser Scanner))",
          description: "詳細な測定データを取得する高解像度スキャナー",
          parent_id: "detailed-data-collection"
        },

        // Real-time Data Analysis (Ecosystem) implementations
        {
          id: "algorithm-optimization",
          name: "アルゴリズム最適化((Algorithm Optimization))",
          description: "処理速度と精度を向上させるアルゴリズム最適化",
          parent_id: "realtime-data-analysis-ecosystem"
        },
        {
          id: "cloud-based-processing",
          name: "クラウドベース処理((Cloud-based Processing))",
          description: "クラウド基盤を活用した高性能データ処理",
          parent_id: "realtime-data-analysis-ecosystem"
        },
        {
          id: "data-filtering-technology-ecosystem",
          name: "データフィルタリング技術((Data Filtering Technology))",
          description: "生態系データの品質向上フィルタリング技術",
          parent_id: "realtime-data-analysis-ecosystem"
        },
        {
          id: "user-interface-improvement",
          name: "ユーザーインターフェイス改善((User Interface Improvement))",
          description: "直感的で効率的なユーザーインターフェースの改善",
          parent_id: "realtime-data-analysis-ecosystem"
        },
        {
          id: "high-speed-data-transfer-infrastructure",
          name: "高速データ転送インフラ((High-speed Data Transfer Infrastructure))",
          description: "大容量データの高速転送インフラ",
          parent_id: "realtime-data-analysis-ecosystem"
        },

        // Impact Assessment Modeling implementations
        {
          id: "data-integration-platform",
          name: "データ統合プラットフォーム((Data Integration Platform))",
          description: "多様なデータソースを統合するプラットフォーム",
          parent_id: "impact-assessment-modeling"
        },
        {
          id: "terrain-data-algorithm",
          name: "地形データアルゴリズム((Terrain Data Algorithm))",
          description: "地形データの分析と処理アルゴリズム",
          parent_id: "impact-assessment-modeling"
        },
        {
          id: "weather-condition-analysis-tool",
          name: "気象条件分析ツール((Weather Condition Analysis Tool))",
          description: "気象データの詳細分析ツール",
          parent_id: "impact-assessment-modeling"
        },
        {
          id: "ecosystem-impact-simulation",
          name: "生態系影響シミュレーション((Ecosystem Impact Simulation))",
          description: "環境変化の生態系への影響予測シミュレーション",
          parent_id: "impact-assessment-modeling"
        },

        // Early Warning System implementations
        {
          id: "data-analysis-algorithm-warning",
          name: "データ分析アルゴリズム((Data Analysis Algorithm))",
          description: "異常検知のためのデータ分析アルゴリズム",
          parent_id: "early-warning-system"
        },
        {
          id: "user-interface-warning",
          name: "ユーザーインターフェース((User Interface))",
          description: "警告情報を効果的に表示するインターフェース",
          parent_id: "early-warning-system"
        },
        {
          id: "realtime-communication-system",
          name: "リアルタイム通信システム((Real-time Communication System))",
          description: "即座の警告配信のための通信システム",
          parent_id: "early-warning-system"
        },
        {
          id: "weather-resistant-device",
          name: "耐候性装置((Weather-resistant Device))",
          description: "厳しい気象条件に対応する耐候性装置",
          parent_id: "early-warning-system"
        },
        {
          id: "high-precision-sensor",
          name: "高精度センサー((High Precision Sensor))",
          description: "微細な環境変化を検知する高精度センサー",
          parent_id: "early-warning-system"
        },

        // High Precision Data Acquisition implementations
        {
          id: "data-processing-algorithm-optimization",
          name: "データ処理アルゴリズムの最適化((Data Processing Algorithm Optimization))",
          description: "高精度データ処理のためのアルゴリズム最適化",
          parent_id: "high-precision-data-acquisition"
        },
        {
          id: "laser-scanning-technology-application",
          name: "レーザースキャニング技術の適用((Laser Scanning Technology Application))",
          description: "高精度測定のためのレーザースキャニング技術",
          parent_id: "high-precision-data-acquisition"
        },
        {
          id: "optical-distance-sensor-usage",
          name: "光学的距離センサーの使用((Optical Distance Sensor Usage))",
          description: "正確な距離測定のための光学センサー",
          parent_id: "high-precision-data-acquisition"
        },
        {
          id: "high-resolution-terrain-data-integration",
          name: "高解像度地形データの統合((High Resolution Terrain Data Integration))",
          description: "詳細な地形情報の統合システム",
          parent_id: "high-precision-data-acquisition"
        },

        // 3D Mapping Integration implementations
        {
          id: "data-integration-software",
          name: "データ統合ソフトウェア((Data Integration Software))",
          description: "3Dマッピングデータの統合処理ソフトウェア",
          parent_id: "3d-mapping-integration"
        },
        {
          id: "laser-scan-technology",
          name: "レーザースキャン技術((Laser Scan Technology))",
          description: "高精度3Dデータ取得のためのレーザースキャン技術",
          parent_id: "3d-mapping-integration"
        },
        {
          id: "lightweight-materials-for-portability",
          name: "携帯性向上のための軽量化材料((Lightweight Materials for Portability))",
          description: "機器の携帯性を向上させる軽量化材料",
          parent_id: "3d-mapping-integration"
        },
        {
          id: "high-precision-gps-system",
          name: "高精度GPSシステム((High Precision GPS System))",
          description: "正確な位置情報取得のためのGPSシステム",
          parent_id: "3d-mapping-integration"
        },

        // Data Correction Algorithm implementations
        {
          id: "calibration-parameter-adjustment",
          name: "キャリブレーションパラメータ調整((Calibration Parameter Adjustment))",
          description: "測定精度向上のためのキャリブレーション調整",
          parent_id: "data-correction-algorithm"
        },
        {
          id: "data-smoothing-method",
          name: "データ平滑化手法((Data Smoothing Method))",
          description: "データのノイズ除去と平滑化処理",
          parent_id: "data-correction-algorithm"
        },
        {
          id: "noise-filtering-algorithm",
          name: "ノイズフィルタリングアルゴリズム((Noise Filtering Algorithm))",
          description: "信号からノイズを除去するフィルタリング技術",
          parent_id: "data-correction-algorithm"
        },
        {
          id: "error-correction-code-for-accuracy",
          name: "精度向上のためのエラー訂正コード((Error Correction Code for Accuracy))",
          description: "データ精度向上のためのエラー訂正技術",
          parent_id: "data-correction-algorithm"
        },

        // Real-time Data Processing implementations
        {
          id: "on-the-fly-error-correction",
          name: "オンザフライエラー訂正((On-the-fly Error Correction))",
          description: "リアルタイムでのエラー検出と訂正機能",
          parent_id: "realtime-data-processing"
        },
        {
          id: "realtime-visualization-tool",
          name: "リアルタイムビジュアライゼーションツール((Real-time Visualization Tool))",
          description: "データをリアルタイムで可視化するツール",
          parent_id: "realtime-data-processing"
        },
        {
          id: "distributed-data-processing-system",
          name: "分散データ処理システム((Distributed Data Processing System))",
          description: "高速処理のための分散処理システム",
          parent_id: "realtime-data-processing"
        },
        {
          id: "adaptive-data-filtering",
          name: "適応データフィルタリング((Adaptive Data Filtering))",
          description: "条件に応じて適応するデータフィルタリング",
          parent_id: "realtime-data-processing"
        },
        {
          id: "high-speed-data-collection-algorithm",
          name: "高速データ収集アルゴリズム((High-speed Data Collection Algorithm))",
          description: "効率的な高速データ収集アルゴリズム",
          parent_id: "realtime-data-processing"
        },

        // Optical Distance Measurement implementations
        {
          id: "laser-light-source",
          name: "レーザー光源((Laser Light Source))",
          description: "高精度距離測定のためのレーザー光源",
          parent_id: "optical-distance-measurement"
        },
        {
          id: "optical-system-adjustment-components",
          name: "光学系調整部品((Optical System Adjustment Components))",
          description: "光学系の精密調整のための部品",
          parent_id: "optical-distance-measurement"
        },
        {
          id: "processing-algorithm-optical",
          name: "処理アルゴリズム((Processing Algorithm))",
          description: "光学測定データの処理アルゴリズム",
          parent_id: "optical-distance-measurement"
        },
        {
          id: "light-receiving-sensor",
          name: "受光センサー((Light Receiving Sensor))",
          description: "レーザー光を受信する高感度センサー",
          parent_id: "optical-distance-measurement"
        }
      ]
    },
    evaluation: {
      total_score: 79
    }
  }
};
