export const formattedNumber = (n: number, digits: number = 2) => {
  if (!n) return 'Invalid number'
  if (n < 10) digits = 6
  return '$ ' + n.toLocaleString("en-US", { maximumFractionDigits: digits })
}

export const formattedDate = (d: Date | string, locale: Intl.LocalesArgument = "en-US") => {
  if (!d) return 'Invalid date'

  let tmpDate: Date
  /* Convert string timestamp to Date */
  if (typeof d === 'string') tmpDate = new Date(d)
  else tmpDate = d

  return tmpDate.toLocaleDateString(locale, {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
  })
}

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
