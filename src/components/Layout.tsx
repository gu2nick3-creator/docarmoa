import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Produtos', href: '/produtos' },
];

const Header = () => {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map(l => (
                <Link key={l.href} to={l.href} className="text-lg font-medium text-foreground hover:text-accent transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold tracking-wide text-foreground md:text-2xl">
          DO CARMO <span className="text-accent">MODAS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.href} to={l.href} className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/admin/login">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/carrinho" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold">DO CARMO <span className="text-accent">MODAS</span></h3>
          <p className="mt-2 text-sm text-primary-foreground/70">Elegância e sofisticação para o homem moderno.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Links</h4>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Início</Link>
            <Link to="/produtos" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Produtos</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Contato</h4>
          <p className="mt-3 text-sm text-primary-foreground/70">WhatsApp: (14) 98184-4470</p>
        </div>
      </div>
      <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
        © 2026 Do Carmo Modas. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Layout;
