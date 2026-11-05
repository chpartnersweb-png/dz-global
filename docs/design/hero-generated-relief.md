# 生成画像版ヒーロー — White Relief

更新日: 2026-11-04（日本時間）

ユーザーの「やはり画像を生成し、使用するようにしてください」に対応。組み込みimage_genツールで4構図を新規生成し、Three.js背景から画像表示へ変更した。

## デザインと保存先

青みの白 `#F4F8FA` と青みの黒 `#081824` を基本とする、白い曲面と素材の質感の画像。実際の会社施設やサービス風景を示すものではない。

| 用途 | 保存先 |
| --- | --- |
| PC | `src/assets/images/hero-relief-desktop-v1.png` |
| タブレット縦 | `src/assets/images/hero-relief-tablet-portrait-v1.png` |
| タブレット横・コンパクト横画面 | `src/assets/images/hero-relief-tablet-landscape-v1.png` |
| スマートフォン縦 | `src/assets/images/hero-relief-mobile-v1.png` |

## 組み込み

- Hero.astroのcanvas、Three.jsの初期化スクリプト、背景の停止ボタンを外し、pictureによる画像表示に変更。
- 幅767px以下かつ縦向きはスマートフォン用、その他の縦向きはタブレット縦用、幅1199px以下の横向きはタブレット横用、それ以外はPC用を選択する。
- 各画像はAstroのgetImageでWebP/srcsetを構成。object-fit: coverでヒーロー全体を覆う。
- 背景を覆う白いグラデーションは使わず、画像内の明るい部分へ既存のHTMLコピーを重ねる。
- GSAPの短い登場演出とLenisは継続。
- 過去のThree.jsスクリプト・SVG・画像は履歴として残しているが、現在のヒーローからは読み込まない。Three.jsの依存は残したまま、表示時の初期化を停止している。

ユーザーの指示を引き継ぎ、変更後のビルド・ブラウザー確認・テストは未実施。

## 使用した生成プロンプト

### PC

```text
Use case: stylized-concept.
Asset type: finished full-bleed corporate website hero background, photographically rendered abstract material artwork.
Primary request: a refined "White Relief" visual. One continuous enormous matte blue-white surface has three broad sculpted folds and shallow raised planes. Their soft rounded transitions and precise narrow crevices form a quiet sculptural landscape; edges continue beyond the image. A few restrained deep blue-black recesses give definition. This is an abstract brand image about openness and connection, not real premises.
Style: high-end still-life editorial photography, carefully art-directed minimal material study, soft daylight from upper-left, extremely fine plaster or uncoated porcelain texture, physically convincing soft shadows. Calm, confident, tactile and spacious.
Palette: ONLY near-white with a subtle blue tint #F4F8FA and nearly-black with a subtle blue tint #081824, with tonal blends of the same two colors for shadows. Overall reads near monochrome. No saturated blue, no other hue, no chrome or rainbow.
Composition: completely edge-to-edge image with material, depth and lighting spanning the whole canvas, not an inset image or a top image with a separate empty block. Keep uppermost 12 percent pale for dark header text, and bottommost 10 percent pale for small dark footer text. Black Japanese copy will be placed over the lower-left, so keep that region bright and low-contrast while preserving subtle integrated surface texture. Dark recesses are concentrated in upper-right or far-right middle, not behind text. Three broad folds only, generous scale, no repetitive pinstripes or crowded contours.
Avoid: text, logo, typography, watermark, UI, globe, Earth, map, flags, people, architecture, portals, rectangular frames, crossing ribbon bands, waves of thin lines, point clouds, liquid blobs, spheres, concentric closed rings, infinity symbols, neon and futuristic networks. No added gradient overlay or separate white copy panel.
Device-specific composition: Wide landscape 16:9 for desktop. Relief rises diagonally from center toward upper-right. A broad pale foreground plane sweeps gently from lower-left toward the far-right, with two shallow folds behind it. Only a narrow deep ink recess around x=82%,y=35% creates contrast. Keep x=3..61%,y=47..88% bright and quiet for the existing two-line Japanese title and paragraph. Material fills all edges, expansive editorial composition.
```

### タブレット縦

```text
Use case: stylized-concept.
Asset type: finished full-bleed corporate website hero background, photographically rendered abstract material artwork.
Primary request: a refined "White Relief" visual. One continuous enormous matte blue-white surface has three broad sculpted folds and shallow raised planes. Their soft rounded transitions and precise narrow crevices form a quiet sculptural landscape; edges continue beyond the image. A few restrained deep blue-black recesses give definition. This is an abstract brand image about openness and connection, not real premises.
Style: high-end still-life editorial photography, carefully art-directed minimal material study, soft daylight from upper-left, extremely fine plaster or uncoated porcelain texture, physically convincing soft shadows. Calm, confident, tactile and spacious.
Palette: ONLY near-white with a subtle blue tint #F4F8FA and nearly-black with a subtle blue tint #081824, with tonal blends of the same two colors for shadows. Overall reads near monochrome. No saturated blue, no other hue, no chrome or rainbow.
Composition: completely edge-to-edge image with material, depth and lighting spanning the whole canvas, not an inset image or a top image with a separate empty block. Keep uppermost 12 percent pale for dark header text, and bottommost 10 percent pale for small dark footer text. Black Japanese copy will be placed over the lower-left, so keep that region bright and low-contrast while preserving subtle integrated surface texture. Dark recesses are concentrated in upper-right or far-right middle, not behind text. Three broad folds only, generous scale, no repetitive pinstripes or crowded contours.
Avoid: text, logo, typography, watermark, UI, globe, Earth, map, flags, people, architecture, portals, rectangular frames, crossing ribbon bands, waves of thin lines, point clouds, liquid blobs, spheres, concentric closed rings, infinity symbols, neon and futuristic networks. No added gradient overlay or separate white copy panel.
Device-specific composition: Portrait 3:4 for a portrait tablet. Recompose relief folds in upper-middle and upper-right, y=17..48%. Pale material continues naturally across the whole lower half with subtle surface depth; no blank bottom block. Keep x=4..78%,y=52..88% bright and calm for Japanese copy. A narrow near-black crevice can sit at right edge y=25..45%. Bottom 10% remains pale.
```

