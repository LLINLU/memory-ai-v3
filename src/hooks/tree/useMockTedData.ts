import { getLaserLevel4Data } from './useLaserLevel4Data';

export const getMockTedData = (query: string) => {
  // Check if query includes レーザー for laser-focused forest management data
  if (query.includes('レーザー')) {
    // New comprehensive Level 4 data structure
    const level4Data = {
      // For worker protection (作業者保護)
      "realtime-data-analysis": [
        {
          id: "realtime-laser-monitoring",
          name: "リアルタイムレーザー監視",
          info: "12論文 • 3事例",
          description: "リアルタイムレーザー技術による作業者の安全監視システム",
          level: 4
        },
        {
          id: "laser-range-identification", 
          name: "レーザーによる範囲識別",
          info: "15論文 • 5事例",
          description: "レーザー技術を活用した危険範囲の識別システム",
          level: 4
        },
        {
          id: "laser-guided-felling-machinery",
          name: "レーザーガイド付き伐採機械",
          info: "8論文 • 2事例", 
          description: "レーザーガイダンスを搭載した高精度伐採機械",
          level: 4
        }
      ],
      "forest-conservation-efficiency": [
        {
          id: "dynamic-obstacle-detection",
          name: "動的障害物検出",
          info: "18論文 • 6事例",
          description: "動的な障害物を検出する高度なセンシングシステム",
          level: 4
        },
        {
          id: "terrain-analysis",
          name: "地形分析",
          info: "22論文 • 8事例",
          description: "3D地形モデリングを活用した詳細地形分析",
          level: 4
        },
        {
          id: "tree-density-evaluation",
          name: "樹木密度評価",
          info: "14論文 • 4事例",
          description: "ドローンとレーザースキャンによる樹木密度評価",
          level: 4
        },
        {
          id: "environmental-change-monitoring",
          name: "環境変化モニタリング",
          info: "16論文 • 5事例",
          description: "リアルタイム環境変化監視システム",
          level: 4
        }
      ],
      "ecosystem-monitoring-enhancement": [
        {
          id: "data-accuracy-optimization",
          name: "データ精度の最適化",
          info: "20論文 • 7事例",
          description: "AI機械学習によるデータ精度向上技術",
          level: 4
        },
        {
          id: "laser-path-control",
          name: "レーザー光路制御", 
          info: "11論文 • 3事例",
          description: "精密なレーザー光路制御システム",
          level: 4
        },
        {
          id: "realtime-measurement-feedback",
          name: "実時間測定フィードバック",
          info: "13論文 • 4事例",
          description: "リアルタイム測定結果フィードバックシステム",
          level: 4
        },
        {
          id: "environmental-adaptability",
          name: "環境適応性",
          info: "17論文 • 6事例",
          description: "様々な環境条件に適応する測定システム",
          level: 4
        }
      ],
      "precision-data-collection-improvement": [
        {
          id: "data-fusion",
          name: "データ融合",
          info: "19論文 • 7事例",
          description: "複数データソースの高度な融合技術",
          level: 4
        },
        {
          id: "realtime-warning",
          name: "リアルタイム警告",
          info: "12論文 • 4事例",
          description: "即座の危険警告システム",
          level: 4
        },
        {
          id: "object-identification",
          name: "物体識別",
          info: "16論文 • 5事例",
          description: "機械学習による高精度物体識別",
          level: 4
        },
        {
          id: "distance-measurement",
          name: "距離測定",
          info: "21論文 • 8事例",
          description: "多様なセンサーによる高精度距離測定",
          level: 4
        }
      ],
      // For health evaluation accuracy improvement
      "data-accuracy-improvement": [
        {
          id: "data-analysis-algorithm-optimization",
          name: "データ分析アルゴリズムの最適化",
          info: "25論文 • 9事例",
          description: "機械学習統合による高度データ分析",
          level: 4
        },
        {
          id: "user-interface-improvement",
          name: "ユーザーインターフェースの改善",
          info: "18論文 • 6事例",
          description: "アクセシビリティとパーソナライゼーション重視のUI改善",
          level: 4
        },
        {
          id: "advanced-sensing-technology",
          name: "先進的センシング技術の適用",
          info: "22論文 • 8事例",
          description: "リモートセンシングと耐環境センサー技術",
          level: 4
        },
        {
          id: "detailed-data-collection-protocol",
          name: "詳細データ収集プロトコルの開発",
          info: "16論文 • 5事例",
          description: "クラウドベースデータ共有とドローン画像収集",
          level: 4
        }
      ],
      "new-species-discovery": [
        {
          id: "map-data-collection-accuracy",
          name: "データ収集の精度向上",
          info: "20論文 • 7事例",
          description: "高精細レーザーセンサーとマルチスペクトル分析",
          level: 4
        },
        {
          id: "new-map-visualization-technology",
          name: "新しい地図情報の可視化技術",
          info: "14論文 • 4事例",
          description: "インタラクティブインターフェースと実時間更新",
          level: 4
        },
        {
          id: "existing-map-integration-optimization",
          name: "既存地図データとの統合プロセスの最適化",
          info: "12論文 • 3事例",
          description: "自動更新システムと精度検証ツール",
          level: 4
        },
        {
          id: "forest-3d-mapping-development",
          name: "森林エリアの3Dマッピング技術の開発",
          info: "18論文 • 6事例",
          description: "AI駆動データ解析と高精度レーザースキャナー",
          level: 4
        }
      ],
      "forest-conservation-activity-support": [
        {
          id: "precision-measurement-data-fusion",
          name: "データ融合",
          info: "17論文 • 6事例",
          description: "マシンラーニングモデルと高度アルゴリズム活用",
          level: 4
        },
        {
          id: "precision-measurement-realtime-processing",
          name: "リアルタイムデータ処理",
          info: "19論文 • 7事例",
          description: "分散処理システムと高性能プロセッサー使用",
          level: 4
        },
        {
          id: "laser-scanning",
          name: "レーザースキャニング",
          info: "23論文 • 9事例",
          description: "UAV技術と3Dマッピングソフトウェア",
          level: 4
        },
        {
          id: "health-status-analysis",
          name: "健康状態分析",
          info: "15論文 • 5事例",
          description: "リアルタイムモニタリングと高解像度レーザースキャナー",
          level: 4
        }
      ],
      "forest-loss-monitoring": [
        {
          id: "resource-allocation-optimization",
          name: "リソース配分の最適化",
          info: "16論文 • 5事例",
          description: "データ分析アルゴリズムと適応型スケジューリング",
          level: 4
        },
        {
          id: "sustainable-logging-strategy-development",
          name: "持続可能な伐採戦略の開発",
          info: "21論文 • 8事例",
          description: "選択的伐採技術と環境影響評価",
          level: 4
        },
        {
          id: "environmental-impact-monitoring",
          name: "環境影響のモニタリング",
          info: "18論文 • 6事例",
          description: "遠隔センサー技術と地域社会連携",
          level: 4
        },
        {
          id: "high-precision-data-collection",
          name: "高精度データ収集",
          info: "24論文 • 9事例",
          description: "UAVサーベイと高解像度衛星画像",
          level: 4
        }
      ],
      // For efficient timber harvesting
      "terrain-survey-efficiency": [
        {
          id: "optimized-cutting-path",
          name: "最適化された伐採パス",
          info: "19論文 • 7事例",
          description: "高精度GPSと燃料効率最適化アルゴリズム",
          level: 4
        },
        {
          id: "environmental-impact-assessment",
          name: "環境影響評価",
          info: "22論文 • 8事例",
          description: "生物多様性モニタリングと持続可能な伐採技術",
          level: 4
        },
        {
          id: "precision-measurement-harvesting",
          name: "精密測定",
          info: "17論文 • 6事例",
          description: "3Dスキャニング技術とドローン調査",
          level: 4
        },
        {
          id: "automated-felling-equipment",
          name: "自動化された伐採機器",
          info: "14論文 • 4事例",
          description: "AI駆動プランニングと遠隔操作機能",
          level: 4
        },
        {
          id: "selective-felling",
          name: "選択的伐採",
          info: "20論文 • 7事例",
          description: "ドローン監視と健康評価アルゴリズム",
          level: 4
        }
      ],
      "undeveloped-area-discovery": [
        {
          id: "hazard-identification-system",
          name: "ハザード識別システムの開発",
          info: "18論文 • 6事例",
          description: "センサー技術とリアルタイム通知システム",
          level: 4
        },
        {
          id: "work-environment-monitoring-tools",
          name: "作業環境監視ツールの導入",
          info: "16論文 • 5事例",
          description: "センサーネットワークとリアルタイムデータ分析",
          level: 4
        },
        {
          id: "safety-training-program",
          name: "安全トレーニングプログラムの実施",
          info: "12論文 • 3事例",
          description: "デジタル教育プラットフォームと現場シミュレーション",
          level: 4
        },
        {
          id: "emergency-response-plan",
          name: "緊急事態対応プランの策定",
          info: "15論文 • 4事例",
          description: "モバイル緊急通報システムと避難路マッピング",
          level: 4
        }
      ],
      "forestry-management-optimization": [
        {
          id: "community-partnership-strengthening",
          name: "地域コミュニティとの連携強化",
          info: "21論文 • 8事例",
          description: "共同研究プロジェクトと環境教育プログラム",
          level: 4
        },
        {
          id: "sustainable-logging-technology",
          name: "持続可能な伐採技術の導入",
          info: "19論文 • 7事例",
          description: "低影響伐採機械と持続可能性認証",
          level: 4
        },
        {
          id: "forest-regeneration-program",
          name: "森林再生プログラムの開発",
          info: "17論文 • 6事例",
          description: "生態系統合管理と種の多様性向上",
          level: 4
        },
        {
          id: "biodiversity-monitoring",
          name: "生物多様性の監視",
          info: "23論文 • 9事例",
          description: "リモートセンシング技術と市民科学プログラム",
          level: 4
        }
      ],
      "high-precision-data-collection-forestry": [
        {
          id: "reforestation-program-promotion",
          name: "再植林プログラムの推進",
          info: "18論文 • 6事例",
          description: "ボランティアトレーニングと土壌改善技術",
          level: 4
        },
        {
          id: "soil-erosion-prevention",
          name: "土壌侵食防止措置の強化",
          info: "16論文 • 5事例",
          description: "透水性舗装材と雨水貯留システム",
          level: 4
        },
        {
          id: "sustainable-logging-technology-development",
          name: "持続可能な伐採技術の開発",
          info: "20論文 • 7事例",
          description: "森林認証プログラムと地域共同体協働",
          level: 4
        },
        {
          id: "environmental-impact-assessment-implementation",
          name: "環境影響評価の実施",
          info: "22論文 • 8事例",
          description: "生態系モデリングソフトウェアと生物多様性調査",
          level: 4
        },
        {
          id: "biodiversity-monitoring-environmental",
          name: "生物多様性のモニタリング",
          info: "24論文 • 9事例",
          description: "環境DNA分析と自動音声識別システム",
          level: 4
        }
      ]
    };
    
    return {
      purpose: {
        layer: {
          nodes: [
            {
              id: "portable-laser-forest-management",
              name: "携帯型レーザー計測による森林管理シナリオ",
              description: "携帯型レーザー技術を活用した効率的な森林管理システム",
              parent_id: null
            },
            {
              id: "unmeasured-forest-data-collection",
              name: "未測量森林地域のデータ収集シナリオ",
              description: "これまで測量されていない森林地域での包括的データ収集",
              parent_id: null
            },
            {
              id: "forestry-worker-field-survey",
              name: "林業従事者の現場測量シナリオ",
              description: "林業従事者による効率的な現場測量と管理",
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
            // Portable laser forest management functions
            {
              id: "realtime-data-analysis",
              name: "リアルタイムデータ分析の実現",
              description: "現場でのリアルタイムデータ処理と分析機能",
              parent_id: "portable-laser-forest-management"
            },
            {
              id: "forest-conservation-efficiency",
              name: "森林保全の効率化",
              description: "効率的な森林保全活動の実現",
              parent_id: "portable-laser-forest-management"
            },
            {
              id: "ecosystem-monitoring-enhancement",
              name: "生態系モニタリングの充実",
              description: "包括的な生態系監視システム",
              parent_id: "portable-laser-forest-management"
            },
            {
              id: "precision-data-collection-improvement",
              name: "精密データ収集の向上",
              description: "高精度データ収集技術の改善",
              parent_id: "portable-laser-forest-management"
            },
            // Unmeasured forest functions
            {
              id: "data-accuracy-improvement",
              name: "データ精度向上",
              description: "測定データの品質と精度の向上",
              parent_id: "unmeasured-forest-data-collection"
            },
            {
              id: "new-species-discovery",
              name: "新種生物の発見",
              description: "未知の生物種の発見と分類",
              parent_id: "unmeasured-forest-data-collection"
            },
            {
              id: "forest-conservation-activity-support",
              name: "森林保全活動支援",
              description: "森林保全活動の支援と促進",
              parent_id: "unmeasured-forest-data-collection"
            },
            {
              id: "forest-loss-monitoring",
              name: "森林損失の監視",
              description: "森林減少の監視と早期警告",
              parent_id: "unmeasured-forest-data-collection"
            },
            // Forestry worker functions
            {
              id: "terrain-survey-efficiency",
              name: "地形調査の効率化",
              description: "効率的な地形調査手法の確立",
              parent_id: "forestry-worker-field-survey"
            },
            {
              id: "undeveloped-area-discovery",
              name: "未開発地域の発見",
              description: "新たな未開発地域の特定と評価",
              parent_id: "forestry-worker-field-survey"
            },
            {
              id: "forestry-management-optimization",
              name: "林業管理の最適化",
              description: "林業管理プロセスの最適化",
              parent_id: "forestry-worker-field-survey"
            },
            {
              id: "high-precision-data-collection",
              name: "高精度データ収集",
              description: "高精度な現場データ収集技術",
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
            {
              id: "data-sharing-security-enhancement",
              name: "データ共有のセキュリティ強化",
              description: "安全なデータ共有システムの構築",
              parent_id: "realtime-data-analysis"
            },
            {
              id: "data-collection-automation",
              name: "データ収集の自動化",
              description: "自動化されたデータ収集システム",
              parent_id: "realtime-data-analysis"
            },
            {
              id: "user-interface-optimization",
              name: "ユーザーインターフェースの最適化",
              description: "使いやすいインターフェースの設計",
              parent_id: "realtime-data-analysis"
            },
            {
              id: "environmental-data-immediate-analysis",
              name: "環境データの即時分析",
              description: "環境データのリアルタイム分析機能",
              parent_id: "realtime-data-analysis"
            },
            // Forest conservation efficiency measures
            {
              id: "target-intervention-optimization",
              name: "ターゲット介入の最適化",
              description: "効果的な介入ポイントの特定",
              parent_id: "forest-conservation-efficiency"
            },
            {
              id: "data-driven-decision-making",
              name: "データ駆動型意思決定",
              description: "データに基づいた意思決定システム",
              parent_id: "forest-conservation-efficiency"
            },
            {
              id: "detailed-data-collection",
              name: "詳細データ収集",
              description: "詳細な現場データの収集",
              parent_id: "forest-conservation-efficiency"
            },
            // Ecosystem monitoring measures
            {
              id: "realtime-ecosystem-data-analysis",
              name: "リアルタイムデータ分析",
              description: "生態系データのリアルタイム分析",
              parent_id: "ecosystem-monitoring-enhancement"
            },
            {
              id: "impact-assessment-modeling",
              name: "影響評価モデリング",
              description: "環境影響の評価とモデリング",
              parent_id: "ecosystem-monitoring-enhancement"
            },
            {
              id: "environmental-change-early-warning",
              name: "環境変化の早期警告システム",
              description: "環境変化の早期検出と警告",
              parent_id: "ecosystem-monitoring-enhancement"
            },
            {
              id: "high-precision-data-acquisition",
              name: "高精度データ取得",
              description: "高精度な環境データの取得",
              parent_id: "ecosystem-monitoring-enhancement"
            },
            // Precision data collection measures
            {
              id: "3d-mapping-integration",
              name: "3Dマッピング統合",
              description: "3次元マッピング技術の統合",
              parent_id: "precision-data-collection-improvement"
            },
            {
              id: "data-correction-algorithms",
              name: "データ補正アルゴリズム",
              description: "データの精度向上のための補正技術",
              parent_id: "precision-data-collection-improvement"
            },
            {
              id: "realtime-data-processing",
              name: "リアルタイムデータ処理",
              description: "リアルタイムでのデータ処理機能",
              parent_id: "precision-data-collection-improvement"
            },
            {
              id: "optical-distance-measurement",
              name: "光学距離測定",
              description: "光学技術による距離測定システム",
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
          nodes: Object.values(level4Data).flat()
        },
        evaluation: {
          total_score: 80
        }
      },
      // Add level4Items property for proper data flow
      level4Items: level4Data
    };
  }

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
