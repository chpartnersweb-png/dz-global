export const company = {
  name: 'D&Z Global 株式会社',
  brand: 'D&Z Global',
  postalCode: '107-0061',
  address: ['東京都港区北青山一丁目3番1号', 'アールキューブ青山3階'],
  phone: '03-6698-1273',
  phoneHref: 'tel:0366981273',
  mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('東京都港区北青山一丁目3番1号 アールキューブ青山')}`,
} as const;

// Business wording follows the information supplied by the user.
export const activities = [
  { number: 1, text: '経営コンサルティング業務' },
  { number: 2, text: '企業の採用活動、社員教育及び人材育成に関するコンサルティング業務' },
  { number: 3, text: '店舗、施設等の運営、管理及び集客に関するコンサルティング業務' },
  { number: 4, text: '飲食店の経営' },
  { number: 5, text: '芸能タレントのマネジメント及びプロモート活動' },
] as const;

