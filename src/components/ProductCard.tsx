import { Link } from 'react-router-dom';
import { Product } from '@/types';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link to={`/produto/${product.id}`} className="group block animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Novo
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-base font-semibold text-foreground">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
        <div className="flex gap-1">
          {product.colors.slice(0, 4).map(c => (
            <span
              key={c.name}
              className="h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
