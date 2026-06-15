import React from "react";

const QuickActions = () => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <button className="flex flex-col items-center justify-center p-4 bg-green-100 rounded-xl hover:bg-green-200 transition">
          <span className="text-3xl mb-2">🏠</span>
          <span className="font-semibold text-gray-700">أضف عقار جديد</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-blue-100 rounded-xl hover:bg-blue-200 transition">
          <span className="text-3xl mb-2">👤</span>
          <span className="font-semibold text-gray-700">إنشاء وكالة</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-yellow-100 rounded-xl hover:bg-yellow-200 transition">
          <span className="text-3xl mb-2">💳</span>
          <span className="font-semibold text-gray-700">مراجعة الاشتراكات</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-purple-100 rounded-xl hover:bg-purple-200 transition">
          <span className="text-3xl mb-2">📊</span>
          <span className="font-semibold text-gray-700">تقرير سريع</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
