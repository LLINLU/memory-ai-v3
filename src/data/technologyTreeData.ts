
export const level1Items = [
  { id: "astronomy", name: "天文観測の改善", info: "42論文 • 15事例", description: "天文観測のために、地球の乱流大気を通して視界を強化し、回折限界に近い解像度を達成する。" },
  { id: "biomedical", name: "生体医学イメージングの進歩", info: "38論文 • 14事例", description: "細胞レベルでの解像度と明瞭さを向上させるため、医療および生物学的イメージングに適応光学を応用する。" },
  { id: "defense", name: "防衛と監視の支援", info: "35論文 • 12事例", description: "大気を通した強化されたイメージング、ターゲティング、およびレーザー伝播のために防衛アプリケーションで適応光学を使用する。" }
];

export const level2Items = {
  "astronomy": [
    { id: "turbulence-compensation", name: "大気乱流補正", info: "18論文 • 6事例", description: "より明確な天文イメージングを達成するために、大気乱流によって引き起こされる光学的歪みを補正するための技術。" },
    { id: "wavefront-reconstruction", name: "波面再構成", info: "14論文 • 5事例", description: "大気乱流によって歪められた光の波面を分析し数学的に再構成する方法。" },
    { id: "wavefront-correction", name: "波面補正", info: "16論文 • 4事例", description: "大気の歪みを補正するために光波を物理的に操作する技術。" }
  ],
  "biomedical": [
    { id: "high-resolution-microscopy", name: "高解像度顕微鏡法／網膜イメージング", info: "20論文 • 7事例", description: "医学診断のための細胞レベルの解像度を達成するために適応光学を顕微鏡法と網膜イメージングに応用すること。" },
    { id: "depth-correction", name: "OCTにおける深度補正", info: "12論文 • 4事例", description: "深度依存の収差を補正することによって光コヒーレンストモグラフィーを改善する方法。" },
    { id: "live-imaging", name: "ライブイメージングフィードバック", info: "14論文 • 3事例", description: "医学応用における生体組織の生体内イメージングのためのリアルタイム適応補正を提供するシステム。" }
  ],
  "defense": [
    { id: "image-stabilization", name: "画像安定化とターゲット追跡", info: "16論文 • 5事例", description: "大気の乱れを通して移動するターゲットの安定したイメージングを維持するための技術。" },
    { id: "beam-propagation", name: "ビーム伝播のための大気補正", info: "13論文 • 4事例", description: "長距離伝播のための大気効果に対抗するためにレーザービームを事前補正するシステム。" },
    { id: "precision-guidance", name: "精密誘導システム", info: "14論文 • 3事例", description: "精度と性能を向上させるために誘導システムと統合された適応光学技術。" }
  ]
};

export const level3Items = {
  "turbulence-compensation": [
    { id: "laser-guide-star", name: "レーザーガイドスターシステム", info: "10論文 • 3事例", description: "ナトリウム層技術とレイリー技術を含む適応光学システムのための大気歪みを測定するためにレーザーを使用して作成された人工参照星。" },
    { id: "shack-hartmann-astronomy", name: "シャック・ハルトマンセンサー", info: "8論文 • 3事例", description: "レンズレットアレイとカメラセンサーを使用して波面の歪みを測定する光学装置で、天文学的適応光学でよく使用される。" }
  ],
  "wavefront-reconstruction": [
    { id: "matrix-vector", name: "行列ベクトル処理", info: "7論文 • 2事例", description: "波面センサーデータを効率的に処理し、補正コマンドを計算するための行列演算を用いた計算方法。" },
    { id: "modal-decomposition", name: "モード分解アルゴリズム", info: "7論文 • 3事例", description: "より効率的な補正のために複雑な波面収差をより単純な成分（モード）に分解する数学的技術。" }
  ],
  "wavefront-correction": [
    { id: "deformable-mirrors-astronomy", name: "可変形ミラー", info: "9論文 • 2事例", description: "天文観測における波面収差を補正するために形状を急速に変化させることができる大型アクチュエータを備えた高精度ミラー。" },
    { id: "tip-tilt-astronomy", name: "チップ・チルトミラー", info: "7論文 • 2事例", description: "画像位置を安定させるために最大の大気収差（チップとチルト）を補正する高速ステアリングミラー。" }
  ],
  "high-resolution-microscopy": [
    { id: "wavefront-sensors-bio", name: "波面センサー", info: "11論文 • 4事例", description: "シャック・ハルトマンセンシングと曲率センシングアプローチを含む、生物医学イメージングにおいて波面歪みを測定するために使用される光学装置。" },
    { id: "deformable-mirrors-bio", name: "可変形ミラー", info: "9論文 • 3事例", description: "高解像度細胞イメージングを可能にするために生物学的組織の光学収差を補正する適応型ミラー。" }
  ],
  "depth-correction": [
    { id: "ao-oct", name: "適応光学OCTモジュール", info: "6論文 • 2事例", description: "組織内のイメージング深度と解像度を向上させるために適応光学と光コヒーレンストモグラフィーを統合した特殊モジュール。" },
    { id: "fpga-controllers", name: "低レイテンシーFPGAコントローラー", info: "6論文 • 2事例", description: "リアルタイム補正のための波面センシングデータの高速、低レイテンシー処理用に設計されたフィールドプログラマブルゲートアレイシステム。" }
  ],
  "live-imaging": [
    { id: "real-time-imaging", name: "リアルタイムイメージングシステム", info: "8論文 • 2事例", description: "医療診断および処置中の生体組織イメージング中に継続的な適応補正を提供する統合システム。" },
    { id: "control-algorithms", name: "制御アルゴリズム", info: "6論文 • 1事例", description: "生物医学応用のための適応光学システムの性能を最適化する特殊ソフトウェアアルゴリズム。" }
  ],
  "image-stabilization": [
    { id: "tip-tilt-defense", name: "チップ・チルトミラー", info: "9論文 • 3事例", description: "プラットフォームの動きと大気効果を迅速に補償するために防衛システムで使用される高速ステアリングミラー。" },
    { id: "real-time-sensors", name: "リアルタイムセンサーとコントローラー", info: "7論文 • 2事例", description: "大気乱流を通して移動するターゲットを追跡するために最適化された高速センシングおよび制御システム。" }
  ],
  "beam-propagation": [
    { id: "deformable-mirrors-defense", name: "可変形ミラー", info: "7論文 • 2事例", description: "長距離ターゲティングと通信における大気歪みを補償するためにレーザービームを事前に形成する先進的なミラーシステム。" },
    { id: "shack-hartmann-defense", name: "シャック・ハルトマンセンサー", info: "6論文 • 2事例", description: "ビーム伝播補正のための大気歪みを測定するために防衛応用に適応された波面センサー。" }
  ],
  "precision-guidance": [
    { id: "adaptive-tracking", name: "適応型レーザー追跡", info: "8論文 • 2事例", description: "大気乱流を通してターゲットへのロックを維持するために適応光学を使用する先進的な追跡システム。" },
    { id: "real-time-control", name: "リアルタイム制御アルゴリズム", info: "6論文 • 1事例", description: "適応光学を備えた誘導システムにおける高速の意思決定のために最適化された特殊アルゴリズム。" }
  ]
};
