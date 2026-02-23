import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Seu Carrinho</h1>
          <p className="mt-4 text-muted-foreground">Seu carrinho está vazio.</p>
          <Link to="/produtos"><Button className="mt-6 bg-accent text-accent-foreground hover:bg-gold-dark">Ver Produtos</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">Seu Carrinho</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 rounded-sm border border-border bg-card p-4">
                <img src={item.product.image} alt={item.product.name} className="h-24 w-20 rounded-sm object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.selectedSize} · {item.selectedColor}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="h-8 w-8 flex items-center justify-center rounded-sm border border-border hover:border-accent transition-colors"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="h-8 w-8 flex items-center justify-center rounded-sm border border-border hover:border-accent transition-colors"><Plus className="h-3 w-3" /></button>
                    </div>
                    <p className="font-semibold text-foreground">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    <button onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-sm border border-border bg-card p-6 h-fit">
            <h2 className="font-display text-xl font-bold text-foreground">Resumo</h2>
            <div className="mt-4 space-y-2">
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                  <span className="text-foreground">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <Link to="/checkout">
              <Button className="mt-6 w-full bg-accent text-accent-foreground hover:bg-gold-dark py-6 text-sm uppercase tracking-wider">
                Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
