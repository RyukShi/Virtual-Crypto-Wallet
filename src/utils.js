export const formatedNumber = (n, digits) => {
  if (digits === undefined) digits = 2
  return '$ ' + n.toLocaleString("en-US", { maximumFractionDigits: digits })
}
