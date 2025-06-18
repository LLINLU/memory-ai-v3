
export const getLevelColor = (level: number) => {
  const colors = [
    { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
    { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
    { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
    { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
    { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800' },
    { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-800' },
    { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-800' },
    { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
    { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
    { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-800' },
  ];
  
  return colors[(level - 1) % colors.length];
};

export const getLevelBadgeStyle = (level: number) => {
  const { bg, text } = getLevelColor(level);
  return `${bg} ${text} font-light`;
};
