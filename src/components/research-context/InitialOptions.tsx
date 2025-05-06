
import React from "react";
import { Button } from "@/components/ui/button";

interface InitialOptionsProps {
  initialQuery: string;
  onContinue: () => void;
  onSkip: () => void;
}

export const InitialOptions: React.FC<InitialOptionsProps> = ({
  initialQuery,
  onContinue,
  onSkip,
}) => {
  return (
    <div>
      <div className="mb-8">
        <p className="text-lg">
          こんにちは、{initialQuery || "[ユーザーのクエリ]"}に関する研究論文を見つけるお手伝いをします。4Wフレームワークを使用してパーソナライズされた研究マップを作成するお手伝いをします。
        </p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700"
        >
          続ける
        </Button>
        <Button 
          onClick={onSkip}
          variant="outline"
        >
          スキップ
        </Button>
      </div>
    </div>
  );
};
