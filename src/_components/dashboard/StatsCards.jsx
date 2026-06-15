import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Home,
  Building2,
} from "lucide-react";

const stats = [
  {
    title: "إجمالي الوكالات",
    value: "125",
    change: "+12%",
    changeType: "positive",
    icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "العقارات المنشورة",
    value: "4,320",
    change: "+8.5%",
    changeType: "positive",
    icon: <Home className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "طلبات التواصل",
    value: "1,240",
    change: "+22%",
    changeType: "positive",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "المستخدمون النشطون الآن",
    value: "87",
    change: "-3%",
    changeType: "negative",
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
  },
];

const StatsCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
            {stat.icon}
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold">{stat.value}</div>

            <div className="flex items-center gap-1 text-sm mt-1">
              {stat.changeType === "positive" ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}

              <span
                className={
                  stat.changeType === "positive"
                    ? "text-emerald-500 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {stat.change}
              </span>

              <span className="text-gray-500 text-sm">عن الشهر الماضي</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
