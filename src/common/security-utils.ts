export const SECURE_PASSWORD_RULES = [
    (v: string) => (v.length >= 10) || 'The password must be at least 10 characters long',
    (v: string) => (/\d/.test(v)) || 'The password must contain at least one digit',
    (v: string) => (/[A-Z]/.test(v)) || 'The password must contain at least one uppercase letter',
    (v: string) => (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(v)) || 'The password must contain at least one special character',
]

export const NOT_BLANK_RULE = [
    (v: string) => (!!v && v.length > 0) || 'Please type something'
]