
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
      question: "この研究テーマの目的や着目するアプローチは何でしょうか？以下を考慮してください：",
      icon: <Search className="h-5 w-5" />,
      subtitle: [
        "- 着目するアプローチ、技術、または方法論は何ですか？（例：非薬理学的治療、画像技術）",
        "- 研究の目的や目標は何ですか？（例：症状の管理、診断の改善）",
        "- このアプローチは他と何が違いますかか？（例：薬の副作用を避けられる、高解像度など）"
      ],
      placeholder: "例：波面補正、画像安定化、リアルタイム処理など..."
    },
    {
      question: "この研究テーマには誰が関わっていますか？以下を考慮してください：",
      icon: <Users className="h-5 w-5" />,
      subtitle: [
        "- 解決策を実施する実務者や専門家は誰ですか？（例：医療専門家、エンジニア、研究者）",
        "- エンドユーザーや恩恵を受ける人は誰ですか？（例：特定の疾患を持つ患者、学生）",
        "- その他重要な関係者はいますか？（例：機器メーカー、規制機関）"
      ],
      placeholder: "例：天文学者、眼科医、防衛エンジニアなど..."
    },
    {
      question: "とても参考になります。この研究をどんな場面で応用しますか？以下を考慮してください：",
      icon: <MapPin className="h-5 w-5" />,
      subtitle: [
        "- どのような環境や設定で実施されていますか？（例：臨床現場、自宅、観測所）",
        "- 地理的な焦点はありますか？（例：特定の地域、国、機関）",
        "- 文脈的に重要な要素はありますか？（例：資源が限られた環境、専門施設）"
      ],
      placeholder: "例：観測所、病院、フィールド作業など..."
    },
    {
      question: "素晴らしいです。応用する状況や開発段階について何が分かっていますか？以下を考慮してください：",
      icon: <Clock className="h-5 w-5" />,
      subtitle: [
        "- どのような状況や条件下で使用されますか？（例：従来の治療が効かないとき、特定の観測時）",
        "- 時間的な要素はありますか？（例：急性 vs 慢性の管理、リアルタイム vs 事後処理）",
        "- どの開発・導入段階ですか？（例：新興技術、確立された実践）"
      ],
      placeholder: "例：現在の応用、将来の開発、5年以内など..."
    }
  ];

  return steps;
};
