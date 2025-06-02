
export const RESEARCH_QUESTIONS = {
  focus: { weight: 20, label: "研究の焦点" },
  purpose: { weight: 20, label: "研究目的" },
  depth: { weight: 15, label: "研究の深さ" },
  targetField: { weight: 15, label: "対象分野" },
  expectedOutcome: { weight: 15, label: "期待成果" },
  applications: { weight: 15, label: "応用領域" }
};

export const useResearchQuestions = () => {
  const updateProgress = (answers: Record<string, string>, status: any, confidenceLevels: Record<string, number>) => {
    let totalProgress = 0;
    let confidence = { ...confidenceLevels };
    
    Object.entries(RESEARCH_QUESTIONS).forEach(([key, config]) => {
      if (answers[key]) {
        totalProgress += config.weight;
        confidence[key] = Math.min((confidence[key] || 0) + 25, 100);
      }
    });
    
    return { totalProgress, confidence };
  };

  return { RESEARCH_QUESTIONS, updateProgress };
};
