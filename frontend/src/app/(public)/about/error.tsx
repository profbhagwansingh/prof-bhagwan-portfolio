"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("About Page Error:", error);
  }, [error]);

  return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong in About page!</h2>
      <p className="mb-4 text-gray-700">{error.message}</p>
      <pre className="text-left bg-gray-100 p-4 rounded text-sm overflow-auto max-w-4xl mx-auto text-black">
        {error.stack}
      </pre>
      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-primary-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
