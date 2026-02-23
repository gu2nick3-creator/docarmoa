import { useState } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', cpf: '', phone: '',
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', cep: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.cpf || !form.phone || !form.street || !form.number || !form.neighborhood || !form.city || !form.state || !form.cep) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          selectedColor: i.selectedColor,
        })),
        buyer: {
          name: form.name,
          email: form.email,
          cpf: form.cpf,
          phone: form.phone,
          address: {
            street: form.street,
            number: form.number,
            complement: form.complement,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            cep: form.cep,
          },
        },
      };

      const { checkoutUrl } = await api.checkout(payload);

      toast({ title: 'Redirecionando para o pagamento...', description: 'Você será enviado para o Mercado Pago.' });
      clearCart();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast({ title: 'Erro ao iniciar pagamento', description: 'Confira se o backend e o Mercado Pago estão configurados.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
          <p className="mt-4 text-muted-foreground">Seu carrinho está vazio.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">Checkout</h1>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Dados Pessoais</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Nome *</Label><Input value={form.name} onChange={e => update('name', e.target.value)} /></div>
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div>
              <div><Label>CPF *</Label><Input value={form.cpf} onChange={e => update('cpf', e.target.value)} placeholder="000.000.000-00" /></div>
              <div><Label>Telefone *</Label><Input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(00) 00000-0000" /></div>
            </div>

            <h2 className="font-display text-xl font-semibold text-foreground pt-4">Endereço de Entrega</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Rua *</Label><Input value={form.street} onChange={e => update('street', e.target.value)} /></div>
              <div><Label>Número *</Label><Input value={form.number} onChange={e => update('number', e.target.value)} /></div>
              <div><Label>Complemento</Label><Input value={form.complement} onChange={e => update('complement', e.target.value)} /></div>
              <div><Label>Bairro *</Label><Input value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)} /></div>
              <div><Label>Cidade *</Label><Input value={form.city} onChange={e => update('city', e.target.value)} /></div>
              <div><Label>Estado *</Label><Input value={form.state} onChange={e => update('state', e.target.value)} /></div>
              <div><Label>CEP *</Label><Input value={form.cep} onChange={e => update('cep', e.target.value)} placeholder="00000-000" /></div>
            </div>
          </div>

          {/* Order summary */}
          <div className="rounded-sm border border-border bg-card p-6 h-fit">
            <h2 className="font-display text-xl font-bold text-foreground">Resumo do Pedido</h2>
            <div className="mt-4 space-y-3">
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.product.name} ({item.selectedSize}/{item.selectedColor}) x{item.quantity}</span>
                  <span>R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <Button type="submit" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-gold-dark py-6 text-sm uppercase tracking-wider" disabled={loading}>
              {loading ? 'Abrindo Mercado Pago...' : 'Pagar com Mercado Pago'}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Pagamento seguro via Mercado Pago</p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
