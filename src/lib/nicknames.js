const ADJECTIVES = ['好奇的', '温暖的', '安静的', '勇敢的', '善良的', '平静的', '睿智的', '温柔的', '快乐的', '自在的']
const NOUNS = ['旅人', '星星', '树叶', '微风', '云朵', '阳光', '月亮', '小鹿', '海浪', '萤火虫']

export function randomNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return adj + noun
}
