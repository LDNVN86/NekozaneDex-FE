"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2>Đã có lỗi xảy ra!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Thử lại</button>
    </div>
  );
}
