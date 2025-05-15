
import React, { useState } from "react";
import { Step } from "@/components/research-context/ResearchSteps";
import { Button } from "@/components/ui/button";
import { OptionSelection } from "@/components/research-context/OptionSelection";

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
  const [helpButtonClicked, setHelpButtonClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleOptionSelect = (value: string, label: string) => {
    setSelectedOption(value);
    
    // Add user response to conversation history using the exact label from the button
    setConversationHistory(prev => [
      ...prev,
      { type: "user", content: label }
    ]);

    // Update answers state
    const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
    const newAnswers = { ...answers };
    newAnswers[currentKey] = label;
    setAnswers(newAnswers);
    
    // Clear input field and selected option
    setInputValue("");
    setSelectedOption("");
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
    
    // Add next question immediately
    if (currentStep + 1 < steps.length) {
      addNextQuestion(currentStep + 1);
    } else {
      addCompletionMessage();
    }
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
      // Special case for skipping the first question
      if (currentStep === 0) {
        // Add custom skip message for first question
        setConversationHistory(prev => [
          ...prev,
          { type: "user", content: "スキップ" },
          { 
            type: "system", 
            content: "より良い検索結果を得るために、この質問にご回答いただけると嬉しいです😊。上の鉛筆アイコンをクリックすると、ご回答できます。"
          }
        ]);
      } else {
        // Add regular skip message for other questions
        setConversationHistory(prev => [
          ...prev,
          { type: "user", content: "Skipped" }
        ]);
      }
    }

    // Clear input field
    setInputValue("");
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
    
    // Add the next question immediately after adding the user response
    if (currentStep + 1 < steps.length) {
      addNextQuestion(currentStep + 1);
    } else {
      addCompletionMessage();
    }
  };

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
      let questionContent: React.ReactNode;
      
      // Check if this step has options to display
      if (steps[nextStep].options && steps[nextStep].options.length > 0) {
        questionContent = (
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
            <div className="mt-4 ml-12">
              <OptionSelection 
                options={steps[nextStep].options || []}
                onSelect={handleOptionSelect}
                selectedValue={selectedOption}
                onCustomOption={() => {}}
                customOptionLabel="他の提案"
                iconType={steps[nextStep].iconType}
              />
            </div>
          </div>
        );
      } else {
        questionContent = (
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
      }
      
      // Add the question to conversation history
      setConversationHistory(prev => [
        ...prev,
        { 
          type: "system", 
          content: questionContent,
          questionType: Object.keys(answers)[nextStep]
        }
      ]);
    }
  };

  const addCompletionMessage = () => {
    // Add completion message to conversation history (only one time)
    setConversationHistory(prev => [
      ...prev,
      { 
        type: "system", 
        content: "ご回答をもとに、いくつかの研究シナリオを作成しました。右側のプレビューパネルから選んでみてください!"
      }
    ]);
  };

  const addInitialMessage = () => {
    const initialMessage = (
      <div>
        <p className="mb-6">研究コンテキストを手早く定義しましょう。これらの質問に答えることで結果をより絞り込めますが、スキップしてもかまいません。</p>
        <div className="flex items-start gap-4">
          {steps[0].icon}
          <div>
            <h3 className="text-[16px] font-semibold">{steps[0].question}</h3>
            {steps[0].helpButtonText && !helpButtonClicked && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleHelpMeClick()}
                className="mt-2"
                style={{ background: "aliceblue", borderColor: "#b5d2f7" }}
              >
                {steps[0].helpButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
    
    setConversationHistory([{ type: "system", content: initialMessage, questionType: "what" }]);
  };

  const handleHelpMeClick = () => {
    // Mark the help button as clicked so it won't be shown again
    setHelpButtonClicked(true);
    
    // Add the help content as a new message with the microcopy
    setConversationHistory(prev => [
      ...prev,
      { 
        type: "system" as const, 
        content: (
          <div>
            <p className="mb-2 text-gray-700">以下は考えるヒントです。すべてに答える必要はありません 👍</p>
            <ul className="mt-2 space-y-1">
              <li className="text-gray-700 text-[14px] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="mr-1.5 flex-shrink-0">
                  <g clipPath="url(#clip0_219_5)">
                    <path d="M10.5625 7.3125C10.5635 7.47814 10.5132 7.64003 10.4184 7.77589C10.3237 7.91175 10.1891 8.01491 10.0333 8.07117L7.41405 9.03906L6.44921 11.6604C6.39207 11.8156 6.2887 11.9496 6.15303 12.0442C6.01737 12.1388 5.85594 12.1896 5.69054 12.1896C5.52513 12.1896 5.36371 12.1388 5.22804 12.0442C5.09238 11.9496 4.989 11.8156 4.93186 11.6604L3.96093 9.03906L1.3396 8.07422C1.18438 8.01708 1.05041 7.91371 0.955787 7.77804C0.861161 7.64238 0.810425 7.48095 0.810425 7.31555C0.810425 7.15014 0.861161 6.98872 0.955787 6.85305C1.05041 6.71739 1.18438 6.61401 1.3396 6.55687L3.96093 5.58594L4.92577 2.96461C4.98291 2.80939 5.08628 2.67542 5.22195 2.5808C5.35761 2.48617 5.51904 2.43544 5.68444 2.43544C5.84985 2.43544 6.01127 2.48617 6.14694 2.5808C6.2826 2.67542 6.38598 2.80939 6.44311 2.96461L7.41405 5.58594L10.0354 6.55078C10.1913 6.60755 10.3257 6.71132 10.4201 6.84776C10.5146 6.9842 10.5643 7.14659 10.5625 7.3125ZM7.71874 2.4375H8.53124V3.25C8.53124 3.35774 8.57404 3.46108 8.65023 3.53726C8.72641 3.61345 8.82974 3.65625 8.93749 3.65625C9.04523 3.65625 9.14856 3.61345 9.22475 3.53726C9.30094 3.46108 9.34374 3.35774 9.34374 3.25V2.4375H10.1562C10.264 2.4375 10.3673 2.3947 10.4435 2.31851C10.5197 2.24233 10.5625 2.13899 10.5625 2.03125C10.5625 1.92351 10.5197 1.82017 10.4435 1.74399C10.3673 1.6678 10.264 1.625 10.1562 1.625H9.34374V0.8125C9.34374 0.704756 9.30094 0.601424 9.22475 0.525238C9.14856 0.449051 9.04523 0.40625 8.93749 0.40625C8.82974 0.40625 8.72641 0.449051 8.65023 0.525238C8.57404 0.601424 8.53124 0.704756 8.53124 0.8125V1.625H7.71874C7.61099 1.625 7.50766 1.6678 7.43148 1.74399C7.35529 1.82017 7.31249 1.92351 7.31249 2.03125C7.31249 2.13899 7.35529 2.24233 7.43148 2.31851C7.50766 2.3947 7.61099 2.4375 7.71874 2.4375ZM12.1875 4.0625H11.7812V3.65625C11.7812 3.54851 11.7384 3.44517 11.6623 3.36899C11.5861 3.2928 11.4827 3.25 11.375 3.25C11.2672 3.25 11.1639 3.2928 11.0877 3.36899C11.0115 3.44517 10.9687 3.54851 10.9687 3.65625V4.0625H10.5625C10.4547 4.0625 10.3514 4.1053 10.2752 4.18149C10.199 4.25767 10.1562 4.36101 10.1562 4.46875C10.1562 4.57649 10.199 4.67983 10.2752 4.75601C10.3514 4.8322 10.4547 4.875 10.5625 4.875H10.9687V5.28125C10.9687 5.38899 11.0115 5.49233 11.0877 5.56851C11.1639 5.6447 11.2672 5.6875 11.375 5.6875C11.4827 5.6875 11.5861 5.6447 11.6623 5.56851C11.7384 5.49233 11.7812 5.38899 11.7812 5.28125V4.875H12.1875C12.2952 4.875 12.3986 4.8322 12.4748 4.75601C12.5509 4.67983 12.5937 4.57649 12.5937 4.46875C12.5937 4.36101 12.5509 4.25767 12.4748 4.18149C12.3986 4.1053 12.2952 4.0625 12.1875 4.0625Z" fill="#9CA8D5"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_219_5">
                      <rect width="13" height="13" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                着目するアプローチ、技術、または方法論は何ですか？（例：非薬理学的治療、画像技術）
              </li>
              <li className="text-gray-700 text-[14px] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="mr-1.5 flex-shrink-0">
                  <g clipPath="url(#clip0_219_5)">
                    <path d="M10.5625 7.3125C10.5635 7.47814 10.5132 7.64003 10.4184 7.77589C10.3237 7.91175 10.1891 8.01491 10.0333 8.07117L7.41405 9.03906L6.44921 11.6604C6.39207 11.8156 6.2887 11.9496 6.15303 12.0442C6.01737 12.1388 5.85594 12.1896 5.69054 12.1896C5.52513 12.1896 5.36371 12.1388 5.22804 12.0442C5.09238 11.9496 4.989 11.8156 4.93186 11.6604L3.96093 9.03906L1.3396 8.07422C1.18438 8.01708 1.05041 7.91371 0.955787 7.77804C0.861161 7.64238 0.810425 7.48095 0.810425 7.31555C0.810425 7.15014 0.861161 6.98872 0.955787 6.85305C1.05041 6.71739 1.18438 6.61401 1.3396 6.55687L3.96093 5.58594L4.92577 2.96461C4.98291 2.80939 5.08628 2.67542 5.22195 2.5808C5.35761 2.48617 5.51904 2.43544 5.68444 2.43544C5.84985 2.43544 6.01127 2.48617 6.14694 2.5808C6.2826 2.67542 6.38598 2.80939 6.44311 2.96461L7.41405 5.58594L10.0354 6.55078C10.1913 6.60755 10.3257 6.71132 10.4201 6.84776C10.5146 6.9842 10.5643 7.14659 10.5625 7.3125ZM7.71874 2.4375H8.53124V3.25C8.53124 3.35774 8.57404 3.46108 8.65023 3.53726C8.72641 3.61345 8.82974 3.65625 8.93749 3.65625C9.04523 3.65625 9.14856 3.61345 9.22475 3.53726C9.30094 3.46108 9.34374 3.35774 9.34374 3.25V2.4375H10.1562C10.264 2.4375 10.3673 2.3947 10.4435 2.31851C10.5197 2.24233 10.5625 2.13899 10.5625 2.03125C10.5625 1.92351 10.5197 1.82017 10.4435 1.74399C10.3673 1.6678 10.264 1.625 10.1562 1.625H9.34374V0.8125C9.34374 0.704756 9.30094 0.601424 9.22475 0.525238C9.14856 0.449051 9.04523 0.40625 8.93749 0.40625C8.82974 0.40625 8.72641 0.449051 8.65023 0.525238C8.57404 0.601424 8.53124 0.704756 8.53124 0.8125V1.625H7.71874C7.61099 1.625 7.50766 1.6678 7.43148 1.74399C7.35529 1.82017 7.31249 1.92351 7.31249 2.03125C7.31249 2.13899 7.35529 2.24233 7.43148 2.31851C7.50766 2.3947 7.61099 2.4375 7.71874 2.4375ZM12.1875 4.0625H11.7812V3.65625C11.7812 3.54851 11.7384 3.44517 11.6623 3.36899C11.5861 3.2928 11.4827 3.25 11.375 3.25C11.2672 3.25 11.1639 3.2928 11.0877 3.36899C11.0115 3.44517 10.9687 3.54851 10.9687 3.65625V4.0625H10.5625C10.4547 4.0625 10.3514 4.1053 10.2752 4.18149C10.199 4.25767 10.1562 4.36101 10.1562 4.46875C10.1562 4.57649 10.199 4.67983 10.2752 4.75601C10.3514 4.8322 10.4547 4.875 10.5625 4.875H10.9687V5.28125C10.9687 5.38899 11.0115 5.49233 11.0877 5.56851C11.1639 5.6447 11.2672 5.6875 11.375 5.6875C11.4827 5.6875 11.5861 5.6447 11.6623 5.56851C11.7384 5.49233 11.7812 5.38899 11.7812 5.28125V4.875H12.1875C12.2952 4.875 12.3986 4.8322 12.4748 4.75601C12.5509 4.67983 12.5937 4.57649 12.5937 4.46875C12.5937 4.36101 12.5509 4.25767 12.4748 4.18149C12.3986 4.1053 12.2952 4.0625 12.1875 4.0625Z" fill="#9CA8D5"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_219_5">
                      <rect width="13" height="13" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                このアプローチは他と何が違いますか？（例：薬の副作用を避けられる、高解像度など）
              </li>
              <li className="text-gray-700 text-[14px] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="mr-1.5 flex-shrink-0">
                  <g clipPath="url(#clip0_219_5)">
                    <path d="M10.5625 7.3125C10.5635 7.47814 10.5132 7.64003 10.4184 7.77589C10.3237 7.91175 10.1891 8.01491 10.0333 8.07117L7.41405 9.03906L6.44921 11.6604C6.39207 11.8156 6.2887 11.9496 6.15303 12.0442C6.01737 12.1388 5.85594 12.1896 5.69054 12.1896C5.52513 12.1896 5.36371 12.1388 5.22804 12.0442C5.09238 11.9496 4.989 11.8156 4.93186 11.6604L3.96093 9.03906L1.3396 8.07422C1.18438 8.01708 1.05041 7.91371 0.955787 7.77804C0.861161 7.64238 0.810425 7.48095 0.810425 7.31555C0.810425 7.15014 0.861161 6.98872 0.955787 6.85305C1.05041 6.71739 1.18438 6.61401 1.3396 6.55687L3.96093 5.58594L4.92577 2.96461C4.98291 2.80939 5.08628 2.67542 5.22195 2.5808C5.35761 2.48617 5.51904 2.43544 5.68444 2.43544C5.84985 2.43544 6.01127 2.48617 6.14694 2.5808C6.2826 2.67542 6.38598 2.80939 6.44311 2.96461L7.41405 5.58594L10.0354 6.55078C10.1913 6.60755 10.3257 6.71132 10.4201 6.84776C10.5146 6.9842 10.5643 7.14659 10.5625 7.3125ZM7.71874 2.4375H8.53124V3.25C8.53124 3.35774 8.57404 3.46108 8.65023 3.53726C8.72641 3.61345 8.82974 3.65625 8.93749 3.65625C9.04523 3.65625 9.14856 3.61345 9.22475 3.53726C9.30094 3.46108 9.34374 3.35774 9.34374 3.25V2.4375H10.1562C10.264 2.4375 10.3673 2.3947 10.4435 2.31851C10.5197 2.24233 10.5625 2.13899 10.5625 2.03125C10.5625 1.92351 10.5197 1.82017 10.4435 1.74399C10.3673 1.6678 10.264 1.625 10.1562 1.625H9.34374V0.8125C9.34374 0.704756 9.30094 0.601424 9.22475 0.525238C9.14856 0.449051 9.04523 0.40625 8.93749 0.40625C8.82974 0.40625 8.72641 0.449051 8.65023 0.525238C8.57404 0.601424 8.53124 0.704756 8.53124 0.8125V1.625H7.71874C7.61099 1.625 7.50766 1.6678 7.43148 1.74399C7.35529 1.82017 7.31249 1.92351 7.31249 2.03125C7.31249 2.13899 7.35529 2.24233 7.43148 2.31851C7.50766 2.3947 7.61099 2.4375 7.71874 2.4375ZM12.1875 4.0625H11.7812V3.65625C11.7812 3.54851 11.7384 3.44517 11.6623 3.36899C11.5861 3.2928 11.4827 3.25 11.375 3.25C11.2672 3.25 11.1639 3.2928 11.0877 3.36899C11.0115 3.44517 10.9687 3.54851 10.9687 3.65625V4.0625H10.5625C10.4547 4.0625 10.3514 4.1053 10.2752 4.18149C10.199 4.25767 10.1562 4.36101 10.1562 4.46875C10.1562 4.57649 10.199 4.67983 10.2752 4.75601C10.3514 4.8322 10.4547 4.875 10.5625 4.875H10.9687V5.28125C10.9687 5.38899 11.0115 5.49233 11.0877 5.56851C11.1639 5.6447 11.2672 5.6875 11.375 5.6875C11.4827 5.6875 11.5861 5.6447 11.6623 5.56851C11.7384 5.49233 11.7812 5.38899 11.7812 5.28125V4.875H12.1875C12.2952 4.875 12.3986 4.8322 12.4748 4.75601C12.5509 4.67983 12.5937 4.57649 12.5937 4.46875C12.5937 4.36101 12.5509 4.25767 12.4748 4.18149C12.3986 4.1053 12.2952 4.0625 12.1875 4.0625Z" fill="#9CA8D5"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_219_5">
                      <rect width="13" height="13" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                研究の目的や目標は何ですか？（例：症状の管理、診断の改善）
              </li>
            </ul>
          </div>
        )
      }
    ]);
  };

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
    setHelpButtonClicked(false);
    setSelectedOption("");
  };

  return {
    currentStep,
    inputValue,
    conversationHistory,
    answers,
    selectedOption,
    handleInputChange,
    handleOptionSelect,
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
