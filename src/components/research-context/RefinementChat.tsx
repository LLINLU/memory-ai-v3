
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { callChatGPT } from "@/hooks/tree/services/chatGptService";
import { toast } from "@/hooks/use-toast";

interface RefinementChatProps {
  initialQuery: string;
  onRefinementComplete: (context: any) => void;
  onContextUpdate?: (context: any) => void;
}

interface ChatMessage {
  content: string;
  isUser: boolean;
  buttons?: Array<{
    label: string;
    value: string;
  }>;
}

const RESEARCH_QUESTIONS = {
  focus: { weight: 20, label: "研究の焦点" },
  purpose: { weight: 20, label: "研究目的" },
  depth: { weight: 15, label: "研究の深さ" },
  targetField: { weight: 15, label: "対象分野" },
  expectedOutcome: { weight: 15, label: "期待成果" },
  applications: { weight: 15, label: "応用領域" }
};

export const RefinementChat = ({ 
  initialQuery, 
  onRefinementComplete,
  onContextUpdate 
}: RefinementChatProps) => {
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

  useEffect(() => {
    initializeConversation();
  }, [initialQuery]);

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

  const updateProgress = (newAnswers: Record<string, string>, newStatus: any) => {
    let totalProgress = 0;
    let confidence = { ...confidenceLevels };
    
    Object.entries(RESEARCH_QUESTIONS).forEach(([key, config]) => {
      if (newAnswers[key]) {
        totalProgress += config.weight;
        confidence[key] = Math.min((confidence[key] || 0) + 25, 100);
      }
    });
    
    setRefinementProgress(totalProgress);
    setConfidenceLevels(confidence);
    setQuestionStatus(newStatus);
  };

  const extractResearchContext = (userResponse: string, phase: string) => {
    const updatedAnswers = { ...researchAnswers };
    const updatedStatus = { ...questionStatus };
    
    // Enhanced context extraction based on conversation phase
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
    
    setResearchAnswers(updatedAnswers);
    updateProgress(updatedAnswers, updatedStatus);
    
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

  const handleButtonClick = async (value: string) => {
    const buttonResponse = value === "technical" ? "技術的な仕組み・原理に興味があります" : "市場応用・実用化に興味があります";
    
    const newMessages = [...messages, { content: buttonResponse, isUser: true }];
    setMessages(newMessages);
    
    extractResearchContext(buttonResponse, "focus");
    setCurrentQuestionPhase("purpose");

    await generateFollowUpQuestion("purpose", newMessages);
  };

  const generateFollowUpQuestion = async (phase: string, currentMessages: ChatMessage[]) => {
    setIsLoading(true);
    try {
      let prompt = "";
      
      switch (phase) {
        case "purpose":
          prompt = `ユーザーは「${initialQuery}」について研究しています。次に、具体的な研究目的について質問してください。何を解決したいのか、何を改善したいのか、どのような課題に取り組みたいのかを詳しく聞いてください。`;
          break;
        case "depth":
          prompt = `研究目的が分かりました。次に、研究の深さについて質問してください。基礎的な理論・原理を追求したいのか、実用的な応用・実装に焦点を当てたいのかを聞いてください。`;
          break;
        case "targetField":
          prompt = `研究の深さが分かりました。次に、具体的な対象分野や応用領域について質問してください。どのような業界、分野、用途に焦点を当てたいのかを詳しく聞いてください。`;
          break;
        case "expectedOutcome":
          prompt = `対象分野が分かりました。次に、期待する研究成果について質問してください。論文、特許、プロトタイプ、商用化など、どのような形の成果を期待しているかを聞いてください。`;
          break;
        case "applications":
          prompt = `期待成果が分かりました。最後に、この研究の応用可能性について質問してください。他の分野への展開可能性や、関連技術との組み合わせについて聞いてください。`;
          break;
      }

      const response = await callChatGPT(prompt, 'research');
      const newMessages = [...currentMessages, { content: response, isUser: false }];
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue("");
    const newMessages = [...messages, { content: userMessage, isUser: true }];
    setMessages(newMessages);

    // Extract context based on current phase
    extractResearchContext(userMessage, currentQuestionPhase);

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.buttons && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {message.buttons.map((button, btnIndex) => (
                    <Button
                      key={btnIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => handleButtonClick(button.value)}
                      className={message.isUser ? "border-white text-white hover:bg-white hover:text-blue-600" : ""}
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="研究について詳しく教えてください..."
            className="flex-1"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
