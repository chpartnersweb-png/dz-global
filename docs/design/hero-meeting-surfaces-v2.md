# 抽象ヒーロー v2 — 接する面と広がり

更新日: 2026-11-04（日本時間）

## 方針

事業と形・構図の関係、コピーとの役割分担は [hero-design-intent.md](hero-design-intent.md) を参照。

ユーザーは人物・通訳機器を使う案を希望せず、「現状の画像のようなイメージが良い」と回答。そのため、現在の白い曲面・柔らかな陰影・細かな素材感をスタイル参照として、組み込みimage_genツールで4構図を制作した。

異なる面が自然に接し、明るい空間へ続く構図を「つながり・可能性」の抽象的なイメージとして採用。通訳・語学指導・グローバル人材育成の具体的な内容は既存のHTMLコピーで説明する。画像だけで事業を説明できるという意図や主張はない。

配色は青みの白 `#F4F8FA` と青みの黒 `#081824`。人物、機器、地球、地図等は含めない。実際の会社施設やサービス風景を示す画像ではない。

## 保存先と組み込み

| 用途 | 保存先 |
| --- | --- |
| PC | `src/assets/images/hero-relief-desktop-v2.png` |
| タブレット縦 | `src/assets/images/hero-relief-tablet-portrait-v2.png` |
| タブレット横・コンパクト横画面 | `src/assets/images/hero-relief-tablet-landscape-v2.png` |
| スマートフォン縦 | `src/assets/images/hero-relief-mobile-v2.png` |

Hero.astroの画像参照を4点とも差し替えた。既存のpicture/sourceによるデバイス別切り替え、WebP/srcset、背景全体を覆うobject-fit: coverを継続する。

ユーザー指定に従い、実装後のビルド・ブラウザー確認・テストは行っていない。

## 使用した生成プロンプト

### PC

```text
Use case: stylized-concept.
Asset type: a finished edge-to-edge hero background for D&G Global's Japanese corporate website.
Input image role: STYLE AND MATERIAL REFERENCE ONLY. The user likes this existing image's pale sculpted surfaces, restrained cool monochrome and soft shadows. Keep that visual character while making a new composition.
Primary request: "Meeting Surfaces" — two or three enormous, softly sculpted matte white planes approach each other from different directions, meet along an elegant shallow seam, and open into a bright spacious continuation. This is an abstract metaphor for connection and opening possibilities. Do not try to literally illustrate a business service.
Visual character: closely observed fine uncoated porcelain or paper-like texture, broad smooth transitions, calm daylight, photographic material realism, generous scale. Softly rounded surfaces, with an intentional narrow deep shadow where two surfaces approach; the shadow gradually resolves into light. Open continuous composition extending beyond all edges, no isolated object.
STRICT palette: blue-tinted near-white #F4F8FA and restrained blue-tinted almost-black #081824 only, plus intermediate tonal blends. Predominantly pale, with a modest deep blue-black seam for definition. No vivid blue, green, warm colors, chrome, transparent glass or rainbow.
Keep the whole canvas a continuous surface environment; no inset picture, split layout, blank white bottom block or added white text panel. Topmost 12 percent and bottommost 10 percent should be pale enough for dark header/footer text. Low-contrast bright integrated space in the lower-left will receive large live black Japanese copy.
Avoid all people, faces, body parts, silhouettes, portraits, headsets, receivers, devices, office props, desks, notebooks, books, microphones, logos, typography, watermarks, flags, globes, maps, planets, architectural frames, floating line grids, point clouds, crossing ribbon loops, repetitive thin waves, spheres, liquid blobs and closed concentric circles. This is abstract brand art, not actual premises or products.
Device composition: Wide landscape 16:9. Two broad pale planes converge in upper-middle/right. The narrow deepest seam sits around x=77%,y=34% and becomes brighter toward the center. A gently rising pale foreground surface sweeps across the full lower frame, supporting black Japanese copy in x=3..61%,y=47..87%. Plenty of spatial depth but only two or three major forms. Preserve the existing photograph's quiet airy quality.
```

### タブレット縦

```text
Use case: stylized-concept.
Asset type: a finished edge-to-edge hero background for D&G Global's Japanese corporate website.
Input image role: STYLE AND MATERIAL REFERENCE ONLY. The user likes this existing image's pale sculpted surfaces, restrained cool monochrome and soft shadows. Keep that visual character while making a new composition.
Primary request: "Meeting Surfaces" — two or three enormous, softly sculpted matte white planes approach each other from different directions, meet along an elegant shallow seam, and open into a bright spacious continuation. This is an abstract metaphor for connection and opening possibilities. Do not try to literally illustrate a business service.
Visual character: closely observed fine uncoated porcelain or paper-like texture, broad smooth transitions, calm daylight, photographic material realism, generous scale. Softly rounded surfaces, with an intentional narrow deep shadow where two surfaces approach; the shadow gradually resolves into light. Open continuous composition extending beyond all edges, no isolated object.
STRICT palette: blue-tinted near-white #F4F8FA and restrained blue-tinted almost-black #081824 only, plus intermediate tonal blends. Predominantly pale, with a modest deep blue-black seam for definition. No vivid blue, green, warm colors, chrome, transparent glass or rainbow.
Keep the whole canvas a continuous surface environment; no inset picture, split layout, blank white bottom block or added white text panel. Topmost 12 percent and bottommost 10 percent should be pale enough for dark header/footer text. Low-contrast bright integrated space in the lower-left will receive large live black Japanese copy.
Avoid all people, faces, body parts, silhouettes, portraits, headsets, receivers, devices, office props, desks, notebooks, books, microphones, logos, typography, watermarks, flags, globes, maps, planets, architectural frames, floating line grids, point clouds, crossing ribbon loops, repetitive thin waves, spheres, liquid blobs and closed concentric circles. This is abstract brand art, not actual premises or products.
Device composition: Portrait 3:4. Recompose the meeting of broad pale surfaces around upper-middle/right, y=18..46%, with the darkest narrow seam at the right edge only. Keep lower-left x=4..78%,y=53..88% light, tactile and quiet for Japanese copy. The lower area is a gently sculpted continuation of the same surfaces with subtle depth. Header and footer remain pale.
```

