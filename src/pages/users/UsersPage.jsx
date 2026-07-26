import React from "react";
import { Search, X, UserPlus, Eye, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CustomHeader from "@/customs/CustomHeader";
import CustomPagination from "@/customs/CustomPagination";
import Loading from "@/customs/Loading";
import useSearch from "@/hooks/useSearch/useSearch";
import { useGetAllUsers } from "@/hooks/Actions/users/useCurdsUsers";
import { formatDate } from "@/lib/utils";
import CreateUserModal from "./components/CreateUserModal";

const ROLE_CONFIG = {
  admin: { label: "مدير", variant: "default" },
  employee: { label: "موظف", variant: "secondary" },
};

const UserCardSkeleton = () => (
  <div className="bg-white rounded-xl border shadow-sm p-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
    <div className="mt-3 space-y-2">
      <Skeleton className="h-3.5 w-40" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

const UsersPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 20;
  const [filterRole, setFilterRole] = React.useState("");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = React.useMemo(() => {
    const f = {};
    if (filterRole) f.role = filterRole;
    return f;
  }, [filterRole]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterRole]);

  const { data, isPending, isError, refetch } = useGetAllUsers(page, per_page, filters);

  const rawUsers = data?.data?.data ?? [];
  const pagination = data?.data?.pagination ?? null;

  const users = React.useMemo(() => {
    if (!debouncedSearch) return rawUsers;
    const q = debouncedSearch.toLowerCase();
    return rawUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q),
    );
  }, [rawUsers, debouncedSearch]);

  const handleRoleChange = (value) => {
    setFilterRole(value === "all" ? "" : value);
  };

  if (isPending) {
    return (
      <div>
        <CustomHeader
          title="المستخدمين"
          description="إدارة حسابات المستخدمين في النظام"
          buttonText="مستخدم جديد"
          onButtonClick={() => setCreateModalOpen(true)}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <CustomHeader
        title="المستخدمين"
        description="إدارة حسابات المستخدمين في النظام"
        buttonText="مستخدم جديد"
        onButtonClick={() => setCreateModalOpen(true)}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو البريد الإلكتروني..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <Select value={filterRole} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="كل الأدوار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأدوار</SelectItem>
            <SelectItem value="admin">مدير</SelectItem>
            <SelectItem value="employee">موظف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm font-medium text-destructive mb-2">
              حدث خطأ أثناء تحميل المستخدمين
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              {debouncedSearch || filterRole
                ? "لا يوجد مستخدمين مطابقين لمعايير البحث"
                : "لا يوجد مستخدمين بعد"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {debouncedSearch || filterRole
                ? "حاول تغيير معايير البحث"
                : "قم بإضافة أول مستخدم في النظام"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {users.map((user) => {
              const roleCfg = ROLE_CONFIG[user.role] || {
                label: user.role,
                variant: "outline",
              };
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      {user.name}
                    </h3>
                    {/* <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/users/${user.id}`)}
                      title="عرض"
                    >
                      <Eye className="h-4 w-4" />
                    </Button> */}
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="pt-1">
                      <Badge variant={roleCfg.variant}>{roleCfg.label}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground/80 font-medium pt-1">
                      {user.created_at ? formatDate(user.created_at) : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <CustomPagination
            pagination={pagination}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default UsersPage;
