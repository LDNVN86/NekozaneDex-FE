export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateRequired(
  value: string | undefined | null,
  minLength = 1
): string | null {
  if (!value || value.trim().length < minLength) {
    return minLength === 1
      ? "Không được để trống"
      : `Phải có ít nhất ${minLength} ký tự`;
  }
  return null;
}

export function validateMaxLength(
  value: string | undefined | null,
  maxLength: number
): string | null {
  if (value && value.length > maxLength) {
    return `Không được vượt quá ${maxLength} ký tự`;
  }
  return null;
}

export function validateUrl(
  value: string | undefined | null,
  fieldName = "URL"
): string | null {
  if (value && !isValidUrl(value)) {
    return `${fieldName} không hợp lệ`;
  }
  return null;
}

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

export interface FormStateBase<T> {
  success: boolean;
  message?: string;
  fieldErrors?: ValidationErrors<T>;
  values?: T;
}

export function createFormState<T>(
  success: boolean,
  options?: {
    message?: string;
    errors?: ValidationErrors<T>;
    values?: T;
  }
): FormStateBase<T> {
  return {
    success,
    message: options?.message,
    fieldErrors: options?.errors,
    values: options?.values,
  };
}

export function createValidationError<T>(
  errors: ValidationErrors<T>,
  values?: T
): FormStateBase<T> {
  return createFormState(false, {
    message: "Vui lòng kiểm tra lại thông tin",
    errors,
    values,
  });
}

export function createSuccessState<T>(message?: string): FormStateBase<T> {
  return createFormState(true, { message });
}

export function createErrorState<T>(
  message: string,
  values?: T
): FormStateBase<T> {
  return createFormState(false, { message, values });
}
