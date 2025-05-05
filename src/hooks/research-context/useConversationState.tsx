
import React, { useState } from "react";
import { Step } from "@/components/research-context/ResearchSteps";

export interface ContextAnswers {
  who: string;
  what: string;
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
    who: "",
    what: "",
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

  const addNextQuestion = (nextStep: number) => {
    if (nextStep < steps.length) {
      const nextQuestion = (
        <div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 rounded-full p-2 text-white">
              {steps[nextStep].icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{steps[nextStep].question}</h3>
              <ul className="mt-2 space-y-1">
                {steps[nextStep].subtitle.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
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
          content: "Thank you for providing these details. I'll now build your personalized research map."
        }
      ]);
    }, 300);
  };

  const addInitialMessage = () => {
    const initialMessage = (
      <div>
        <p className="mb-4">Let's quickly define your research context. These 4 questions help refine your results, but feel free to skip any.</p>
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 rounded-full p-2 text-white">
            {steps[0].icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{steps[0].question}</h3>
            <ul className="mt-2 space-y-1">
              {steps[0].subtitle.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
    
    setConversationHistory([{ type: "system", content: initialMessage, questionType: "who" }]);
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
    setConversationHistory
  };
};
