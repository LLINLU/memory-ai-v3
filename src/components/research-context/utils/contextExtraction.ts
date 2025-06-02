
export const extractResearchContext = (
  userResponse: string, 
  phase: string, 
  researchAnswers: Record<string, string>,
  questionStatus: Record<string, boolean>
) => {
  const updatedAnswers = { ...researchAnswers };
  const updatedStatus = { ...questionStatus };
  
  switch (phase) {
    case "focus":
      updatedAnswers.focus = userResponse.includes("技術") || userResponse.includes("technical") ? "technical" : "market";
      updatedStatus.focus = true;
      break;
    case "purpose":
      updatedAnswers.purpose = userResponse;
      updatedStatus.purpose = true;
      break;
    case "depth":
      if (userResponse.includes("基礎") || userResponse.includes("理論")) {
        updatedAnswers.depth = "基礎研究";
      } else if (userResponse.includes("応用") || userResponse.includes("実用")) {
        updatedAnswers.depth = "応用研究";
      } else {
        updatedAnswers.depth = "混合研究";
      }
      updatedStatus.depth = true;
      break;
    case "targetField":
      updatedAnswers.targetField = userResponse;
      updatedStatus.targetField = true;
      break;
    case "expectedOutcome":
      updatedAnswers.expectedOutcome = userResponse;
      updatedStatus.expectedOutcome = true;
      break;
    case "applications":
      updatedAnswers.applications = userResponse;
      updatedStatus.applications = true;
      break;
  }
  
  return { updatedAnswers, updatedStatus };
};

export const generateQuestionPrompt = (phase: string, initialQuery: string) => {
  switch (phase) {
    case "purpose":
      return `ユーザーは「${initialQuery}」について研究しています。次に、具体的な研究目的について質問してください。何を解決したいのか、何を改善したいのか、どのような課題に取り組みたいのかを詳しく聞いてください。`;
    case "depth":
      return `研究目的が分かりました。次に、研究の深さについて質問してください。基礎的な理論・原理を追求したいのか、実用的な応用・実装に焦点を当てたいのかを聞いてください。`;
    case "targetField":
      return `研究の深さが分かりました。次に、具体的な対象分野や応用領域について質問してください。どのような業界、分野、用途に焦点を当てたいのかを詳しく聞いてください。`;
    case "expectedOutcome":
      return `対象分野が分かりました。次に、期待する研究成果について質問してください。論文、特許、プロトタイプ、商用化など、どのような形の成果を期待しているかを聞いてください。`;
    case "applications":
      return `期待成果が分かりました。最後に、この研究の応用可能性について質問してください。他の分野への展開可能性や、関連技術との組み合わせについて聞いてください。`;
    default:
      return "";
  }
};
