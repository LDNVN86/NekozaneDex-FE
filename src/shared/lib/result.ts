export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

export const err = <E = string>(error: E): Result<never, E> => ({
  success: false,
  error,
});

export const isOk = <T, E>(
  result: Result<T, E>
): result is { success: true; data: T } => result.success;

export const isErr = <T, E>(
  result: Result<T, E>
): result is { success: false; error: E } => !result.success;

export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.success) {
    return result.data;
  }
  throw new Error(String(result.error));
};

export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (result.success) {
    return result.data;
  }
  return defaultValue;
};
