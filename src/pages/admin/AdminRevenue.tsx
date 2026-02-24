import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const AdminRevenue = () => {
  const token = getAdminToken() || '';

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.adminGetOrders(token),
    enabled: !!token,
    refetchInterval: 20_000,
  });

  const stats = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const list = (orders as any[]).map(o => ({
      total: Number(o.total) || 0,
      status: String(o.status || ''),
      createdAt: new Date(o.createdAt),
      paymentStatus: String(o.paymentStatus || ''),
    }));

    const totalAll = list.reduce((s, o) => s + o.total, 0);
    const totalMonth = list
      .filter(o => o.createdAt.getMonth() === month && o.createdAt.getFullYear() === year)
      .reduce((s, o) => s + o.total, 0);

    const paid = list.filter(o => o.paymentStatus === 'APPROVED').reduce((s, o) => s + o.total, 0);

    const count = list.length;
    const countMonth = list.filter(o => o.createdAt.getMonth() === month && o.createdAt.getFullYear() === year).length;

    return { totalAll, totalMonth, paid, count, countMonth };
  }, [orders]);

  if (isLoading) return <div className="pt-6 text-sm text-muted-foreground">Carregando faturamento...</div>;

  return (
    <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Faturamento (Total)</CardTitle></CardHeader>
        <CardContent><div className="font-display text-2xl font-bold">R$ {stats.totalAll.toFixed(2).replace('.', ',')}</div></CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Faturamento (Mês)</CardTitle></CardHeader>
        <CardContent><div className="font-display text-2xl font-bold">R$ {stats.totalMonth.toFixed(2).replace('.', ',')}</div></CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Pagamentos Aprovados</CardTitle></CardHeader>
        <CardContent><div className="font-display text-2xl font-bold">R$ {stats.paid.toFixed(2).replace('.', ',')}</div></CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Pedidos</CardTitle></CardHeader>
        <CardContent>
          <div className="font-display text-2xl font-bold">{stats.count}</div>
          <div className="text-xs text-muted-foreground">{stats.countMonth} no mês</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenue;
