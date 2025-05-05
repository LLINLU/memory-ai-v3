import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Step } from "@/components/research-context/ResearchSteps";

interface ContextAnswers {
  who: string;
  what: string;
  where: string;
  when: string;
}

export const useResearchContext = (initialQuery: string, steps: Step[]) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  
  // Track current conversation state
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: "system" | "user";
    content: React.ReactNode | string;
    questionType?: string;
  }>>([]);
  
  const [answers, setAnswers] = useState<ContextAnswers>({
    who: "",
    what: "",
    where: "",
    when: ""
  });

  const handleInitialOption = (option: 'continue' | 'skip') => {
    if (!initialQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Enter a brief description of your research interest.",
        variant: "destructive"
      });
      return;
    }
    
    if (option === 'skip') {
      navigate('/technology-tree', { state: { query: initialQuery, quickSearch: true } });
    } else {
      setShowInitialOptions(false);
      
      // Add system greeting as first message
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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (currentStep >= steps.length) return;
    
    const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
    
    // Add user's answer to conversation
    if (inputValue.trim()) {
      // Update answers state
      const newAnswers = { ...answers };
      newAnswers[currentKey] = inputValue;
      setAnswers(newAnswers);
      
      // Add user response to conversation history
      setConversationHistory(prev => [
        ...prev,
        { type: "user", content: inputValue }
      ]);
    }
    
    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Clear input field
    setInputValue("");
    
    // If there are more steps, add the next question
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
    } else {
      // All steps completed, show completion message
      setTimeout(() => {
        setConversationHistory(prev => [
          ...prev,
          { 
            type: "system", 
            content: "Thank you for providing these details. I'll now build your personalized research map."
          }
        ]);
        
        // Wait a moment before navigating to give user time to read the completion message
        setTimeout(() => {
          proceedToTechnologyTree();
        }, 1500);
      }, 300);
    }
  };
  
  const handleSkip = () => {
    // Skip current question but still add it to the conversation history
    
    // Add skip message to conversation
    setConversationHistory(prev => [
      ...prev,
      { type: "user", content: "Skipped" }
    ]);
    
    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Clear input field
    setInputValue("");
    
    // If there are more steps, add the next question
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
    } else {
      // All steps completed, show completion message
      setTimeout(() => {
        setConversationHistory(prev => [
          ...prev,
          { 
            type: "system", 
            content: "Thank you for providing these details. I'll now build your personalized research map."
          }
        ]);
        
        // Wait a moment before navigating to give user time to read the completion message
        setTimeout(() => {
          proceedToTechnologyTree();
        }, 1500);
      }, 300);
    }
  };

  const proceedToTechnologyTree = () => {
    // Filter out empty answers
    const filledAnswers = Object.fromEntries(
      Object.entries(answers).filter(([_, value]) => value.trim() !== '')
    );
    
    // Create scenario from answers
    let scenario = initialQuery;
    
    // If we have additional context from the 4W questions, add it to the scenario
    if (Object.keys(filledAnswers).length > 0) {
      scenario = `${initialQuery} with focus on ` + 
        Object.entries(filledAnswers)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
    }
    
    // Store conversation history in localStorage before navigating
    localStorage.setItem('researchContextHistory', JSON.stringify(conversationHistory));
    
    navigate('/technology-tree', { 
      state: { 
        query: initialQuery,
        scenario,
        contextAnswers: answers 
      } 
    });
  };

  return {
    showInitialOptions,
    currentStep,
    inputValue,
    conversationHistory,
    handleInitialOption,
    handleInputChange,
    handleSubmit,
    handleSkip,
    steps,
  };
};
