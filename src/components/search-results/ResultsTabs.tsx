
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ResultsTabs = () => {
  const [activeTab, setActiveTab] = React.useState("papers");

  return (
    <div className="container mx-auto px-4 mb-12">
      <Tabs defaultValue="papers" className="w-full" onValueChange={setActiveTab}>
        <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10">
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
        </div>
        
        <TabsContent value="papers" className="mt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
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
              
              {/* Add more paper cards to ensure scrolling */}
              <div className="bg-white p-6 border border-gray-200 rounded-md">
                <h3 className="text-lg font-bold mb-1">Adaptive Optics for Free-Space Optical Communications: Performance Analysis</h3>
                <div className="text-gray-600 mb-3">L. Chen, R. Johnson, T. Suzuki • Journal of Optical Communications • 2023</div>
                <div className="flex gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Free-Space</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Communications</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  This study evaluates the performance of adaptive optics systems in free-space optical communication links. The research quantifies improvements in signal quality and link stability under various atmospheric turbulence conditions.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="border-gray-300">PDF</Button>
                  <Button variant="outline" className="border-gray-300">Save</Button>
                </div>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-md">
                <h3 className="text-lg font-bold mb-1">Next-Generation Deformable Mirrors for Exoplanet Imaging Applications</h3>
                <div className="text-gray-600 mb-3">H. Nakamura, S. Peterson, J. Garcia • Astronomy & Astrophysics • 2024</div>
                <div className="flex gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Deformable Mirrors</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Exoplanets</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  This paper presents advances in deformable mirror technology optimized for direct imaging of exoplanets. The new designs feature improved stroke, response time, and actuator density to enable better contrast in high-dynamic range observations.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="border-gray-300">PDF</Button>
                  <Button variant="outline" className="border-gray-300">Save</Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="implementations" className="mt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
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
                
                {/* Add more implementation examples */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">Keck天文台の次世代AOシステム</h4>
                  <p className="text-sm text-gray-600">
                    マウナケア山頂の複数の望遠鏡にわたって展開された高度なレーザーガイドスターシステム。このシステムは、複数のレーザービーコンと大規模な波面センサーアレイを使用して、より広い視野にわたる大気補正を可能にします。
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">SpaceX社の自由空間光通信プロトタイプ</h4>
                  <p className="text-sm text-gray-600">
                    衛星間通信のために設計された実験的な適応光学システム。このプロトタイプは、軌道上でのマイクロ振動と熱の変動に対処するための独自の制御アルゴリズムを特徴としています。
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="researchers" className="mt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
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
                
                {/* Add more researcher profiles */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">エレナ・コワルスキー博士 - ESO</h4>
                  <p className="text-sm text-gray-600">
                    欧州南天文台の先端光学システム部門の主任研究員。彼女の研究は、極限的な光学性能を達成するための多重共役適応光学システムに焦点を当てています。
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">山本 達也 教授 - 京都大学</h4>
                  <p className="text-sm text-gray-600">
                    生物医学的適応光学の先駆者で、深部組織イメージングのための革新的な波面補正技術を開発しています。彼のラボは、神経科学的応用のための複数散乱媒体を通した補正イメージングに特化しています。
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="patents" className="mt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
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
                
                {/* Add more patents */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">EP3521945：予測制御アルゴリズム</h4>
                  <p className="text-sm text-gray-600">
                    天文学的および産業用途のための適応光学システムにおける遅延補償のための機械学習ベースの予測制御アプローチに関する欧州特許。
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">CN108762345：適応光学通信システム</h4>
                  <p className="text-sm text-gray-600">
                    地上と衛星間の高帯域幅光通信リンクのための革新的な適応光学システムに関する中国の特許。この技術は、複数のレーザービームと発展型受信機構成を使用して、大気条件の変化に対する堅牢性を高めます。
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
