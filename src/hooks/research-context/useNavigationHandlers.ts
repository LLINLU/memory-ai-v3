
import { useState, useRef } from "react";
import { ContextAnswers } from "./useConversationState";
import { ConversationMessage } from "./useConversationState";

interface NavigationHandlersProps {
  initialQuery: string;
  answers: ContextAnswers;
  conversationHistory: ConversationMessage[];
}

export const useNavigationHandlers = ({ 
  initialQuery, 
  answers, 
  conversationHistory 
}: NavigationHandlersProps) => {
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showScenarios, setShowScenarios] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState<string[]>([]);
  const researchAreasRef = useRef<HTMLDivElement | null>(null);

  const handleInitialOption = (option: 'continue' | 'skip') => {
    setShowInitialOptions(false);
    
    // For continue, we return true to indicate we should show the first question
    // For skip, we immediately proceed to scenario generation
    if (option === 'skip') {
      proceedToTechnologyTree();
      return false;
    }
    
    return true;
  };

  const generateScenarios = () => {
    // Use the new Japanese format for scenarios
    const scenarioTemplates = [
      `本研究の目的は、${answers.what || 'aa'}であり、そのために非侵襲的なバイオセンシング技術を用いた${answers.what || 'aa'}のアプローチに着目しています。
対象となるエンドユーザーは、${answers.who || 'bb'}であり、特に日常的な健康管理の支援が求められる人々です。
この研究成果は、${answers.where || 'cc'}といった場面での活用が期待され、具体的には医療専門職が常に立ち会えない${answers.where || 'cc'}の状況で大きな効果を発揮します。
現在は${answers.when || 'dd'}という段階にあり、プロトタイプを用いた初期のフィールドテストが進行中です。`,
      
      `本研究の目的は、${answers.what || 'aa'}の効率向上であり、そのためにAIと機械学習を活用した${answers.what || 'aa'}の最適化アプローチに着目しています。
対象となるエンドユーザーは、${answers.who || 'bb'}を含む専門家集団であり、特に高度な意思決定支援が求められる分野です。
この研究成果は、${answers.where || 'cc'}における業務プロセスでの活用が期待され、具体的には${answers.where || 'cc'}でのリアルタイム処理において大きな効果を発揮します。
現在は${answers.when || 'dd'}の実証実験を終え、実用化に向けた改良を進めている段階です。`,
      
      `本研究の目的は、${answers.what || 'aa'}における安全性向上であり、そのためにセンサーネットワークと予測モデルを組み合わせた${answers.what || 'aa'}の監視システム構築に着目しています。
対象となるエンドユーザーは、${answers.who || 'bb'}および関連する管理者であり、特に予防的対応が重視される現場です。
この研究成果は、${answers.where || 'cc'}の様々な環境下での活用が期待され、具体的には${answers.where || 'cc'}の異常検知において大きな効果を発揮します。
現在は${answers.when || 'dd'}の検証を完了し、大規模実装に向けた準備段階にあります。`
    ];
    
    setGeneratedScenarios(scenarioTemplates);
    return scenarioTemplates;
  };

  const proceedToTechnologyTree = () => {
    const scenarios = generateScenarios();
    setShowScenarios(true);
    return scenarios;
  };

  const selectScenario = (selectedScenario: string) => {
    // In a real app, this would navigate to the technology tree with the selected scenario
    console.log(`Selected scenario: ${selectedScenario}`);
    
    // Scroll to research areas after a short delay to ensure content is rendered
    setTimeout(() => {
      if (researchAreasRef.current) {
        researchAreasRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Reset navigation state
  const resetNavigation = () => {
    setShowInitialOptions(true);
    setShowScenarios(false);
    setGeneratedScenarios([]);
  };

  return {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    handleInitialOption,
    proceedToTechnologyTree,
    selectScenario,
    setShowScenarios,
    generateScenarios,
    resetNavigation,
    researchAreasRef,
    setGeneratedScenarios
  };
};
