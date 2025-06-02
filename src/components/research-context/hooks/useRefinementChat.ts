
import { useState, useEffect } from "react";
import { callChatGPT } from "@/hooks/tree/services/chatGptService";
import { toast } from "@/hooks/use-toast";
import { useResearchQuestions } from "./useResearchQuestions";
import { extractResearchContext, generateQuestionPrompt } from "../utils/contextExtraction";

interface ChatMessage {
  content: string;
  isUser: boolean;
  buttons?: Array<{
    label: string;
    value: string;
  }>;
}

export const useRefinementChat = (
  initialQuery: string,
  onRefinementComplete: (context: any) => void,
  onContextUpdate?: (context: any) => void
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [researchAnswers, setResearchAnswers] = useState<Record<string, string>>({});
  const [refinementProgress, setRefinementProgress] = useState(0);
  const [confidenceLevels, setConfidenceLevels] = useState<Record<string, number>>({});
  const [questionStatus, setQuestionStatus] = useState({
    focus: false,
    purpose: false,
    depth: false,
    targetField: false,
    expectedOutcome: false,
    applications: false
  });
  const [currentQuestionPhase, setCurrentQuestionPhase] = useState("focus");

  const { updateProgress } = useResearchQuestions();

  // Enhanced context emission
  useEffect(() => {
    const contextData = {
      query: initialQuery,
      messages,
      researchAnswers,
      refinementProgress,
      confidenceLevels,
      questionStatus,
      conversationHistory: messages
    };
    
    console.log('Emitting context update:', contextData);
    
    if (onContextUpdate) {
      onContextUpdate(contextData);
    }
  }, [messages, researchAnswers, refinementProgress, confidenceLevels, questionStatus, onContextUpdate, initialQuery]);

  const updateRefinementProgress = (newAnswers: Record<string, string>, newStatus: any) => {
    const { totalProgress, confidence } = updateProgress(newAnswers, newStatus, confidenceLevels);
    setRefinementProgress(totalProgress);
    setConfidenceLevels(confidence);
    setQuestionStatus(newStatus);
  };

  const handleContextExtraction = (userResponse: string, phase: string) => {
    const { updatedAnswers, updatedStatus } = extractResearchContext(
      userResponse, 
      phase, 
      researchAnswers, 
      questionStatus
    );
    
    setResearchAnswers(updatedAnswers);
    updateRefinementProgress(updatedAnswers, updatedStatus);
    
    return { updatedAnswers, updatedStatus };
  };

  const initializeConversation = async () => {
    setIsLoading(true);
    try {
      const systemPrompt = `あなたは研究支援アシスタントです。ユーザーから「${initialQuery}」という研究クエリを受け取りました。

この研究について体系的に質問し、研究コンテキストを理解してください：
1. 研究の焦点（技術的メカニズム vs 市場応用）
2. 具体的な研究目的
3. 研究の深さ（基礎研究 vs 応用研究）
4. 対象分野・領域
5. 期待する成果・アウトプット
6. 応用可能性

最初に、この技術について「技術的な仕組みや原理」に興味があるか、「市場応用や実用化」に興味があるかを明確に聞いてください。`;

      const response = await callChatGPT(systemPrompt, 'research');
      
      const initialMessage: ChatMessage = {
        content: response,
        isUser: false,
        buttons: [
          { label: "技術的な仕組み・原理", value: "technical" },
          { label: "市場応用・実用化", value: "market" }
        ]
      };

      setMessages([initialMessage]);
      setRefinementProgress(5);
    } catch (error) {
      toast({
        title: "エラー",
        description: "会話の初期化に失敗しました。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFollowUpQuestion = async (phase: string, currentMessages: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const prompt = generateQuestionPrompt(phase, initialQuery);
      const response = await callChatGPT(prompt, 'research');
      const newMessages = [...currentMessages, { content: response, isUser: false }];
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async (value: string) => {
    const buttonResponse = value === "technical" ? "技術的な仕組み・原理に興味があります" : "市場応用・実用化に興味があります";
    
    const newMessages = [...messages, { content: buttonResponse, isUser: true }];
    setMessages(newMessages);
    
    handleContextExtraction(buttonResponse, "focus");
    setCurrentQuestionPhase("purpose");

    await generateFollowUpQuestion("purpose", newMessages);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue("");
    const newMessages = [...messages, { content: userMessage, isUser: true }];
    setMessages(newMessages);

    // Extract context based on current phase
    handleContextExtraction(userMessage, currentQuestionPhase);

    // Determine next phase
    const phases = ["focus", "purpose", "depth", "targetField", "expectedOutcome", "applications"];
    const currentIndex = phases.indexOf(currentQuestionPhase);
    const nextPhase = phases[currentIndex + 1];

    setIsLoading(true);
    try {
      if (nextPhase) {
        setCurrentQuestionPhase(nextPhase);
        await generateFollowUpQuestion(nextPhase, newMessages);
      } else {
        // All questions completed
        const completionMessage = "研究コンテキストの詳細化が完了しました。収集された情報に基づいて、あなたの研究に最適化された技術ツリーを生成する準備が整いました。";
        
        const finalMessages = [...newMessages, { content: completionMessage, isUser: false }];
        setMessages(finalMessages);
        setRefinementProgress(100);

        setTimeout(() => {
          onRefinementComplete({
            query: initialQuery,
            researchAnswers,
            conversationHistory: finalMessages,
            refinementProgress: 100,
            confidenceLevels,
            questionStatus: { ...questionStatus, applications: true }
          });
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleButtonClick,
    handleSendMessage,
    initializeConversation
  };
};
