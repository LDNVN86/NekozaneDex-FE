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