### タブレット横・コンパクト横画面

```text
Use case: stylized-concept.
Asset type: a finished edge-to-edge hero background for D&G Global's Japanese corporate website.
Input image role: STYLE AND MATERIAL REFERENCE ONLY. The user likes this existing image's pale sculpted surfaces, restrained cool monochrome and soft shadows. Keep that visual character while making a new composition.
Primary request: "Meeting Surfaces" — two or three enormous, softly sculpted matte white planes approach each other from different directions, meet along an elegant shallow seam, and open into a bright spacious continuation. This is an abstract metaphor for connection and opening possibilities. Do not try to literally illustrate a business service.
Visual character: closely observed fine uncoated porcelain or paper-like texture, broad smooth transitions, calm daylight, photographic material realism, generous scale. Softly rounded surfaces, with an intentional narrow deep shadow where two surfaces approach; the shadow gradually resolves into light. Open continuous composition extending beyond all edges, no isolated object.
STRICT palette: blue-tinted near-white #F4F8FA and restrained blue-tinted almost-black #081824 only, plus intermediate tonal blends. Predominantly pale, with a modest deep blue-black seam for definition. No vivid blue, green, warm colors, chrome, transparent glass or rainbow.
Keep the whole canvas a continuous surface environment; no inset picture, split layout, blank white bottom block or added white text panel. Topmost 12 percent and bottommost 10 percent should be pale enough for dark header/footer text. Low-contrast bright integrated space in the lower-left will receive large live black Japanese copy.
Avoid all people, faces, body parts, silhouettes, portraits, headsets, receivers, devices, office props, desks, notebooks, books, microphones, logos, typography, watermarks, flags, globes, maps, planets, architectural frames, floating line grids, point clouds, crossing ribbon loops, repetitive thin waves, spheres, liquid blobs and closed concentric circles. This is abstract brand art, not actual premises or products.
Device composition: Landscape 4:3. Broad pale foreground plane and two softly rising planes meet toward the upper-right. A deep slender shadow seam defines their connection near x=82%,y=33%. Integrated bright copy space at x=3..69%,y=47..88%. The folds feel open and expansive, no busy repetitive contours. Same calm photographic matte surface character as the reference.
```

### スマートフォン縦

```text
Use case: stylized-concept.
Asset type: a finished edge-to-edge hero background for D&G Global's Japanese corporate website.
Input image role: STYLE AND MATERIAL REFERENCE ONLY. The user likes this existing image's pale sculpted surfaces, restrained cool monochrome and soft shadows. Keep that visual character while making a new composition.
Primary request: "Meeting Surfaces" — two or three enormous, softly sculpted matte white planes approach each other from different directions, meet along an elegant shallow seam, and open into a bright spacious continuation. This is an abstract metaphor for connection and opening possibilities. Do not try to literally illustrate a business service.
Visual character: closely observed fine uncoated porcelain or paper-like texture, broad smooth transitions, calm daylight, photographic material realism, generous scale. Softly rounded surfaces, with an intentional narrow deep shadow where two surfaces approach; the shadow gradually resolves into light. Open continuous composition extending beyond all edges, no isolated object.
STRICT palette: blue-tinted near-white #F4F8FA and restrained blue-tinted almost-black #081824 only, plus intermediate tonal blends. Predominantly pale, with a modest deep blue-black seam for definition. No vivid blue, green, warm colors, chrome, transparent glass or rainbow.
Keep the whole canvas a continuous surface environment; no inset picture, split layout, blank white bottom block or added white text panel. Topmost 12 percent and bottommost 10 percent should be pale enough for dark header/footer text. Low-contrast bright integrated space in the lower-left will receive large live black Japanese copy.
Avoid all people, faces, body parts, silhouettes, portraits, headsets, receivers, devices, office props, desks, notebooks, books, microphones, logos, typography, watermarks, flags, globes, maps, planets, architectural frames, floating line grids, point clouds, crossing ribbon loops, repetitive thin waves, spheres, liquid blobs and closed concentric circles. This is abstract brand art, not actual premises or products.
Device composition: Tall portrait 9:19.5. Two softly rounded pale surfaces meet across the upper third around y=22..43%; a small deep seam sits at far-right around y=37%. Their pale continuation extends naturally through the full lower portrait. Keep x=4..92%,y=51..88% bright and quiet for black Japanese copy, with extremely fine tactile texture instead of an empty white panel. Keep top and bottom pale. Maintain the airy spaciousness of the reference.
```


