
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
        <p className="text-base leading-6">
          喜んでお手伝いします✨。{initialQuery || "[ユーザーのクエリ]"}に関する研究を見つけるために、あなたの具体的な研究背景を理解することで、より関連性の高い論文をご紹介できます。4Wフレームワークに基づく質問にお答えいただくか、一般的な検索結果へ直接進むことも可能です。
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
