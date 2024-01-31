export const formattedNumber = (n: number, digits: number = 2) => {
  if (!n) return 'Invalid number'
  if (n < 10) digits = 6
  return '$ ' + n.toLocaleString("en-US", { maximumFractionDigits: digits })
}

export const formattedDate = (d: Date) => {
  if (!d) return 'Invalid date'
  return d.toLocaleDateString("en-US", {
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
