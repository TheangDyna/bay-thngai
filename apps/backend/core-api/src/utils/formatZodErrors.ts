import { z } from "zod";

export const formatZodErrors = (errors: z.ZodError["issues"]) => {
  return errors.map((error) => {
    const fieldPath = error.path.join(".");

    switch (error.code) {
      case z.ZodIssueCode.invalid_type:
        return `Field '${fieldPath}' expected ${error.expected} but received ${error.received}.`;

      case z.ZodIssueCode.unrecognized_keys:
        return `Unrecognized key(s) '${error.keys.join(", ")}' in '${fieldPath}'.`;

      case z.ZodIssueCode.invalid_union:
        return `Field '${fieldPath}' must match one of the allowed types.`;

      case z.ZodIssueCode.invalid_enum_value:
        return `Field '${fieldPath}' must be one of [${error.options.join(", ")}].`;

      case z.ZodIssueCode.invalid_arguments:
        return `Invalid arguments provided in '${fieldPath}': ${error.argumentsError.message}.`;

      case z.ZodIssueCode.invalid_return_type:
        return `Invalid return type in '${fieldPath}': ${error.returnTypeError.message}.`;

      case z.ZodIssueCode.invalid_date:
        return `Field '${fieldPath}' must be a valid date.`;

      case z.ZodIssueCode.invalid_string:
        return `Field '${fieldPath}' must be a valid ${error.validation}.`;

      case z.ZodIssueCode.too_small:
        if (
          (error.type === "string" || error.type === "array") &&
          error.minimum === 1
        ) {
          return `Field '${fieldPath}' is required.`;
        }
        return `Field '${fieldPath}' must be ${
          error.exact
            ? `exactly`
            : error.inclusive
              ? `at least`
              : `greater than`
        } ${error.minimum}.`;

      case z.ZodIssueCode.too_big:
        return `Field '${fieldPath}' must be ${
          error.exact ? `exactly` : error.inclusive ? `at most` : `less than`
        } ${error.maximum}.`;

      case z.ZodIssueCode.not_multiple_of:
        return `Field '${fieldPath}' must be a multiple of ${error.multipleOf}.`;

      case z.ZodIssueCode.custom:
        return `Field '${fieldPath}': ${error.message}`;

      default:
        return `Field '${fieldPath}' has an unknown error: ${error.message}.`;
    }
  });
};
