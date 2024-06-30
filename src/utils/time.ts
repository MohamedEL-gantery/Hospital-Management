import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsTimeConstraint implements ValidatorConstraintInterface {
  validate(time: any, args: ValidationArguments) {
    return (
      typeof time === 'string' &&
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(time)
    ); // Regex to validate HH:mm or HH:mm:ss
  }

  defaultMessage(args: ValidationArguments) {
    return 'Time must be in the format HH:mm or HH:mm:ss';
  }
}

export function IsTime(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeConstraint,
    });
  };
}
