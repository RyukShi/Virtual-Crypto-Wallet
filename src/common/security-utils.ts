export const SECURE_PASSWORD_RULES_VALIDATIONS = [
    (v: string) => (v.length >= 10) || 'The password must be at least 10 characters long',
    (v: string) => (/\d/.test(v)) || 'The password must contain at least one digit',
    (v: string) => (/[A-Z]/.test(v)) || 'The password must contain at least one uppercase letter',
    (v: string) => (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(v)) || 'The password must contain at least one special character',
]