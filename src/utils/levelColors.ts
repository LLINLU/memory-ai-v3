
export const getLevelColors = (level: number) => {
  const colors = [
    "bg-slate-200 border-slate-400 text-slate-900", // Root node (level 0)
    "bg-blue-100 border-blue-300 text-blue-800", // Level 1
    "bg-green-100 border-green-300 text-green-800", // Level 2
    "bg-purple-100 border-purple-300 text-purple-800", // Level 3
    "bg-orange-100 border-orange-300 text-orange-800", // Level 4
    "bg-pink-100 border-pink-300 text-pink-800", // Level 5
    "bg-indigo-100 border-indigo-300 text-indigo-800", // Level 6
    "bg-yellow-100 border-yellow-300 text-yellow-800", // Level 7
    "bg-red-100 border-red-300 text-red-800", // Level 8
    "bg-teal-100 border-teal-300 text-teal-800", // Level 9
    "bg-gray-100 border-gray-300 text-gray-800", // Level 10
  ];
  return colors[level] || colors[colors.length - 1];
};

export const getLevelBadgeClasses = (level: number) => {
  // Convert the mindmap colors to badge-appropriate styling
  const levelColors = getLevelColors(level);
  return `${levelColors} border`;
};
