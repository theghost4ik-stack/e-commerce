import meta from '@/data/meta.json'

export const MAX_RANK = 5
export const specList = meta.specs

export function getTierLabel(tier) {
  return meta.tiers[tier] || ''
}

export function getScore(product) {
  let sum = 0
  for (const spec of specList) {
    const item = product.specs[spec.key]
    if (item) {
      sum += item.rank
    }
  }
  return Math.round((sum / (specList.length * MAX_RANK)) * 100)
}
