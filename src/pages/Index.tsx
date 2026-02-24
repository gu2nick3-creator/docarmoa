import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const Index = () => {
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories });
  const { data: featured = [] } = useQuery({ queryKey: ['products', 'featured'], queryFn: () => api.getProducts({ featured: true }) });
  const { data: newProducts = [] } = useQuery({ queryKey: ['products', 'new'], queryFn: () => api.getProducts({ isNew: true }) });

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-primary">
        <img src="/images/vitrine.png" alt="Vitrine Do Carmo Modas" className="absolute inset-0 h-full w-full object-cover object-top opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="relative z-10 container text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Coleção 2026</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-primary-foreground md:text-6xl lg:text-7xl">
            Vista-se com<br />
            <span className="text-accent">Elegância</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
            Descubra peças selecionadas que combinam sofisticação e conforto para o homem moderno.
          </p>
          <Link to="/produtos">
            <Button className="mt-8 bg-accent text-accent-foreground hover:bg-gold-dark px-8 py-6 text-sm uppercase tracking-wider">
              Ver Coleção <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Destaques */}
      <section className="container py-16">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Seleção Especial</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Mais Vendidos</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-8">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Ogochi Section */}
      <section className="bg-primary py-16">
        <div className="container text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Marca Oficial</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Nós vendemos <span className="text-accent">Ogochi</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">
            Tradição, qualidade e elegância. Encontre as melhores peças da Ogochi aqui na Do Carmo Modas.
          </p>
          <Link to="/produtos">
            <Button variant="outline" className="mt-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-6 text-sm uppercase tracking-wider">
              Explorar Ogochi
            </Button>
          </Link>
        </div>
      </section>

      {/* Novidades */}
      {newProducts.length > 0 && (
        <section className="container py-16">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Recém Chegados</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Novidades</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-8">
            {newProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Categorias */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">Categorias</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/produtos?category=${cat.id}`}
                className="group flex flex-col items-center justify-center rounded-sm border border-border bg-card p-8 transition-all hover:border-accent hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {cat.subcategories.length} subcategorias
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
