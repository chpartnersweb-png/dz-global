# D&Z Global 株式会社

Astro・SCSS・GSAP・Lenisによる1ページの企業サイト。「海外企業と日本企業の橋渡し」を軸に、ヘッダー、ヒーロー、私たちについて、支援内容、支援の進め方、会社概要、電話お問い合わせ、フッターで構成。

## 開発

```sh
npm install
npm run dev
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

`npm run dev` はAGENTS.mdの指定に従い、Astroをバックグラウンドで起動する。既定のローカルURLは `http://localhost:4321/`。

```sh
npm run build
npm run preview
```

## 編集

- [会社情報・事業内容のデータ](src/data/company.ts)
- [支援内容・相談例・進め方の提案コピー](src/data/support.ts)
- [編集ガイド](docs/EDITING.md)
- [実装概要と確認状況](docs/IMPLEMENTATION.md)
- [掲載情報の出典](docs/CONTENT-SOURCES.md)
- [現行デザインの意図](docs/design/corporate-onepage.md)

基本色は `src/styles/_tokens.scss` の2色。現行ページのスタイルは `src/styles/home.scss`、ヘッダー等の共通スタイルは `src/styles/global.scss`。

過去の画像・Three.js試作は履歴として残しているが、現行ページからは読み込んでいない。ユーザー指定により、今回の再構成後のビルド・型チェック・ブラウザー確認は実施していない。公開・デプロイも行っていない。
