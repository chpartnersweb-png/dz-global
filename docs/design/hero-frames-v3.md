# ヒーロー画像 v3 — Open Perspectives

制作日: 2026-11-04（日本時間）

## デザイン

ユーザーの「他のデザインのヒーロー画像を生成し使用する」という依頼に対応。

新しいモチーフは、奥へ連なる四角いフレーム、開かれた空間、光と影。異なる視点や文化の先へ進むイメージを抽象的に表現する。配色は青みの白 `#F4F8FA` と青みの黒 `#081824` を継続。

4点とも組み込みimage_genツールで新規生成。これらは抽象的なブランドアートであり、実際の会社施設を示すものではない。

## 保存先

| 用途 | ファイル |
| --- | --- |
| PC | `src/assets/images/hero-frames-desktop-v3.png` |
| タブレット縦 | `src/assets/images/hero-frames-tablet-portrait-v3.png` |
| タブレット横・コンパクト横画面 | `src/assets/images/hero-frames-tablet-landscape-v3.png` |
| スマートフォン縦 | `src/assets/images/hero-frames-mobile-v3.png` |

Hero.astroの4つのimportを新しい画像へ差し替えた。既存のpicture/sourceによるデバイス別切り替え、WebP/srcset、全面を覆うobject-fit: coverの構成を使用する。

前回の指示を引き継ぎ、今回の差し替え後もビルド・ブラウザー等の実装後確認は行っていない。

## 使用プロンプト

### PC

```text
Use case: stylized-concept.
Asset type: full-bleed background image for an elegant Japanese corporate website about interpreting, language education and global talent development.
Primary request: a completely NEW visual concept called "Open Perspectives". Monumental OPEN RECTANGULAR FRAMES recede diagonally through a luminous abstract space, suggesting new viewpoints, connections and crossing cultural boundaries. These are architectural art objects, not a depiction of real company premises.
Subject: four or five minimal square-edged rectangular portal frames at staggered depths and subtly different orientations. Strong geometric perspective, sculptural proportions, quiet tension between light planes and dark vertical edges. A cropped dark rectangular structural edge on the far right anchors the scene. Use coherent physically plausible geometry.
Style: premium architectural editorial photography of a minimalist abstract installation, matte porcelain-like surfaces, subtle tactile texture, soft daylight, delicate long shadows, refined optical depth.
Color palette: only near-white with the slightest blue undertone #F4F8FA and almost-black with restrained blue undertone #081824. All lighting and shadow tones are derived from these two base colors. No saturated blue, no other accent colors.
Composition: edge-to-edge immersive environment with seamless pale floor and spatial shadows across the whole frame. The floor is part of the scene, not a blank panel or a gradient overlay. The header zone at the top is pale. Leave integrated light-toned space in the lower-left for black Japanese HTML text. Keep the far-right bottom area dark enough for a small white footer label.
Constraints: no text, typography, UI, logo, watermark, people, globe, planet, maps, flags, skylines, spheres, rings, neon, tech networks. NO flowing ribbons, crossing bands, curved strips, waves, infinity loops or liquid blobs. The new motif must be distinctly angular, spatial and architectural.
Composition for this variant: Wide landscape 16:9. Main portal sequence occupies the upper-right and right-center, vanishing point near x=73%, y=35%. A huge right-hand dark vertical frame edge is cropped by the image boundary, with subtle dark structure at bottom-right. Bright continuous floor occupies the lower-left x=0..60%, y=48..92% for two large title lines and paragraph. Keep top 12% mostly pale for the header. Dramatic scale without visual clutter. Dark sculptural right border continues full-height below the header, pale planes and shadows run through the entire frame.
```

### タブレット縦

```text
Use case: stylized-concept.
Asset type: full-bleed background image for an elegant Japanese corporate website about interpreting, language education and global talent development.
Primary request: a completely NEW visual concept called "Open Perspectives". Monumental OPEN RECTANGULAR FRAMES recede diagonally through a luminous abstract space, suggesting new viewpoints, connections and crossing cultural boundaries. These are architectural art objects, not a depiction of real company premises.
Subject: four or five minimal square-edged rectangular portal frames at staggered depths and subtly different orientations. Strong geometric perspective, sculptural proportions, quiet tension between light planes and dark vertical edges. A cropped dark rectangular structural edge on the far right anchors the scene. Use coherent physically plausible geometry.
Style: premium architectural editorial photography of a minimalist abstract installation, matte porcelain-like surfaces, subtle tactile texture, soft daylight, delicate long shadows, refined optical depth.
Color palette: only near-white with the slightest blue undertone #F4F8FA and almost-black with restrained blue undertone #081824. All lighting and shadow tones are derived from these two base colors. No saturated blue, no other accent colors.
Composition: edge-to-edge immersive environment with seamless pale floor and spatial shadows across the whole frame. The floor is part of the scene, not a blank panel or a gradient overlay. The header zone at the top is pale. Leave integrated light-toned space in the lower-left for black Japanese HTML text. Keep the far-right bottom area dark enough for a small white footer label.
Constraints: no text, typography, UI, logo, watermark, people, globe, planet, maps, flags, skylines, spheres, rings, neon, tech networks. NO flowing ribbons, crossing bands, curved strips, waves, infinity loops or liquid blobs. The new motif must be distinctly angular, spatial and architectural.
Composition for this variant: Portrait 3:4. Recompose the same rectangular portal installation vertically: open frames recede from upper-middle toward upper-right. Major shapes occupy y=18..52%, the nearest dark vertical beam runs down the far-right edge. Lower-left x=4..77%, y=53..88% is calm pale floor with soft actual scene shadows for large black Japanese copy. Preserve convincing deep perspective. At the bottommost 8%, left side remains pale, right side has dark structural geometry so small white right-hand footer text can sit there. Continuous full-height artwork, not a photo only at the top.
```

