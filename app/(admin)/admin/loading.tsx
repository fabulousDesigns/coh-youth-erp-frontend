// app/(admin)/admin/loading.tsx and app/(volunteer)/volunteer/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
    </div>
  );
}
