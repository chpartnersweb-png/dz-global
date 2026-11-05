# デバイス別ヒーロー画像 v2

更新日: 2026-11-04（日本時間）

## 変更内容

ユーザーの指定に従い、基本の黒を `#081416` から、青を少し強めた `#081824` に変更。白は `#F4F8FA` を継続。

組み込みimage_genツールで4つの画角を生成し、サイトに組み込み。初回のPC画像を素材・形状の参照として使用した。いずれも抽象ブランドアートであり、実際の施設・研修風景等を示す画像ではない。

| 用途 | プロジェクト内の保存先 |
| --- | --- |
| PC横長 | `src/assets/images/hero-desktop-v2.png` |
| タブレット縦 | `src/assets/images/hero-tablet-portrait-v2.png` |
| タブレット横・コンパクト横画面 | `src/assets/images/hero-tablet-landscape-v2.png` |
| スマートフォン縦 | `src/assets/images/hero-mobile-v2.png` |

## 切り替え

pictureのsourceを以下の順に判定する。

1. 幅767px以下かつ縦向き: スマートフォン専用。
2. その他の縦向き画面: タブレット縦専用。
3. 幅1199px以下の横向き画面: タブレット横・コンパクト横画面用。
4. その他の横向き画面: PC専用。

画像は各条件に対応するWebP/srcsetで配信する構成。object-fit: coverによりヒーロー領域全体を覆う。画面と画像の比率が違う場合は端が自然にトリミングされる。

背景全体を白く覆っていたグラデーションを削除し、画像そのものを上端から下端まで表示する。背景レイヤーの上下を各32px広げ、既存の28pxのスクロール移動中にも領域を覆う構成に変更した。

画像下部の暗い帯に合わせ、右下のスクロール文字とPCの英字社名は白に変更。本文・社名・ボタン等は共通SCSSの青黒で統一。

## 確認範囲

ユーザー指定により、この変更後のビルド・ブラウザー表示・テスト等は実施していない。

## 使用プロンプト

### PC横長

```text
Use case: stylized-concept. Create a production hero BACKGROUND for D&G Global, using the attached image only as a reference for the established material and visual language: two enormous continuous matte sculptural bands crossing at different depths in a softly lit open space. Global connection expressed abstractly, never a globe or map. STRICT TWO BASE COLORS: extremely pale blue-tinted white #F4F8FA and almost-black ink with a slightly stronger BLUE undertone #081824. The dark material must read nearly black, not saturated navy; remove the former green cast. All shadows and highlights are tonal blends of those two colors. Preserve the refined tactile matte finish. Full-bleed edge-to-edge artwork: large forms and their subtle shadows must reach the frame boundaries and create visual continuity across the entire image height. No inset photograph, blank bottom block, card, border, vignette or UI. Maintain natural light-toned negative space where black HTML text will be placed, integrated into the actual scene rather than an added white panel. Uppermost 12 percent remains pale enough for dark header text. Image only: no letters, logo, watermark, people, skylines, flags, spheres, network nodes, neon or infinity loops. Not actual company premises.
OUTPUT: wide landscape 16:9, desktop full-screen hero. A broad near-black band enters upper-left around 20 percent height, passes behind a pale diagonal band in the upper center, and sweeps down the right side, exiting along the bottom-right edge. The pale band runs from lower-left through center toward upper-right, and its soft shadow gives depth throughout the frame. Lower-left roughly x=4..56 percent, y=48..86 percent must remain pale and calm for two large Japanese title lines and small paragraph. Keep the bottommost 10 percent pale enough for small black footer labels; put dark band near right edge but let its lowest edge curve outward before footer labels. Match the existing sweeping open composition, now with stronger blue-black material.
```

### タブレット縦

