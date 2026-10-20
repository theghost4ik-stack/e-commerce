const DIGITS = '0123456789'

export function onlyDigits(value) {
  let result = ''
  for (const char of String(value)) {
    if (DIGITS.includes(char)) {
      result += char
    }
  }
  return result
}

export function formatCardNumber(value) {
  const digits = onlyDigits(value).slice(0, 16)
  let result = ''
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 4 === 0) {
      result += ' '
    }
    result += digits[i]
  }
  return result
}

export function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4)
  if (digits.length <= 2) {
    return digits
  }
  return digits.slice(0, 2) + '/' + digits.slice(2)
}

export function formatCvv(value) {
  return onlyDigits(value).slice(0, 3)
}

export function getLast4(number) {
  return onlyDigits(number).slice(-4)
}

export function isExpiryValid(value) {
  if (value.length !== 5 || value[2] !== '/') {
    return false
  }
  const month = Number(value.slice(0, 2))
  const year = 2000 + Number(value.slice(3))
  if (month < 1 || month > 12) {
    return false
  }
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export function validateCard(card) {
  const errors = {}
  if (card.holder.trim().length < 3) {
    errors.holder = 'Enter the name on the card'
  }
  if (onlyDigits(card.number).length !== 16) {
    errors.number = 'Card number must have 16 digits'
  }
  if (!isExpiryValid(card.expiry)) {
    errors.expiry = 'Use a valid MM/YY'
  }
  if (onlyDigits(card.cvv).length !== 3) {
    errors.cvv = '3 digits required'
  }
  return errors
}
