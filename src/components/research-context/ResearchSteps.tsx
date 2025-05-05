
import React from "react";
import { Users, Search, MapPin, Clock } from "lucide-react";

export interface Step {
  question: string;
  icon: JSX.Element;
  subtitle: string[];
  placeholder: string;
}

export const useResearchSteps = () => {
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

  return steps;
};
