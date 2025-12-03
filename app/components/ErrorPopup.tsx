import React from "react";

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  message,
  onClose,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-xl max-w-sm w-full border-t-4 border-red-500">
        <h2 className="text-xl font-bold text-red-600 mb-3">Error</h2>
        <p className="text-white mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default ErrorPopup;
