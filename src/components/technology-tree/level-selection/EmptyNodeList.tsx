
import React from 'react';

interface EmptyNodeListProps {
  levelTitle: string;
}

export const EmptyNodeList: React.FC<EmptyNodeListProps> = ({ levelTitle }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      {levelTitle === "Level 2" ? "レベル1からドメインを選択してください" : "レベル2からサブドメインを選択してください"}
    </div>
  );
};
