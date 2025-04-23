"use client";

interface WordDisplayProps {
  word: string;
  isDrawing: boolean;
}

export default function WordDisplay({ word, isDrawing }: WordDisplayProps) {
  return (
    <div className="mb-4">
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full -translate-x-12 -translate-y-12 opacity-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full translate-x-16 translate-y-16 opacity-20" />
        
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
            {isDrawing ? "You're drawing:" : "Guess the word:"}
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-inner">
            <div className="text-3xl font-mono text-center text-blue-600 dark:text-blue-400 tracking-wider">
              {word}
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
      </div>
    </div>
  );
} 