import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { setAdminToken } from '@/lib/adminAuth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await api.adminLogin(email, password);
      setAdminToken(token);
      navigate('/admin');
    } catch (err: any) {
      toast({ title: 'Credenciais inválidas', description: 'Verifique seu email e senha.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary">
      <div className="w-full max-w-md rounded-sm border border-border bg-card p-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">DO CARMO <span className="text-accent">MODAS</span></h1>
          <p className="mt-2 text-sm text-muted-foreground">Painel Administrativo</p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@docarmomodas.com" required />
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-gold-dark" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">Use o admin do seu backend (variáveis ADMIN_EMAIL/ADMIN_PASSWORD e seed).</p>
      </div>
    </div>
  );
};

export default AdminLogin;
