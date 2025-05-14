import React, { useState } from "react";
import { Step } from "@/components/research-context/ResearchSteps";

export interface ContextAnswers {
  what: string;
  who: string;
  where: string;
  when: string;
}

export interface ConversationMessage {
  type: "system" | "user";
  content: React.ReactNode | string;
  questionType?: string;
}

export const useConversationState = (steps: Step[]) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [answers, setAnswers] = useState<ContextAnswers>({
    what: "",
    who: "",
    where: "",
    when: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const addUserResponse = (userInput: string | null) => {
    if (userInput) {
      // Add user response to conversation history
      setConversationHistory(prev => [
        ...prev,
        { type: "user", content: userInput }
      ]);

      // Update answers state
      const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
      const newAnswers = { ...answers };
      newAnswers[currentKey] = userInput;
      setAnswers(newAnswers);
    } else {
      // Add skip message to conversation
      setConversationHistory(prev => [
        ...prev,
        { type: "user", content: "Skipped" }
      ]);
    }

    // Clear input field
    setInputValue("");
    // Move to next step
    setCurrentStep(prev => prev + 1);
  };

  // Function to update a user response when edited
  const updateUserResponse = (content: string, index: number) => {
    // Find which question this response was for
    const questionBeforeIndex = index - 1;
    let questionType = "";
    
    if (questionBeforeIndex >= 0 && conversationHistory[questionBeforeIndex].questionType) {
      questionType = conversationHistory[questionBeforeIndex].questionType || "";
    }

    // Update the conversation history
    setConversationHistory(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], content };
      return updated;
    });

    // Also update the answers state if we can determine which one to update
    if (questionType && Object.keys(answers).includes(questionType)) {
      setAnswers(prev => ({
        ...prev,
        [questionType]: content
      }));
    }

    // Reset current step to the next question after this edited response
    const nextQuestionIndex = Math.floor((index + 2) / 2);
    setCurrentStep(nextQuestionIndex);
  };

  const addNextQuestion = (nextStep: number) => {
    if (nextStep < steps.length) {
      const nextQuestion = (
        <div>
          <div className="flex items-start gap-4">
            {steps[nextStep].icon}
            <div>
              <h3 className="text-[16px] font-semibold">{steps[nextStep].question}</h3>
              <ul className="mt-2 space-y-1">
                {steps[nextStep].subtitle.map((item, i) => (
                  <li key={i} className="text-gray-700 text-[14px]">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
      
      setTimeout(() => {
        setConversationHistory(prev => [
          ...prev,
          { 
            type: "system", 
            content: nextQuestion,
            questionType: Object.keys(answers)[nextStep]
          }
        ]);
      }, 300);
    }
  };

  const addCompletionMessage = () => {
    setTimeout(() => {
      setConversationHistory(prev => [
        ...prev,
        { 
          type: "system", 
          content: "ご回答いただきありがとうございます。ご回答に基づき、研究シナリオを生成しました。右側のプレビューパネルからシナリオを選択してください。"
        }
      ]);
    }, 300);
  };

  const addInitialMessage = () => {
    const initialMessage = (
      <div>
        <p className="mb-6">研究コンテキストを手早く定義しましょう。これらの質問に答えることで結果をより絞り込めますが、スキップしてもかまいません。</p>
        <div className="flex items-start gap-4">
          {steps[0].icon}
          <div>
            <h3 className="text-[16px] font-semibold">{steps[0].question}</h3>
            <ul className="mt-2 space-y-1">
              {steps[0].subtitle.map((item, i) => (
                <li key={i} className="text-gray-700 text-[14px]">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
    
    setConversationHistory([{ type: "system", content: initialMessage, questionType: "what" }]);
  };

  // Reset conversation to initial state
  const resetConversation = () => {
    setCurrentStep(0);
    setInputValue("");
    setConversationHistory([]);
    setAnswers({
      what: "",
      who: "",
      where: "",
      when: ""
    });
  };

  return {
    currentStep,
    inputValue,
    conversationHistory,
    answers,
    handleInputChange,
    addUserResponse,
    addNextQuestion,
    addCompletionMessage,
    addInitialMessage,
    setConversationHistory,
    updateUserResponse,
    setInputValue,
    resetConversation
  };
};
