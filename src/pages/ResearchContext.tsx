
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [initialQuery, setInitialQuery] = useState("");
  const [showInitialOptions, setShowInitialOptions] = useState(true);
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

  const handleInputChange = (value: string) => {
    const newAnswers = { ...answers };
    const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
    newAnswers[currentKey] = value;
    setAnswers(newAnswers);
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      proceedToTechnologyTree();
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      proceedToTechnologyTree();
    }
  };

  const handleQuickResults = () => {
    if (!initialQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Enter a brief description of your research interest.",
        variant: "destructive"
      });
      return;
    }
    navigate('/technology-tree', { state: { query: initialQuery, quickSearch: true } });
  };

  const handlePersonalizedSearch = () => {
    if (!initialQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Enter a brief description of your research interest.",
        variant: "destructive"
      });
      return;
    }
    setShowInitialOptions(false);
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

  const currentStepData = steps[currentStep];
  const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
  const currentAnswer = answers[currentKey];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50">
          <div className="container py-8 px-4 mx-auto max-w-5xl">
            {showInitialOptions ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h1 className="text-4xl font-bold text-center mb-6">Welcome to Memory AI</h1>
                <p className="text-lg text-gray-600 text-center mb-10">
                  I'll help you define your research scenario using the 4W framework to build a personalized research map.
                </p>
                
                <div className="w-full mb-8">
                  <Input
                    type="text"
                    placeholder="Enter your research interest (e.g., adaptive optics in astronomy)"
                    className="w-full h-16 pl-6 pr-14 text-lg rounded-2xl border border-gray-200"
                    value={initialQuery}
                    onChange={(e) => setInitialQuery(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl mb-8">
                  <p className="text-lg text-blue-800 mb-4">
                    Hi, I can help you find research papers regarding {initialQuery || '[your research interest]'}. 
                    Would you like quick results now or a more personalized search based on your specific interests?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleQuickResults}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg"
                      disabled={!initialQuery.trim()}
                    >
                      Quick Results
                    </Button>
                    <Button 
                      onClick={handlePersonalizedSearch}
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-8 py-6 h-auto text-lg"
                      disabled={!initialQuery.trim()}
                    >
                      Personalized Search
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Research Context Builder</h2>
                  <span className="text-gray-500">Step {currentStep + 1} of 4</span>
                </div>

                <p className="text-gray-600 mb-8">
                  Let's quickly define your research context. These 4 questions help refine your results, but feel free to skip any.
                </p>
                
                <div className="bg-blue-50 p-6 rounded-2xl mb-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-blue-600 text-white p-2 rounded-full mt-1">
                      {currentStepData.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">{currentStepData.question}</h3>
                      <ul className="mt-2 space-y-1">
                        {currentStepData.subtitle.map((item, i) => (
                          <li key={i} className="text-blue-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Textarea 
                    placeholder={currentStepData.placeholder}
                    className="w-full p-4 border border-blue-200 rounded-xl bg-white"
                    value={currentAnswer}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={handleSkip}
                  >
                    Skip
                  </Button>
                  <Button 
                    onClick={handleNext}
                  >
                    {currentStep < steps.length - 1 ? 'Next' : 'View Results'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResearchContext;
