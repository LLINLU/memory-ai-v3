
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";

export const ResultsTabs = () => {
  const [activeTab, setActiveTab] = React.useState("papers");

  return (
    <div className="container mx-auto px-4 mb-12">
      <Tabs defaultValue="papers" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="inline-flex mb-6">
          <TabsTrigger value="papers" className={`${activeTab === "papers" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            論文
          </TabsTrigger>
          <TabsTrigger value="implementations" className={`${activeTab === "implementations" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            事例
          </TabsTrigger>
          <TabsTrigger value="researchers" className={`${activeTab === "researchers" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            Researchers
          </TabsTrigger>
          <TabsTrigger value="patents" className={`${activeTab === "patents" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            Patents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="papers" className="mt-0">
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h3 className="text-lg font-bold mb-1">高解像度適応光学走査レーザー検眼鏡による糖尿病網膜症の細胞レベル評価</h3>
              <h4 className="text-base mb-2">(Cellular-level Assessment of Diabetic Retinopathy Using High-resolution AO-SLO)</h4>
              <div className="text-gray-600 mb-3">田中 健太, 佐藤 明子, 山田 雄一 • 日本眼科学会誌 • 2024</div>
              <div className="flex gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">AO-SLO</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">糖尿病網膜症</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This study investigates the application of adaptive optics scanning laser ophthalmoscopy (AO-SLO) for early detection of cellular changes in diabetic retinopathy. The research demonstrates improved visualization of retinal microvasculature and photoreceptor abnormalities before clinical symptoms appear.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-gray-300">PDF</Button>
                <Button variant="outline" className="border-gray-300">Save</Button>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h3 className="text-lg font-bold mb-1">Multi-Modal Adaptive Optics Imaging Combined with OCT for Enhanced Retinal Diagnostics</h3>
              <div className="text-gray-600 mb-3">J. Zhang, M. Williams, K. Yamada • American Journal of Ophthalmology • 2023</div>
              <div className="flex gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">AO-OCT</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Multi-Modal</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This paper presents a novel approach combining adaptive optics with optical coherence tomography for comprehensive retinal imaging. The multi-modal system achieves unprecedented resolution for in vivo assessment of retinal layers, offering new insights into pathophysiology of macular degeneration.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-gray-300">PDF</Button>
                <Button variant="outline" className="border-gray-300">Save</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="implementations" className="mt-0">
          <div className="bg-white p-6 border border-gray-200 rounded-md">
            <h3 className="text-xl font-bold mb-4">事例の例</h3>
            <p className="text-gray-600 mb-4">事例データがここに表示されます。</p>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">OptiVision社による商用AO-SLOシステム</h4>
                <p className="text-sm text-gray-600">
                  臨床眼科アプリケーション向けの市販の適応光学システム。細胞レベルの網膜評価のためのリアルタイム波面センシングと高速画像取得機能を備えています。
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">東京医科大学の研究グレードAOプラットフォーム</h4>
                <p className="text-sm text-gray-600">
                  高度な研究アプリケーション向けに複数のイメージングモダリティを統合したカスタムビルドの適応光学システム。このプラットフォームにより、蛍光イメージングと構造評価を同時に行うことが可能です。
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="researchers" className="mt-0">
          <div className="bg-white p-6 border border-gray-200 rounded-md">
            <h3 className="text-xl font-bold mb-4">主要研究者</h3>
            <p className="text-gray-600 mb-4">研究者のプロフィールがここに表示されます。</p>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">鈴木 恵子 博士 - 東京大学</h4>
                <p className="text-sm text-gray-600">
                  眼科イメージングのための適応光学アプリケーションの第一線の研究者で、45以上の出版物があります。網膜視覚化の向上のための新しい波面センシング技術の先駆者。
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">マイケル・チェン教授 - スタンフォード大学</h4>
                <p className="text-sm text-gray-600">
                  適応光学イメージングを強化するための計算アプローチに焦点を当てる主任研究者。彼の研究は、早期疾患検出のための光学工学と臨床応用を橋渡ししています。
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="patents" className="mt-0">
          <div className="bg-white p-6 border border-gray-200 rounded-md">
            <h3 className="text-xl font-bold mb-4">関連特許</h3>
            <p className="text-gray-600 mb-4">特許情報がここに表示されます。</p>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">JP2023-178456：先進的波面補正システム</h4>
                <p className="text-sm text-gray-600">
                  眼科イメージングシステムにおける高次収差の補正を向上させるための、拡張されたストロークと空間解像度を持つ新しい可変形ミラー技術に関する特許。
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">US10,892,345：網膜イメージングのためのマルチコンジュゲート適応光学</h4>
                <p className="text-sm text-gray-600">
                  目の中の異なる深さで収差を補正するために複数の可変形ミラーを使用する特許取得済みのアプローチで、網膜層全体を通じて一貫した品質の体積画像を可能にします。
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
