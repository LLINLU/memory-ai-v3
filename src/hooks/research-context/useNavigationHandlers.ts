
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
      
      `本研究の目的は、${answers.what || 'aa'}を目的としており、その実現のために機械学習による行動パターン解析というアプローチを採用しています。
このテーマにおけるエンドユーザーは、${answers.who || 'bb'}であり、特に加齢によって日常生活に支障が出始めた人々が主な対象です。
研究成果は、${answers.where || 'cc'}という場面において、家族や介護士による遠隔見守りを支援するツールとしての応用が期待されています。
現時点での開発段階は${answers.when || 'dd'}であり、ユーザーからのフィードバックを取り入れたプロトタイプ改良フェーズにあります。`,
      
      `本研究の目的は、${answers.what || 'aa'}という目標を掲げ、スマートフォンを活用した自己モニタリング手法に着目しています。
エンドユーザーは、${answers.who || 'bb'}であり、特に医師の指示のもとでセルフケアを行う必要がある慢性疾患患者が想定されています。
この技術は、${answers.where || 'cc'}といった医療現場や家庭環境での活用を念頭に置いており、特に通院頻度を減らしながら患者の状態を可視化する場面で貢献します。
研究は${answers.when || 'dd'}の段階にあり、パイロットスタディを通じて初期的な有効性と操作性に関するデータ収集中です。`
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