### タブレット横・コンパクト横画面

```text
Use case: stylized-concept.
Asset type: full-bleed background image for an elegant Japanese corporate website about interpreting, language education and global talent development.
Primary request: a completely NEW visual concept called "Open Perspectives". Monumental OPEN RECTANGULAR FRAMES recede diagonally through a luminous abstract space, suggesting new viewpoints, connections and crossing cultural boundaries. These are architectural art objects, not a depiction of real company premises.
Subject: four or five minimal square-edged rectangular portal frames at staggered depths and subtly different orientations. Strong geometric perspective, sculptural proportions, quiet tension between light planes and dark vertical edges. A cropped dark rectangular structural edge on the far right anchors the scene. Use coherent physically plausible geometry.
Style: premium architectural editorial photography of a minimalist abstract installation, matte porcelain-like surfaces, subtle tactile texture, soft daylight, delicate long shadows, refined optical depth.
Color palette: only near-white with the slightest blue undertone #F4F8FA and almost-black with restrained blue undertone #081824. All lighting and shadow tones are derived from these two base colors. No saturated blue, no other accent colors.
Composition: edge-to-edge immersive environment with seamless pale floor and spatial shadows across the whole frame. The floor is part of the scene, not a blank panel or a gradient overlay. The header zone at the top is pale. Leave integrated light-toned space in the lower-left for black Japanese HTML text. Keep the far-right bottom area dark enough for a small white footer label.
Constraints: no text, typography, UI, logo, watermark, people, globe, planet, maps, flags, skylines, spheres, rings, neon, tech networks. NO flowing ribbons, crossing bands, curved strips, waves, infinity loops or liquid blobs. The new motif must be distinctly angular, spatial and architectural.
Composition for this variant: Landscape 4:3. Recompose rectangular portal installation for tablet landscape and compact horizontal screens. Portal sequence in upper-right, vanishing point x=74%, y=32%; nearest dark rectangular frame at the far-right edge gives bold depth. Lower-left x=4..68%, y=46..87% remains light for Japanese text. Keep header pale, keep bottom-right darker for white footer label. Seamless pale floor with extremely soft shadows extends through the full scene. Four or five frames only; confident, clean composition.
```

### スマートフォン縦

```text
Use case: stylized-concept.
Asset type: full-bleed background image for an elegant Japanese corporate website about interpreting, language education and global talent development.
Primary request: a completely NEW visual concept called "Open Perspectives". Monumental OPEN RECTANGULAR FRAMES recede diagonally through a luminous abstract space, suggesting new viewpoints, connections and crossing cultural boundaries. These are architectural art objects, not a depiction of real company premises.
Subject: four or five minimal square-edged rectangular portal frames at staggered depths and subtly different orientations. Strong geometric perspective, sculptural proportions, quiet tension between light planes and dark vertical edges. A cropped dark rectangular structural edge on the far right anchors the scene. Use coherent physically plausible geometry.
Style: premium architectural editorial photography of a minimalist abstract installation, matte porcelain-like surfaces, subtle tactile texture, soft daylight, delicate long shadows, refined optical depth.
Color palette: only near-white with the slightest blue undertone #F4F8FA and almost-black with restrained blue undertone #081824. All lighting and shadow tones are derived from these two base colors. No saturated blue, no other accent colors.
Composition: edge-to-edge immersive environment with seamless pale floor and spatial shadows across the whole frame. The floor is part of the scene, not a blank panel or a gradient overlay. The header zone at the top is pale. Leave integrated light-toned space in the lower-left for black Japanese HTML text. Keep the far-right bottom area dark enough for a small white footer label.
Constraints: no text, typography, UI, logo, watermark, people, globe, planet, maps, flags, skylines, spheres, rings, neon, tech networks. NO flowing ribbons, crossing bands, curved strips, waves, infinity loops or liquid blobs. The new motif must be distinctly angular, spatial and architectural.
Composition for this variant: Tall portrait 9:19.5. Recompose for smartphone full-screen background. Rectangular portal installation concentrated in upper-middle and upper-right between y=15..43%, with a clean nearest rectangular dark beam along the far right. Strong receding perspective and a luminous open space beyond the frames. From y=48..89%, x=4..91% must remain a pale coherent floor plane with delicate perspective shadows for black Japanese heading and paragraph. Below y=50% keep the darkest structural edge confined to the last 5% of image width, then let its base widen naturally only in the bottommost 8% so the bottom-right footer area is dark while bottom-left stays pale. Top 12% pale and quiet for header. Image continues edge-to-edge through the full portrait, no empty flat bottom panel.
```


