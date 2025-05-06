
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
      question: "この研究分野には\"誰\"が関わっていますか？ 以下を考えてみてください：",
      icon: <Users className="h-5 w-5" />,
      subtitle: [
        "- 解決策を実装する専門家や実務者は誰ですか？",
        "- 最終的な利用者や恩恵を受ける人は誰ですか？",
        "- 他に重要な関係者はいますか？"
      ],
      placeholder: "例：天文学者、眼科医、防衛エンジニアなど..."
    },
    {
      question: "わかりました！\"何\"が研究または実施されていますか？ 以下を考慮してください：",
      icon: <Search className="h-5 w-5" />,
      subtitle: [
        "- 主なアプローチ、技術、または方法論は何ですか？",
        "- その目的や目標は？",
        "- このアプローチは他と何が違うのですか？"
      ],
      placeholder: "例：波面補正、画像安定化、リアルタイム処理など..."
    },
    {
      question: "とても参考になります。\"どこ\"でこの研究や応用は行われますか？ 以下を考慮してください：",
      icon: <MapPin className="h-5 w-5" />,
      subtitle: [
        "- どのような環境や設定で実施されていますか？",
        "- 地理的な焦点はありますか？",
        "- 他に重要な文脈要素はありますか？"
      ],
      placeholder: "例：観測所、病院、フィールド作業など..."
    },
    {
      question: "素晴らしいです。\"いつ\"このアプローチは関連性がありますか？ 以下を考慮してください：",
      icon: <Clock className="h-5 w-5" />,
      subtitle: [
        "- どのような条件や状況下で使用されますか？",
        "- 時間的な側面はありますか？",
        "- どの段階の技術または実装ですか？"
      ],
      placeholder: "例：現在の応用、将来の開発、5年以内など..."
    }
  ];

  return steps;
};
