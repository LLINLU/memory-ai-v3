
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
      question: "まず、この研究分野に誰が関わっていますか？以下を考慮してください",
      icon: <Users className="h-5 w-5" />,
      subtitle: [
        "実務者や専門家は誰ですか？",
        "最終ユーザーや受益者は誰ですか？"
      ],
      placeholder: "例：天文学者、眼科医、防衛エンジニアなど..."
    },
    {
      question: "わかりました！この分野のどの具体的な側面に興味がありますか？以下を考慮してください",
      icon: <Search className="h-5 w-5" />,
      subtitle: [
        "特定のアプローチ、技術、または応用は何ですか？",
        "目的や目標は何ですか？"
      ],
      placeholder: "例：波面補正、画像安定化、リアルタイム処理など..."
    },
    {
      question: "この研究はどこで通常行われたり、適用されたりしますか？以下を考慮してください",
      icon: <MapPin className="h-5 w-5" />,
      subtitle: [
        "どのような環境や設定で行われますか？",
        "特定の臨床または研究コンテキストはありますか？",
        "地理的または機関的な焦点はありますか？"
      ],
      placeholder: "例：観測所、病院、フィールド作業など..."
    },
    {
      question: "ありがとうございます！最後に、このアプローチはいつ最も関連性や適用性がありますか？以下を考慮してください",
      icon: <Clock className="h-5 w-5" />,
      subtitle: [
        "どのような条件や状況下で関連しますか？",
        "特定の時間枠や段階はありますか？",
        "重要な時間的要因はありますか？"
      ],
      placeholder: "例：現在の応用、将来の開発、5年以内など..."
    }
  ];

  return steps;
};
