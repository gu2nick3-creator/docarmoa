import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import AdminRevenue from './AdminRevenue';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import { getAdminToken, clearAdminToken } from '@/lib/adminAuth';
import { api } from '@/lib/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    api.adminMe(token)
      .then(() => setChecking(false))
      .catch(() => {
        clearAdminToken();
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Carregando painel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold">DO CARMO <span className="text-accent">MODAS</span></Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Painel Admin</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Sair</Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="revenue">
          <TabsList className="w-full justify-start bg-card">
            <TabsTrigger value="revenue">Faturamento</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue"><AdminRevenue /></TabsContent>
          <TabsContent value="products"><AdminProducts /></TabsContent>
          <TabsContent value="categories"><AdminCategories /></TabsContent>
          <TabsContent value="orders"><AdminOrders /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
