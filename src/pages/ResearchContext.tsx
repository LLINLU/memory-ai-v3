
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users, Search, MapPin, Clock, ArrowRight } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";

interface Step {
  question: string;
  icon: JSX.Element;
  subtitle: string[];
  placeholder: string;
}

const ResearchContext = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  
  // Get the query from location state (passed from homepage)
  const locationState = location.state as { query?: string } || {};
  const initialQuery = locationState.query || "";
  
  // Track current conversation state
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: "system" | "user";
    content: React.ReactNode | string;
    questionType?: string;
  }>>([]);
  
  const [answers, setAnswers] = useState({
    who: "",
    what: "",
    where: "",
    when: ""
  });

  const steps: Step[] = [
    {
      question: "First, WHO is involved in this research area? You can consider",
      icon: <Users className="h-5 w-5" />,
      subtitle: [
        "Who are the practitioners or professionals?",
        "Who are the end users or beneficiaries?"
      ],
      placeholder: "E.g., Astronomers, ophthalmologists, defense engineers..."
    },
    {
      question: "Go it! WHAT specific aspects of this field are you interested in? You can consider",
      icon: <Search className="h-5 w-5" />,
      subtitle: [
        "What particular approach, technique, or application?",
        "What is the purpose or objective?"
      ],
      placeholder: "E.g., Wavefront correction, image stabilization, real-time processing..."
    },
    {
      question: "Now, WHERE is this research typically conducted or applied? You can consider",
      icon: <MapPin className="h-5 w-5" />,
      subtitle: [
        "In what settings or environments?",
        "Are there specific clinical or research contexts?",
        "Is there a geographical or institutional focus?"
      ],
      placeholder: "E.g., Observatories, hospitals, field operations..."
    },
    {
      question: "Thank you! Finally, WHEN is this approach most relevant or applicable? You can consider",
      icon: <Clock className="h-5 w-5" />,
      subtitle: [
        "Under what conditions or circumstances?",
        "Is there a specific time frame or stage?",
        "Are there temporal factors that matter?"
      ],
      placeholder: "E.g., Current applications, future developments, within 5 years..."
    }
  ];

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
    const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
    
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
    
    navigate('/technology-tree', { 
      state: { 
        query: initialQuery,
        scenario,
        contextAnswers: answers 
      } 
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 flex flex-col">
          <div className="container py-8 px-4 mx-auto max-w-5xl flex-1 flex flex-col">
            <div className="bg-white p-8 rounded-3xl shadow-sm flex-1 flex flex-col">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-8">Research Context Builder</h1>
                
                {showInitialOptions ? (
                  <div>
                    <div className="mb-8">
                      <p className="text-lg">
                        Hi, I can help you find research papers regarding {initialQuery || "[user's query]"}. I'll help you define your research scenario using 
                        the 4W framework to build a personalized research map.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleInitialOption('continue')}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!initialQuery.trim()}
                      >
                        Continue
                      </Button>
                      <Button 
                        onClick={() => handleInitialOption('skip')}
                        variant="outline"
                        disabled={!initialQuery.trim()}
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto mb-4">
                      {/* Display the full conversation history */}
                      {conversationHistory.map((message, index) => (
                        <div key={index} className={`mb-6 ${message.type === "user" ? "flex justify-end" : ""}`}>
                          {message.type === "system" ? (
                            <div>{message.content}</div>
                          ) : (
                            <div className="bg-blue-100 text-blue-900 p-3 rounded-lg max-w-[85%]">
                              <p>{message.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {currentStep < steps.length && (
                      <div className="mt-2">
                        <Button 
                          variant="outline"
                          onClick={handleSkip}
                          className="mb-4"
                        >
                          Skip
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {!showInitialOptions && currentStep < steps.length && (
                <div className="mt-auto">
                  <div className="relative mb-4">
                    <Textarea
                      placeholder={steps[currentStep]?.placeholder}
                      value={inputValue}
                      onChange={handleInputChange}
                      className="w-full resize-none p-4 pr-16 border rounded-2xl text-base"
                      rows={3}
                    />
                    <Button 
                      onClick={handleSubmit}
                      className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                      <span>Next</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResearchContext;
