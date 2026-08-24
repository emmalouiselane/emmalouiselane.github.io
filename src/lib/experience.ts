const careerStart = new Date(2012, 8, 1);

export function calculateYearsExperience(
  asOf = new Date(),
  startDate = careerStart,
): number {
  return asOf.getFullYear()
    - startDate.getFullYear()
    - (asOf.getMonth() < startDate.getMonth()
      || (asOf.getMonth() === startDate.getMonth() && asOf.getDate() < startDate.getDate())
      ? 1
      : 0);
}