### タブレット横・コンパクト横画面

```text
Use case: stylized-concept.
Asset type: finished full-bleed corporate website hero background, photographically rendered abstract material artwork.
Primary request: a refined "White Relief" visual. One continuous enormous matte blue-white surface has three broad sculpted folds and shallow raised planes. Their soft rounded transitions and precise narrow crevices form a quiet sculptural landscape; edges continue beyond the image. A few restrained deep blue-black recesses give definition. This is an abstract brand image about openness and connection, not real premises.
Style: high-end still-life editorial photography, carefully art-directed minimal material study, soft daylight from upper-left, extremely fine plaster or uncoated porcelain texture, physically convincing soft shadows. Calm, confident, tactile and spacious.
Palette: ONLY near-white with a subtle blue tint #F4F8FA and nearly-black with a subtle blue tint #081824, with tonal blends of the same two colors for shadows. Overall reads near monochrome. No saturated blue, no other hue, no chrome or rainbow.
Composition: completely edge-to-edge image with material, depth and lighting spanning the whole canvas, not an inset image or a top image with a separate empty block. Keep uppermost 12 percent pale for dark header text, and bottommost 10 percent pale for small dark footer text. Black Japanese copy will be placed over the lower-left, so keep that region bright and low-contrast while preserving subtle integrated surface texture. Dark recesses are concentrated in upper-right or far-right middle, not behind text. Three broad folds only, generous scale, no repetitive pinstripes or crowded contours.
Avoid: text, logo, typography, watermark, UI, globe, Earth, map, flags, people, architecture, portals, rectangular frames, crossing ribbon bands, waves of thin lines, point clouds, liquid blobs, spheres, concentric closed rings, infinity symbols, neon and futuristic networks. No added gradient overlay or separate white copy panel.
Device-specific composition: Landscape 4:3 for landscape tablet and compact horizontal screens. Three broad relief folds rise in upper-right with an oblique diagonal rhythm. Strongest deep blue-black crevice confined to upper-right y=25..43%. Keep x=3..69%,y=45..88% light and restrained for Japanese copy. The pale foreground is a continuous textured sculpted surface. Keep header and bottom footer light.
```

### スマートフォン縦

```text
Use case: stylized-concept.
Asset type: finished full-bleed corporate website hero background, photographically rendered abstract material artwork.
Primary request: a refined "White Relief" visual. One continuous enormous matte blue-white surface has three broad sculpted folds and shallow raised planes. Their soft rounded transitions and precise narrow crevices form a quiet sculptural landscape; edges continue beyond the image. A few restrained deep blue-black recesses give definition. This is an abstract brand image about openness and connection, not real premises.
Style: high-end still-life editorial photography, carefully art-directed minimal material study, soft daylight from upper-left, extremely fine plaster or uncoated porcelain texture, physically convincing soft shadows. Calm, confident, tactile and spacious.
Palette: ONLY near-white with a subtle blue tint #F4F8FA and nearly-black with a subtle blue tint #081824, with tonal blends of the same two colors for shadows. Overall reads near monochrome. No saturated blue, no other hue, no chrome or rainbow.
Composition: completely edge-to-edge image with material, depth and lighting spanning the whole canvas, not an inset image or a top image with a separate empty block. Keep uppermost 12 percent pale for dark header text, and bottommost 10 percent pale for small dark footer text. Black Japanese copy will be placed over the lower-left, so keep that region bright and low-contrast while preserving subtle integrated surface texture. Dark recesses are concentrated in upper-right or far-right middle, not behind text. Three broad folds only, generous scale, no repetitive pinstripes or crowded contours.
Avoid: text, logo, typography, watermark, UI, globe, Earth, map, flags, people, architecture, portals, rectangular frames, crossing ribbon bands, waves of thin lines, point clouds, liquid blobs, spheres, concentric closed rings, infinity symbols, neon and futuristic networks. No added gradient overlay or separate white copy panel.
Device-specific composition: Tall portrait 9:19.5 for smartphone. Compose three large softly rounded relief folds across upper third, y=16..44%, with one narrow dark blue-black crevice at far-right middle only. Below y=48%, a pale gently curved material surface continues to the bottom; subtle depth and texture throughout, not a blank panel. Keep x=4..92%,y=51..88% low-contrast pale for existing black Japanese headline and paragraph. Top header and bottommost 10% must remain pale. The entire portrait is one edge-to-edge photographic material scene.
```


