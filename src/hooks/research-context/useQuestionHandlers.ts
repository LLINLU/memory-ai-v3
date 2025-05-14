
import React from "react";
import { Button } from "@/components/ui/button";
import { ConversationMessage, ContextAnswers, Step } from "./types";

export const useQuestionHandlers = (
  setConversationHistory: React.Dispatch<React.SetStateAction<ConversationMessage[]>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setShowingSkipHint: React.Dispatch<React.SetStateAction<boolean>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  answers: ContextAnswers,
  setAnswers: React.Dispatch<React.SetStateAction<ContextAnswers>>
) => {
  const addUserResponse = (userInput: string | null, currentStep: number, showingSkipHint: boolean) => {
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
      
      // Clear input field
      setInputValue("");
      
      // Move to next step
      setCurrentStep(prev => prev + 1);
      
      // If we were showing a skip hint, we're no longer showing it
      if (showingSkipHint) {
        setShowingSkipHint(false);
      }
    } else {
      // Special case for skipping the first question
      if (currentStep === 0 && !showingSkipHint) {
        // Add custom skip message for first question and show the hint
        setConversationHistory(prev => [
          ...prev,
          { type: "user", content: "スキップ" },
          { 
            type: "system", 
            content: "より良い検索結果を得るために、この質問にご回答いただけると嬉しいです。\n下の例も参考にしながら、気軽に書いてみてください。\nもちろん、スキップしていただいても大丈夫です。\n\n考えるヒント：\n\nどんなアプローチ・技術・方法に注目していますか？\n　例：非薬理学的治療、画像技術\n\nその研究の目的や目標は何ですか？\n　例：症状の管理、診断の改善"
          }
        ]);
        
        // Set the flag to indicate we're showing the hint
        setShowingSkipHint(true);
        
        // Don't move to the next step yet
        return;
      } 
      // If they skip again after seeing the hint, or skip any other question
      else {
        // Add regular skip message for other questions
        setConversationHistory(prev => [
          ...prev,
          { type: "user", content: "Skipped" }
        ]);
        
        // If we were showing a skip hint, we're no longer showing it
        if (showingSkipHint) {
          setShowingSkipHint(false);
        }
        
        // Clear input field
        setInputValue("");
        
        // Move to next step
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  // Function to update a user response when edited
  const updateUserResponse = (content: string, index: number) => {
    // Find which question this response was for
    const questionBeforeIndex = index - 1;
    let questionType = "";
    
    setConversationHistory(prev => {
      if (questionBeforeIndex >= 0 && prev[questionBeforeIndex].questionType) {
        questionType = prev[questionBeforeIndex].questionType || "";
      }
      
      // Update the conversation history
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

  const addNextQuestion = (nextStep: number, steps: Step[]) => {
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
      
      setConversationHistory(prev => [
        ...prev,
        { 
          type: "system", 
          content: nextQuestion,
          questionType: Object.keys(answers)[nextStep]
        }
      ]);
    }
  };

  const addCompletionMessage = () => {
    setConversationHistory(prev => [
      ...prev,
      { 
        type: "system", 
        content: "ご回答いただきありがとうございます。ご回答に基づき、研究シナリオを生成しました。右側のプレビューパネルからシナリオを選択してください。"
      }
    ]);
  };

  return {
    addUserResponse,
    updateUserResponse,
    addNextQuestion,
    addCompletionMessage
  };
};
