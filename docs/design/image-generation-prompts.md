# AIビジュアル制作記録

制作日: 2026-11-04（日本時間）

方式: 組み込みimage_genツール。最初の構図案を生成後、ユーザー指定の2色に合わせて画像編集。

採用する方向性の画像: `assets/hero-crossing-monochrome-v1.png`

用途: ヘッダー・ヒーローのデザイン検討用。抽象的なブランドアートであり、実際の会社施設・サービス風景を示すものではない。文字・ロゴは含めていない。

基本色: 青みの白 `#F4F8FA`、青緑みの黒 `#081416`。画像の陰影は2色の間の階調で構成する意図。生成画像の全ピクセルが指定HEXと一致するという意味ではない。

## 初回生成プロンプト（構図の検討履歴）

初回のコバルトブルー案は、後続のユーザー指定により配色としては不採用。

```text
Use case: stylized-concept
Asset type: art-direction preview for a Japanese corporate website hero, image only, wide landscape 16:9 composition.
Primary request: express global scale indirectly through spatial continuity, intersecting trajectories and an open luminous horizon. Sophisticated, confident, restrained architectural art direction for D&G Global, whose business sector is not yet specified; no industry-specific claims.
Scene/backdrop: seamless pearl-white spatial environment with a subtle distant pale horizon and lots of breathing room. Two enormous continuous sculptural bands, one deep cobalt-blue satin surface and one brushed silvery-white surface, sweep diagonally through the composition, cross at different depths, and continue out of frame; their scale exceeds the canvas. Open gently curved trajectories, never closed loops or rings. Physically plausible surfaces, fine tactile reflections, soft daylight and clean shadows, highly crafted architectural editorial photography of an abstract installation.
Composition: entire canvas is one immersive scene, not a left/right split. Main crossing is above center. Keep uppermost 15 percent light and quiet for a future header and lower-left 45 percent relatively quiet pearl-white for future live HTML Japanese typography. Medium-wide perspective with strong spatial depth, restrained blue accents through the middle and edges, no clutter. Premium visual impact without spectacle.
Text: none. Do not render company name, typography, logo, UI, labels, symbols or watermark.
Avoid: globe, planet, sphere, maps, flags, airplanes, cargo ships, skylines, people, handshakes, neon, cyberpunk, network nodes, star fields, holographic grids, infinity symbols, torus rings, generic liquid blobs, rainbow gradients. This is an abstract brand image, not a photo of company premises.
```

## モバイル専用ビジュアル（実装時に追加）

保存先: `../../src/assets/images/hero-mobile.png`。組み込みimage_genを使用。PC版は同ディレクトリの `hero-desktop.png` に配置。

```text
Use case: stylized-concept. Create the MOBILE PORTRAIT companion to the attached abstract corporate hero background. The reference image is a visual style and material reference, not a fixed composition. Portrait 9:16. Same two enormous continuous matte sculptural bands, one almost-black blue-green #081416, one almost-white blue-tinted #F4F8FA, crossing in a calm seamless luminous space. STRICT two base colors only, with shadows and highlights as tonal blends of those two colors; no accent colors. View from a distance reads black and white, extremely subtle cool undertone up close. Recompose for a smartphone hero: top 12 percent is quiet nearly uniform pale white for a header; all the dark ribbon and the sculptural crossing are concentrated between 14 and 42 percent from the top. The dark band enters from left edge, curves upward toward right edge, exits the canvas by 43 percent from top. The white band crosses it diagonally with soft shadows. LOWER 55 PERCENT of the whole portrait is clean soft near-white empty negative space, with only an almost imperceptible horizon/shadow, for future black live HTML Japanese title and description. Do not run dark bands across the lower half. Restrained premium architectural editorial art, matte tactile surfaces, soft natural illumination. No text, UI, logo or watermark. No globe, map, flags, spheres, neon, infinity loops, people or buildings. Only abstract brand art.
```


## 配色修正プロンプト（現在の案）

```text
Use case: precise-object-edit. Edit the previously generated abstract sculptural ribbon corporate hero image. Preserve its exact composition, large open sweeping bands, spatial crossing, horizon, calm wide framing, and empty lower-left area for future live HTML copy. Change the entire palette to STRICT TWO-BASE-COLOR near monochrome: extremely pale blue-tinted white #F4F8FA and extremely dark blue-green-tinted almost black #081416. The broad previously cobalt band becomes near-black #081416; its subtle texture and soft highlights must stay within desaturated tonal mixtures of these two colors. The silver band becomes matte blue-tinted white, NOT metallic silver, with quiet soft shadows. Background, floor, horizon and light are blue-tinted white. From a distance the image must read black and white; only on close inspection can the tiniest blue/green undertone be perceived. No visible saturated blue, no emerald green, no additional accent color, no neutral chrome metallic sparkle. Make materials matte and tactile, sophisticated architectural minimalism. Tone gradients/shadows are allowed only as blends of the two specified base colors. No text, logos, UI, globe, map, symbols or watermark. This is a brand-art concept, not actual company premises.
```

