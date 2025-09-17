// src/utils/validators.ts

export type PasswordPolicy = {
  minLength: number
  requireUpper: boolean
  requireLower: boolean
  requireNumber: boolean
  requireSymbol: boolean
  forbidSpaces: boolean
  // opcional: bloquear senhas muito comuns
  blacklist?: string[]
}

export const defaultPasswordPolicy: PasswordPolicy = {
  minLength: 10,             // forte de vdd
  requireUpper: true,
  requireLower: true,
  requireNumber: true,
  requireSymbol: true,
  forbidSpaces: true,
  blacklist: ['123456', 'password', 'qwerty', 'admin', 'senha', 'nspimaua'],
}

export function isValidEmail(email: string): boolean {
  // regex “boa o suficiente” pro lado cliente
  const re =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
  return re.test(email.trim())
}

export type PasswordCheck = {
  valid: boolean
  score: number // 0..5
  errors: string[]
  hints: string[]
}

export function checkPasswordStrength(
  password: string,
  policy: PasswordPolicy = defaultPasswordPolicy
): PasswordCheck {
  const errors: string[] = []
  const hints: string[] = []
  let score = 0

  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/.test(password)
  const hasSpace = /\s/.test(password)

  if (password.length >= policy.minLength) score++
  else errors.push(`Mínimo de ${policy.minLength} caracteres`)

  if (policy.requireUpper) (hasUpper ? score++ : errors.push('Precisa de letra maiúscula (A-Z)'))
  if (policy.requireLower) (hasLower ? score++ : errors.push('Precisa de letra minúscula (a-z)'))
  if (policy.requireNumber) (hasNumber ? score++ : errors.push('Precisa de número (0-9)'))
  if (policy.requireSymbol) (hasSymbol ? score++ : errors.push('Precisa de símbolo (!@#...)'))

  if (policy.forbidSpaces && hasSpace) errors.push('Não use espaços')

  if (policy.blacklist?.some(bad => password.toLowerCase().includes(bad)))
    errors.push('Senha está muito óbvia / comum')

  // hints leves
  if (password.length < policy.minLength + 4) hints.push('Aumente o tamanho (12-16+ é top)')
  if (!(hasUpper && hasLower)) hints.push('Misture maiúsculas e minúsculas')
  if (!hasNumber) hints.push('Inclua números')
  if (!hasSymbol) hints.push('Inclua símbolos')

  return { valid: errors.length === 0, score: Math.min(score, 5), errors, hints }
}

export function validateCredentials(email: string, password: string) {
  const emailOk = isValidEmail(email)
  const pass = checkPasswordStrength(password)
  const problems: string[] = []
  if (!emailOk) problems.push('E-mail inválido')
  if (!pass.valid) problems.push(...pass.errors)
  return {
    valid: emailOk && pass.valid,
    emailOk,
    password: pass,
    problems,
  }
}
