// Service themes come from the client's explanation relayed by the user.
// Descriptions, example needs, and the flow are proposed website copy.
export const supportServices = [
  {
    number: '01', english: 'Interpreting', title: '展示会・ビジネスの通訳',
    introduction: '言葉の違いを越えて、その場の対話をつなぐ。',
    description: '商業展示会などでの通訳・同時通訳を通じて、日本企業と海外企業のコミュニケーションを支えます。伝えたい内容や対話の目的を共有し、相互理解につながる言葉の橋渡しを考えます。',
    points: ['商業展示会や企業間の交流の場での通訳', '同時通訳を含む、場面に応じた意思疎通の支援'],
  },
  {
    number: '02', english: 'Language', title: '企業向けの言語教育',
    introduction: '学ぶ言葉を、仕事の場で使える言葉へ。',
    description: '取引先企業の従業員の方に向けた言語指導・教育を行います。業務でどのような相手と、何を伝え合うのかを出発点に、学習の目的と実際のコミュニケーションを結びつけます。',
    points: ['業務や相手企業との関わりに合わせた学習内容の検討', '日々のやり取りを想定した、言語の理解と表現の学習'],
  },
  {
    number: '03', english: 'Culture', title: '文化理解・ビジネスコミュニケーション',
    introduction: '言葉の背景にある、考え方にも目を向ける。',
    description: '相手の文化や価値観を知ることは、言葉の理解とともに大切な要素です。国や地域の違いを一律に捉えず、相手企業や働く人の背景を踏まえ、関係づくりに必要な理解を深めていきます。',
    points: ['相手の文化・商習慣を踏まえたコミュニケーションの学習', '認識の違いや伝わり方を考える、異文化理解の支援'],
  },
  {
    number: '04', english: 'People', title: 'グローバル人材の育成',
    introduction: '異なる背景を持つ人と、ともに働く力を。',
    description: '言語の学習と文化への理解を重ね、日本と海外をつなぐ人材の育成を支えます。一人ひとりの役割や企業の課題を踏まえ、異なる背景を持つ相手と協働するための学びを考えます。',
    points: ['企業の業務・役割に合わせた人材育成の相談', '言語と文化の両面から考える、社員教育の支援'],
  },
] as const;

export const consultationExamples = [
  '展示会で、海外の出展企業や来場者との会話をつなぎたい。',
  '取引先に合わせた語学学習を、社員教育に取り入れたい。',
  '言葉だけでなく、相手の文化や考え方も理解したい。',
] as const;

export const supportSteps = [
  {
    number: '01', title: 'まず、背景を知る。', label: 'ご相談・ヒアリング',
    description: '相手となる国・地域や企業、現在のコミュニケーションの状況、目指したい関係を伺います。課題が整理できていない段階から、一緒に考えます。',
  },
  {
    number: '02', title: '必要な支援を考える。', label: '課題の整理・支援内容の検討',
    description: '対話の場を支える通訳か、日々の業務につながる教育か。目的や対象となる方の役割を踏まえ、必要な支援の組み合わせを検討します。',
  },
  {
    number: '03', title: '実際のつながりへ。', label: '支援の実施・振り返り',
    description: '合意した内容に沿って支援を進めます。実際の対話や学習で見えてきた課題を共有し、次に必要な取り組みを考えていきます。',
  },
] as const;
