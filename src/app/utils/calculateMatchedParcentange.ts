export const calculateMatchPercentaged = (base: string[], target: string[]) => {
  const baseSet = new Set(base)
  const targetSet = new Set(target)

  const common = [...baseSet].filter(b => targetSet.has(b)).length
  return common === 0 ? 0 : Math.round((common / baseSet.size) * 100);
}