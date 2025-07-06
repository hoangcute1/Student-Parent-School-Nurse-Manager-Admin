// Mapping loại thắc mắc với icon và màu sắc
export const feedbackCategories = {
  illness: {
    label: "Bệnh tật",
    icon: "🩺",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  nutrition: {
    label: "Dinh dưỡng",
    icon: "🍎",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  medicine: {
    label: "Thuốc",
    icon: "�",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  environment: {
    label: "Môi trường",
    icon: "🌍",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  vaccine: {
    label: "Vaccine",
    icon: "💉",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  mental: {
    label: "Tâm lý",
    icon: "🧠",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  development: {
    label: "Phát triển",
    icon: "📈",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  prevention: {
    label: "Phòng chống",
    icon: "🛡️",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  general: {
    label: "Chung",
    icon: "�",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  emergency: {
    label: "Khẩn cấp",
    icon: "🚨",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  other: {
    label: "Khác",
    icon: "❓",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export const getCategoryInfo = (category?: string) => {
  if (
    !category ||
    !feedbackCategories[category as keyof typeof feedbackCategories]
  ) {
    return feedbackCategories.other;
  }
  return feedbackCategories[category as keyof typeof feedbackCategories];
};

export const getCategoryLabel = (category?: string) => {
  const info = getCategoryInfo(category);
  return `${info.icon} ${info.label}`;
};
