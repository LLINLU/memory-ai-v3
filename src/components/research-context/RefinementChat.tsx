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

  useEffect(() => {
    initializeConversation();
  }, [initialQuery]);

  // Emit context updates whenever state changes
  useEffect(() => {
    if (onContextUpdate) {
      onContextUpdate({
        query: initialQuery,
        messages,
        researchAnswers,
        refinementProgress,
        conversationHistory: messages
      });
    }
  }, [messages, researchAnswers, refinementProgress, onContextUpdate, initialQuery]);

  const updateProgress = (newAnswers: Record<string, string>) => {
    const totalQuestions = 4; // focus, purpose, depth, specifics
    const answeredQuestions = Object.keys(newAnswers).length;
    const progress = Math.min((answeredQuestions / totalQuestions) * 100, 100);
    setRefinementProgress(progress);
  };

  const initializeConversation = async () => {
    setIsLoading(true);
    try {
      const systemPrompt = `あなたは研究支援アシスタントです。ユーザーから「${initialQuery}」という研究クエリを受け取りました。

この研究について以下の観点から質問して、より具体的な研究コンテキストを理解してください：
1. 研究の焦点（技術的メカニズム vs 市場応用）
2. 対象ユーザー/市場
3. 研究の深さ（基礎研究 vs 応用研究）
4. 期待する成果

最初の質問として、この技術について「技術的な仕組みや原理」に興味があるか、「市場応用や実用化」に興味があるかを聞いてください。`;

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
      setRefinementProgress(10);
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
    
    const newAnswers = { ...researchAnswers, focus: value };
    setResearchAnswers(newAnswers);
    updateProgress(newAnswers);

    await generateFollowUpQuestion(value, newMessages);
  };

  const generateFollowUpQuestion = async (focus: string, currentMessages: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const context = focus === "technical" ? "技術的な詳細" : "市場応用";
      const prompt = `ユーザーは「${initialQuery}」について${context}に興味を持っています。次に、具体的な研究目的や用途について質問してください。例えば、特定の問題解決、改善したい課題、対象となるユーザー層などについて聞いてください。`;

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

    // Update research answers based on conversation context
    const updatedAnswers = { ...researchAnswers };
    if (!updatedAnswers.purpose && messages.length >= 2) {
      updatedAnswers.purpose = userMessage;
      setResearchAnswers(updatedAnswers);
      updateProgress(updatedAnswers);
    }

    setIsLoading(true);
    try {
      const conversationHistory = newMessages.map(m => `${m.isUser ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
      const prompt = `会話履歴:\n${conversationHistory}\n\n前の会話を踏まえて、研究コンテキストをさらに詳細化するための質問を続けるか、十分な情報が集まった場合は研究の詳細化完了を宣言してください。`;

      const response = await callChatGPT(prompt, 'research');
      
      const finalMessages = [...newMessages, { content: response, isUser: false }];
      setMessages(finalMessages);

      // Check if refinement is complete
      if (finalMessages.length >= 6 || Object.keys(updatedAnswers).length >= 3) {
        setRefinementProgress(100);
        setTimeout(() => {
          onRefinementComplete({
            query: initialQuery,
            researchAnswers: updatedAnswers,
            conversationHistory: finalMessages,
            refinementProgress: 100
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
