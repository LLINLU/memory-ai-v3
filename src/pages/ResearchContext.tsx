import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users, Search, MapPin, Clock } from "lucide-react";
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

  // Initial welcome message for the chat
  const initialWelcomeMessage = (
    <div className="bg-blue-50 p-6 rounded-2xl mb-8">
      <p className="text-lg text-blue-800 mb-4">
        Hi, I can help you find research papers regarding {initialQuery || '[your research interest]'}. 
        Would you like quick results now or a more personalized search based on your specific interests?
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => handleInitialOption('quick')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg"
          disabled={!initialQuery.trim()}
        >
          Quick Results
        </Button>
        <Button 
          onClick={() => handleInitialOption('personalized')}
          className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-8 py-6 h-auto text-lg"
          disabled={!initialQuery.trim()}
        >
          Personalized Search
        </Button>
      </div>
    </div>
  );
  
  // Add initial welcome message if conversation is empty
  if (conversationHistory.length === 0) {
    setConversationHistory([{ 
      type: "system", 
      content: initialWelcomeMessage 
    }]);
  }

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
      question: "Now, WHERE is this research typically conducted or applied?",
      icon: <MapPin className="h-5 w-5" />,
      subtitle: [
        "In what settings or environments?",
        "Are there specific clinical or research contexts?",
        "Is there a geographical or institutional focus?"
      ],
      placeholder: "E.g., Observatories, hospitals, field operations..."
    },
    {
      question: "Got it. Thanks for explaining where this research takes place. Finally, WHEN is this approach most relevant or applicable? You can consider",
      icon: <Clock className="h-5 w-5" />,
      subtitle: [
        "Under what conditions or circumstances?",
        "Is there a specific time frame or stage?",
        "Are there temporal factors that matter?"
      ],
      placeholder: "E.g., During specific procedures, in emergency situations, seasonal conditions..."
    }
  ];

  const handleInitialOption = (option: 'quick' | 'personalized') => {
    if (!initialQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Enter a brief description of your research interest.",
        variant: "destructive"
      });
      return;
    }
    
    if (option === 'quick') {
      navigate('/technology-tree', { state: { query: initialQuery, quickSearch: true } });
    } else {
      // Replace the welcome message with the first question
      const initialMessage = (
        <div>
          <p className="mb-3">Let's quickly define your research context. These 4 questions help refine your results, but feel free to skip any.</p>
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white p-2 rounded-full">
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
          <div className="mt-4">
            <Button 
              variant="outline"
              onClick={handleSkip}
            >
              Skip
            </Button>
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
            <div className="bg-blue-600 text-white p-2 rounded-full">
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
          <div className="mt-4">
            <Button 
              variant="outline"
              onClick={handleSkip}
            >
              Skip
            </Button>
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
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Research Context Builder</h2>
              </div>

              {/* Conversation history */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-6">
                {conversationHistory.map((message, index) => (
                  <div 
                    key={index} 
                    className={`${
                      message.type === "user" 
                        ? "bg-blue-50 border-l-4 border-blue-500 pl-4" 
                        : "bg-white"
                    } p-4 rounded-lg`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
              
              {/* Input area - only show if we've moved beyond the welcome screen */}
              {conversationHistory.length > 0 && 
               !conversationHistory[0].content.toString().includes("quick results now") && (
                <div className="mt-auto border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      className="flex-1 p-3 border rounded-lg resize-none"
                      placeholder={currentStep < steps.length ? steps[currentStep].placeholder : ""}
                      value={inputValue}
                      onChange={handleInputChange}
                      rows={2}
                      disabled={currentStep >= steps.length}
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button 
                      onClick={handleSubmit}
                      disabled={currentStep >= steps.length}
                    >
                      {currentStep < steps.length - 1 ? 'Next' : 'View Results'}
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