```text
Use case: stylized-concept. Create a production hero BACKGROUND for D&G Global, using the attached image only as a reference for the established material and visual language: two enormous continuous matte sculptural bands crossing at different depths in a softly lit open space. Global connection expressed abstractly, never a globe or map. STRICT TWO BASE COLORS: extremely pale blue-tinted white #F4F8FA and almost-black ink with a slightly stronger BLUE undertone #081824. The dark material must read nearly black, not saturated navy; remove the former green cast. All shadows and highlights are tonal blends of those two colors. Preserve the refined tactile matte finish. Full-bleed edge-to-edge artwork: large forms and their subtle shadows must reach the frame boundaries and create visual continuity across the entire image height. No inset photograph, blank bottom block, card, border, vignette or UI. Maintain natural light-toned negative space where black HTML text will be placed, integrated into the actual scene rather than an added white panel. Uppermost 12 percent remains pale enough for dark header text. Image only: no letters, logo, watermark, people, skylines, flags, spheres, network nodes, neon or infinity loops. Not actual company premises.
OUTPUT: portrait 3:4, full-screen portrait TABLET hero, recompose for this aspect ratio. Broad near-black band enters left edge around 20 percent height, crosses behind a pale ribbon in the upper middle around 32 percent, and sweeps along the rightmost 20 percent all the way toward bottom-right. Pale sculptural band runs from lower-left toward upper-right and continues out of frame. Add extremely subtle continuous surface depth and soft band shadows throughout the lower portion, NOT a featureless blank lower half. Keep x=5..72 percent at y=52..87 percent light and calm for black HTML title, short paragraph and CTA. Upper header and bottom footer remain pale. Same material, geometry language and palette as reference.
```

### タブレット横・コンパクト横画面

```text
Use case: stylized-concept. Create a production hero BACKGROUND for D&G Global, using the attached image only as a reference for the established material and visual language: two enormous continuous matte sculptural bands crossing at different depths in a softly lit open space. Global connection expressed abstractly, never a globe or map. STRICT TWO BASE COLORS: extremely pale blue-tinted white #F4F8FA and almost-black ink with a slightly stronger BLUE undertone #081824. The dark material must read nearly black, not saturated navy; remove the former green cast. All shadows and highlights are tonal blends of those two colors. Preserve the refined tactile matte finish. Full-bleed edge-to-edge artwork: large forms and their subtle shadows must reach the frame boundaries and create visual continuity across the entire image height. No inset photograph, blank bottom block, card, border, vignette or UI. Maintain natural light-toned negative space where black HTML text will be placed, integrated into the actual scene rather than an added white panel. Uppermost 12 percent remains pale enough for dark header text. Image only: no letters, logo, watermark, people, skylines, flags, spheres, network nodes, neon or infinity loops. Not actual company premises.
OUTPUT: landscape 4:3, full-screen landscape TABLET and compact landscape viewport hero. Broad blue-black band enters left edge at 19 percent height, crosses a light ribbon above the center around 35 percent height, then curves down along the right side and continues out of the bottom-right. Pale ribbon is broad and architectural with natural soft shadows reaching edge-to-edge. Lower-left x=4..69 percent, y=45..85 percent remains pale for black HTML headline and paragraph. Composition is substantial across the entire background, with fine depth in the lower pale area. Keep bottommost 9 percent pale enough for black footer labels. Same established minimalist full-bleed visual, no empty white block.
```

### スマートフォン縦

```text
Use case: stylized-concept. Create a production hero BACKGROUND for D&G Global, using the attached image only as a reference for the established material and visual language: two enormous continuous matte sculptural bands crossing at different depths in a softly lit open space. Global connection expressed abstractly, never a globe or map. STRICT TWO BASE COLORS: extremely pale blue-tinted white #F4F8FA and almost-black ink with a slightly stronger BLUE undertone #081824. The dark material must read nearly black, not saturated navy; remove the former green cast. All shadows and highlights are tonal blends of those two colors. Preserve the refined tactile matte finish. Full-bleed edge-to-edge artwork: large forms and their subtle shadows must reach the frame boundaries and create visual continuity across the entire image height. No inset photograph, blank bottom block, card, border, vignette or UI. Maintain natural light-toned negative space where black HTML text will be placed, integrated into the actual scene rather than an added white panel. Uppermost 12 percent remains pale enough for dark header text. Image only: no letters, logo, watermark, people, skylines, flags, spheres, network nodes, neon or infinity loops. Not actual company premises.
OUTPUT: tall portrait about 9:19.5, full-screen SMARTPHONE hero. Recompose to the tall frame. Dark broad band crosses from left edge at 20 percent height to right edge around 36 percent height behind a pale sculptural band crossing diagonally upward. The near-black band continues as a slender curved sliver along the FAR RIGHT EDGE, confined to the last 4 percent of width below 48 percent height, reaching the bottom-right corner. The white band and gentle surface shadows extend naturally into the lower image so this is one continuous full-height scene, NOT a top picture over a large blank bottom block. Keep the lower copy zone x=5..90 percent, y=50..88 percent very pale, without a dark shape behind any text. Subtle light dimensional contours and shadows are allowed there. Upper header and bottom footer stay pale. Restrained, elegant, near-black and pale blue-white only.
```


