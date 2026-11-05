# Three.jsヒーロー — 線の対話

実装日: 2026-11-04（日本時間）

## デザイン

ユーザーが質問後に「一旦実装してみてください」と依頼したため、第一候補の「線の対話」を実装。

青みの白 `#F4F8FA` の空間に、青みの黒 `#081824` の短い線を浮かべる。線は特定の言語を書かず、文章のようなまとまりをつくる。7つのまとまりが異なる角度で重なり、時間とともにゆっくり向きを整える。地球・球体・地図・国旗・帯・建築フレームは使わない。

ヒーロー全体にcanvasを敷き、コピー周辺、ヘッダー、フッターの線はシェーダーで薄くして可読性を確保する設計。本文とボタンは引き続きHTML。

## 動きと操作

- PCのマウス移動に、立体の角度が小さく追従する。
- スクロールに応じて線のまとまりが少しずつ同じ方向へ整う。
- 「動きを止める／動きを再生する」ボタンを追加。
- 動きを減らす設定では静止した3Dを描画し、マウス反応と連続描画を止める。
- メニュー表示中、ヒーローが画面外にある間、タブ非表示中は描画を休止する。

## 実装

- `three` と `@types/three` をnpmで追加。
- `src/scripts/line-dialogue.ts`: Three.jsを動的importし、BufferGeometry・LineSegments・ShaderMaterialで線のまとまりを描画する。
- 描画は既存のGSAP tickerを共用し、別のrequestAnimationFrameループを作らない。
- スマートフォンでは各まとまりの行数を64行から32行へ、表示数を7から5へ変更。描画は最大30fps相当、ピクセル比は最大1.25に制限する。
- 大きい画面は最大60fps相当、ピクセル比は最大1.75。画面比率に応じて縮尺・位置・カメラのアスペクト比を調整。
- `public/hero-lines-fallback.svg`: コードで作成した静止ベクター背景。3Dの起動前、JavaScript無効時、WebGL非対応・コンテキスト喪失時に表示。
- リサイズ、画面の可視状態、メニュー状態、動きの設定変更に対応。破棄時にイベント・ticker・GPUリソースを解放する。
- 既存の画像背景を平行移動するGSAP視差は外し、Three.js側でスクロール反応を担当。
- フッターの文字は、明るい背景に合わせて青みの黒へ変更。

以前のAI画像は履歴として保存したまま、ヒーローの参照から外している。

## 実装後の確認

ユーザーの前回の指示を引き継ぎ、ビルド・型チェック・ブラウザー確認・テストは実施していない。上記は実装した制御であり、各実機での描画性能や表示の検証結果ではない。

参照資料:

- [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)
- [Three.js LineSegments](https://threejs.org/docs/pages/LineSegments.html)
- [Three.js ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html)
- [Astro Components](https://docs.astro.build/en/basics/astro-components/)
- [Astro Styles and CSS](https://docs.astro.build/en/guides/styling/)
