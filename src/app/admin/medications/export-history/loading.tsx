export default function ExportHistoryLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100/50">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <div className="text-2xl font-bold text-blue-700">Y tế học đường</div>
        <div className="text-sky-500 mt-2">
          Đang tải dữ liệu, vui lòng chờ...
        </div>
      </div>
    </div>
  );
}
