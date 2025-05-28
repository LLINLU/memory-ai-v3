
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
        // Add all measure nodes for unmeasured forest data collection
        // This would include all the nodes under data accuracy, species discovery, etc.
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
