import { Loader2 } from "lucide-react";

interface SkyLoadingProps {
  message?: string;
}

export function SkyLoading({ message = "Đang tải..." }: SkyLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-sky-200 rounded-full animate-spin border-t-sky-500"></div>
        <Loader2 className="w-6 h-6 text-sky-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-sky-600 font-medium animate-pulse">{message}</p>
    </div>
  );
}
