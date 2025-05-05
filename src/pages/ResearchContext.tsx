
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
      question: "WHO is involved in your research?",
      icon: <Users className="h-5 w-5" />,
      subtitle: [
        "Who are the practitioners or professionals?",
        "Who are the end users or beneficiaries?",
        "Are there other key stakeholders?"
      ],
      placeholder: "E.g., Astronomers, ophthalmologists, defense engineers..."
    },
    {
      question: "WHAT specific aspects of adaptive optics interest you?",
      icon: <Search className="h-5 w-5" />,
      subtitle: [
        "What technologies are you focused on?",
        "What problems are you trying to solve?",
        "What outcomes are you seeking?"
      ],
      placeholder: "E.g., Wavefront correction, image stabilization, real-time processing..."
    },
    {
      question: "WHERE will this research be applied?",
      icon: <MapPin className="h-5 w-5" />,
      subtitle: [
        "In what physical locations or environments?",
        "In which industries or fields?",
        "At what scale (local, national, global)?"
      ],
      placeholder: "E.g., Observatories, hospitals, field operations..."
    },
    {
      question: "WHEN is this research relevant?",
      icon: <Clock className="h-5 w-5" />,
      subtitle: [
        "What is the timeframe for implementation?",
        "Are there historical contexts to consider?",
        "Are there upcoming deadlines or milestones?"
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
    // Skip current question
    handleSubmit();
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
                    <div className="mb-6">
                      <p className="text-lg mb-4">Let's quickly define your research context. These 4 questions help refine your results, but feel free to skip any.</p>
                    </div>
                    
                    {/* Current Step */}
                    <div className="flex items-start gap-4 mb-8">
                      <div className="bg-blue-600 text-white p-2 rounded-full">
                        {steps[currentStep]?.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{steps[currentStep]?.question}</h3>
                        <ul className="mt-2 space-y-1 mb-4">
                          {steps[currentStep]?.subtitle.map((item, i) => (
                            <li key={i} className="text-gray-700">{item}</li>
                          ))}
                        </ul>
                        {/* Moved Skip button here */}
                        <Button 
                          variant="outline"
                          onClick={handleSkip}
                          className="mt-2"
                        >
                          Skip
                        </Button>
                      </div>
                    </div>

                    {/* Conversation history displayed dynamically */}
                    <div className="flex-1 mb-4">
                      {conversationHistory.map((message, index) => (
                        message.type === "user" && (
                          <div key={index} className="mb-6 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                            <p>{message.content}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {!showInitialOptions && (
                <div className="mt-auto">
                  <div className="mb-4">
                    <Textarea
                      placeholder={steps[currentStep]?.placeholder}
                      value={inputValue}
                      onChange={handleInputChange}
                      className="w-full resize-none p-4 border rounded-2xl text-base"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    {/* Removed Skip button from here */}
                    <Button 
                      onClick={handleSubmit}
                      className="bg-blue-600 hover:bg-blue-700"
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
