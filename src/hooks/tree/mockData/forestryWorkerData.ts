
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
        // Add all measure nodes for forestry worker scenarios
      ]
    },
    evaluation: {
      total_score: 82
    }
  },
  implementation: {
    layer: {
      nodes: [
        // Add all implementation nodes
      ]
    },
    evaluation: {
      total_score: 79
    }
  }
};
