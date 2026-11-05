# 編集ガイド

## 会社情報・事業内容

`src/data/company.ts` が会社名、住所、電話番号、電話発信先、地図リンク、事業10項目の編集元。

`src/data/support.ts` が通訳・言語教育・文化理解・人材育成の4つの支援内容、相談場面の例、支援の進め方の編集元。支援の説明や進め方は、クライアントの説明をもとに作成した提案文を含む。出典と補足の範囲は `docs/CONTENT-SOURCES.md` を参照。

会社情報を変更すると、会社概要・お問い合わせ・フッターに反映される。住所の変更時は地図検索用の住所、`src/pages/index.astro` の構造化データの住所も変更する。電話番号の変更時は表示用番号、`tel:` 用番号、構造化データの国際表記を揃える。

社名のロゴ文字は `src/components/SiteHeader.astro`、`src/components/SiteFooter.astro`、`src/components/CorporateHero.astro`、`public/favicon.svg` にも記述がある。本文・ページメタ情報の社名も合わせて変更する。ヘッダーには株式会社を表示しない。

## コンテンツ

| ファイル | 内容 |
| --- | --- |
| `src/pages/index.astro` | ページ全体の並び、タイトル、description、OGテキスト、構造化データ |
| `src/components/SiteHeader.astro` | 既存デザインを引き継いだヘッダー、ページ内リンク、メニュー |
| `src/components/CorporateHero.astro` | メインコピー、輪郭の&、事業紹介への導線 |
| `src/components/AboutSection.astro` | 会社紹介文 |
| `src/components/BusinessSection.astro` | 4つの支援内容の開閉リスト、国・地域や企業の状況に合わせた支援イメージ |
| `src/components/ApproachSection.astro` | 相談場面の例、支援の進め方 |
| `src/components/CompanySection.astro` | 会社概要・地図リンク・事業10項目の開閉リスト |
| `src/components/ContactSection.astro` | 電話お問い合わせ |
| `src/components/SiteFooter.astro` | 社名・住所・ページ上部へのリンク |

支援内容は `supportServices`、相談場面は `consultationExamples`、進め方は `supportSteps` を更新する。会社概要内の「事業内容一覧」は `activities` の10項目を元の順番で表示する。支援内容の説明と、元の事業10項目は別のデータとして管理する。

## 配色・レイアウト・動き

- `src/styles/_tokens.scss`：2つの基本色
- `src/styles/global.scss`：共通設定、ヘッダー、メニュー、旧ヒーローのスタイル
- `src/styles/home.scss`：現行ページの各セクションとレスポンシブ
- Google Mapsリンクのピンは `CompanySection.astro` の `astro-icon` の `Icon` コンポーネント（`lucide:map-pin`）。`astro.config.mjs` で `astro-icon` を登録し、`@iconify-json/lucide` を使用する。サイズは16px、色はリンクの文字色を継承。リンクの間隔は `.small-link--map` で調整する。
- `src/scripts/motion.ts`：GSAPの登場演出、PCのLenis、ヘッダーのスクロール状態
- `src/scripts/accordions.ts`：事業紹介と会社概要の開閉演出。開く際は約0.44秒、閉じる際は約0.32秒で高さと透明度を変化させる。連打時は現在位置から切り替え、動きを減らす設定では即時に切り替える。
- `src/scripts/mobile-menu.ts`：1つのハンバーガーボタンで開閉を切り替える。Menu／Closeの表示と2本線／×が連動する。メニューを開く間は同じボタン要素をdialog内に移し、ヘッダーと同じ右上位置に固定する。閉じ終わると元の位置へ戻す。メニュー面だけをフェード・移動させ、操作ボタンは動かさない。リンク等は0.05秒ずつ登場し、退出は約0.3秒。Escape、同じボタン、リンク選択で退出し、終了後に背景スクロールを再開する。ページ内リンクは退出後に移動。動きを減らす設定、PC幅への変更、HMRの後片付けに対応する。

現行ページは `CorporateHero.astro` を使用する。旧 `Hero.astro`、画像・粒子用のスクリプト、過去の生成画像を変更しても現行ページには反映されない。

モバイルメニューの社名はヘッダーの `[data-header-wordmark]` 自体を使用する。開く際に同じ要素をdialog内へ移し、左上に固定して表示し、閉じ終わるとヘッダーへ戻す。別の社名表示や複製は設けず、ロゴ・開閉ボタンはメニュー本体のフェード・移動対象に含めない。ロゴの文字組みは `SiteHeader.astro` と共通の `.wordmark` スタイルで編集する。

移動中のヘッダーには、元の要素と同じ実測サイズの空の枠を残す。ロゴとボタンの位置は、その枠の `getBoundingClientRect()` の小数を含む座標で指定する。ヘッダーの高さから中央を計算し直したり、整数の `offsetHeight` から位置を作ったりしない。画面幅やヘッダーサイズの変化時も元の枠に合わせて更新する。

## 内容の追加

代表者、設立年、資本金、許認可番号、実績、営業時間、メールアドレス、問い合わせフォームURL、公開ドメインは未提供。追加する場合は提供情報に基づいて記載する。

現在のお問い合わせ導線は電話。公開ドメインが確定した際はcanonicalやOG URL等を設定する。フォームを設置する場合は送信先と送信処理も実装する。
