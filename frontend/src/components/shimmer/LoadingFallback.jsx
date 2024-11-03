export default function LoadingFallback() {
  return (
    <div className="w-full space-y-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border rounded-lg space-x-4 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gray-300 h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 w-[200px]" />
              <div className="bg-gray-300 h-4 w-[100px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-300 h-4 w-[100px]" />
            <div className="bg-gray-300 h-4 w-[80px]" />
            <div className="bg-gray-300 h-4 w-[40px]" />
            <div className="bg-gray-300 h-9 w-[60px] rounded-md" />
            <div className="bg-gray-300 h-6 w-11 rounded-full" />
          </div>
        </div>
      ))}
      <div className="flex justify-center py-4">
        <div className="bg-gray-300 h-10 w-24 rounded" />
      </div>
    </div>
  );
}
