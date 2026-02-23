import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const AdminOrders = () => {
  const token = getAdminToken() || '';
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.adminGetOrders(token),
    enabled: !!token,
    refetchInterval: 20_000,
  });

  const updateStatus = useMutation({
    mutationFn: (vars: { id: string; status: OrderStatus }) => api.adminUpdateOrderStatus(token, vars.id, vars.status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Status do pedido atualizado!' });
    },
    onError: () => toast({ title: 'Erro ao atualizar pedido', variant: 'destructive' }),
  });

  const rows = useMemo(() => orders as any as (Order & { paymentStatus: string })[], [orders]);

  if (isLoading) return <div className="pt-6 text-sm text-muted-foreground">Carregando pedidos...</div>;

  return (
    <div className="space-y-6 pt-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Pedidos</h2>
      <div className="rounded-sm border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>R$ {o.total.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell className="text-xs">
                  {o.paymentStatus}
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    o.status === 'Finalizado' ? 'bg-green-100 text-green-800' :
                    o.status === 'Entregue' ? 'bg-blue-100 text-blue-800' :
                    o.status === 'Cancelado' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{o.status}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Select value={o.status} onValueChange={(v: OrderStatus) => updateStatus.mutate({ id: o.id, status: v })}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Entregue">Entregue</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(o.id)}>Copiar</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
