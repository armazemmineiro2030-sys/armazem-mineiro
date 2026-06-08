"use client";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" }[size];
  return (
    <div className={`animate-spin rounded-full border-4 border-marrom-200 border-t-terracota-500 ${s}`} />
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}
