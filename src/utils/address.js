import { onlyDigits } from '@/utils/card'

export const cities = [
  'Tashkent',
  'Samarkand',
  'Bukhara',
  'Andijan',
  'Namangan',
  'Fergana',
  'Nukus',
  'Karshi',
  'Navoi',
  'Jizzakh',
  'Termez',
  'Urgench',
  'Gulistan'
]

export function formatPhone(value) {
  let digits = onlyDigits(value)

  if (digits.startsWith('998')) {
    digits = digits.slice(3)
  }
  digits = digits.slice(0, 9)

  let result = `+998 ${digits.slice(0, 2)}`
  if (digits.length > 2) {
    result += ` ${digits.slice(2, 5)}`
  }
  if (digits.length > 5) {
    result += ` ${digits.slice(5, 7)}`
  }
  if (digits.length > 7) {
    result += ` ${digits.slice(7, 9)}`
  }
  return result
}

export function validateAddress(address) {
  const errors = {}
  if (address.recipient.trim().length < 2) {
    errors.recipient = 'Enter the recipient name'
  }
  if (onlyDigits(address.phone).length !== 12) {
    errors.phone = 'Enter the full phone number'
  }
  if (!address.street.trim()) {
    errors.street = 'Enter the street'
  }
  if (!address.house.trim()) {
    errors.house = 'Enter the house number'
  }
  return errors
}

export function formatAddress(address) {
  let result = `${address.city}, ${address.street.trim()} ${address.house.trim()}`
  if (address.apartment.trim()) {
    result += `, apt ${address.apartment.trim()}`
  }
  return result
}