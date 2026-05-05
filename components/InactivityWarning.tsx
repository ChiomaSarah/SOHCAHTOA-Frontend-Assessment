import { InactivityWarningProps } from "@/interface";

export default function InactivityWarning({
  secondsLeft,
  onStayActive,
}: InactivityWarningProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
            <span className="text-2xl">⏱</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Still there?
            </h2>
            <p className="text-sm text-gray-500">
              You have been inactive for a while and will be logged out in{" "}
              <span className="font-semibold text-orange-500">
                {secondsLeft}s
              </span>{" "}
              due to inactivity.
            </p>
          </div>
          <button
            onClick={onStayActive}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
          >
            Keep me logged in
          </button>
        </div>
      </div>
    </div>
  );
}
