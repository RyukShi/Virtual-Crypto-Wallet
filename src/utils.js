export const formatedNumber = (n, digits) => {
  if (digits === undefined) digits = 2;
  return '$ ' + n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export const isSecurePassword = (password) => {
  if (password.length < 8)
    return [false, 'The password must be at least 8 characters long'];
  if (!/\d/.test(password))
    return [false, 'The password must contain at least one digit'];
  if (!/[A-Z]/.test(password))
    return [false, 'The password must contain at least one uppercase letter'];
  if (!/[a-z]/.test(password))
    return [false, 'The password must contain at least one lowercase letter'];
  if (!/[^A-Za-z0-9]/.test(password))
    return [false, 'The password must contain at least one special character'];

  return [true, 'The password is secure'];
}
