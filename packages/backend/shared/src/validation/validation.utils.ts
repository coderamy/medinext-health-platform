import { isEmail, isMobilePhone, isUUID, registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Validates that a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  return isEmail(email);
}

/**
 * Validates that a string is a valid mobile phone number
 */
export function isValidMobilePhone(phone: string, locale: 'en-US' | 'en-GB' = 'en-US'): boolean {
  try {
    return isMobilePhone(phone, locale) as boolean;
  } catch {
    return false;
  }
}

/**
 * Validates that a string is a valid UUID
 */
export function isValidUUID(id: string): boolean {
  return isUUID(id) as boolean;
}

/**
 * Custom decorator for validating National ID
 */
export function IsNationalId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (typeof value !== 'string') return false;
          // National ID validation logic (country-specific)
          // Example: 13 digits for some countries
          return /^\d{13}$/.test(value) || /^[A-Z0-9]{10,20}$/.test(value);
        },
        defaultMessage(): string {
          return 'Invalid National ID format';
        },
      },
    });
  };
}

/**
 * Custom decorator for validating age
 */
export function IsMinimumAge(minAge: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (typeof value !== 'number') return false;
          return value >= minAge;
        },
        defaultMessage(): string {
          return `Minimum age must be ${minAge} years`;
        },
      },
    });
  };
}

/**
 * Validates date of birth for minimum age
 */
export function isValidAgeForRegistration(dateOfBirth: Date, minAge: number): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= minAge;
}
