import { Category, Product, Order } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Camisas',
    subcategories: [
      { id: '1a', name: 'Social', categoryId: '1' },
      { id: '1b', name: 'Casual', categoryId: '1' },
      { id: '1c', name: 'Polo', categoryId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Calças',
    subcategories: [
      { id: '2a', name: 'Jeans', categoryId: '2' },
      { id: '2b', name: 'Social', categoryId: '2' },
      { id: '2c', name: 'Sarja', categoryId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Acessórios',
    subcategories: [
      { id: '3a', name: 'Cintos', categoryId: '3' },
      { id: '3b', name: 'Gravatas', categoryId: '3' },
      { id: '3c', name: 'Carteiras', categoryId: '3' },
    ],
  },
  {
    id: '4',
    name: 'Bermudas',
    subcategories: [
      { id: '4a', name: 'Sarja', categoryId: '4' },
      { id: '4b', name: 'Jeans', categoryId: '4' },
    ],
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Camisa Social Slim Ogochi',
    price: 189.90,
    categoryId: '1',
    subcategoryId: '1a',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Branco', hex: '#FFFFFF', inStock: true },
      { name: 'Azul Claro', hex: '#87CEEB', inStock: true },
      { name: 'Rosa', hex: '#FFB6C1', inStock: true },
    ],
    description: 'Camisa social slim fit da Ogochi, tecido premium com acabamento impecável. Ideal para ocasiões formais e ambientes corporativos.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
    featured: true,
  },
  {
    id: '2',
    name: 'Camisa Casual Listrada',
    price: 149.90,
    categoryId: '1',
    subcategoryId: '1b',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Azul Marinho', hex: '#000080', inStock: true },
      { name: 'Verde', hex: '#228B22', inStock: true },
    ],
    description: 'Camisa casual com estampa listrada moderna. Perfeita para o dia a dia com estilo.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
    featured: true,
  },
  {
    id: '3',
    name: 'Calça Jeans Slim',
    price: 219.90,
    categoryId: '2',
    subcategoryId: '2a',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Azul Escuro', hex: '#191970', inStock: true },
      { name: 'Azul Médio', hex: '#4169E1', inStock: true },
      { name: 'Preto', hex: '#000000', inStock: true },
    ],
    description: 'Calça jeans slim fit com lavagem premium. Conforto e elegância para qualquer ocasião.',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&h=800&fit=crop',
    featured: true,
    isNew: true,
  },
  {
    id: '4',
    name: 'Calça Social Alfaiataria',
    price: 259.90,
    categoryId: '2',
    subcategoryId: '2b',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Preto', hex: '#000000', inStock: true },
      { name: 'Cinza', hex: '#808080', inStock: true },
      { name: 'Marinho', hex: '#000080', inStock: true },
    ],
    description: 'Calça social em tecido de alfaiataria com caimento perfeito. Elegância que impressiona.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
    isNew: true,
  },
  {
    id: '5',
    name: 'Cinto Couro Legítimo',
    price: 89.90,
    categoryId: '3',
    subcategoryId: '3a',
    sizes: ['90cm', '100cm', '110cm'],
    colors: [
      { name: 'Preto', hex: '#000000', inStock: true },
      { name: 'Marrom', hex: '#8B4513', inStock: true },
    ],
    description: 'Cinto em couro legítimo com fivela premium. Acabamento de alto padrão.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
  },
  {
    id: '6',
    name: 'Camisa Polo Premium',
    price: 129.90,
    categoryId: '1',
    subcategoryId: '1c',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#000000', inStock: true },
      { name: 'Branco', hex: '#FFFFFF', inStock: true },
      { name: 'Vermelho', hex: '#DC143C', inStock: true },
    ],
    description: 'Polo premium com tecido piquet de alta qualidade. Conforto e sofisticação no casual.',
    image: 'https://images.unsplash.com/photo-1625910513413-5fc08ef11e5b?w=600&h=800&fit=crop',
    featured: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'PED-001',
    items: [
      { product: products[0], quantity: 1, selectedSize: 'M', selectedColor: 'Branco' },
      { product: products[4], quantity: 1, selectedSize: '100cm', selectedColor: 'Preto' },
    ],
    total: 279.80,
    status: 'Pendente',
    createdAt: '2026-02-20T10:30:00',
    buyer: {
      name: 'João Silva',
      email: 'joao@email.com',
      cpf: '123.456.789-00',
      phone: '(14) 99999-0000',
      address: { street: 'Rua das Flores', number: '123', complement: 'Apto 4', neighborhood: 'Centro', city: 'Marília', state: 'SP', cep: '17500-000' },
    },
  },
  {
    id: 'PED-002',
    items: [
      { product: products[2], quantity: 2, selectedSize: '42', selectedColor: 'Azul Escuro' },
    ],
    total: 439.80,
    status: 'Entregue',
    createdAt: '2026-02-18T14:20:00',
    buyer: {
      name: 'Maria Oliveira',
      email: 'maria@email.com',
      cpf: '987.654.321-00',
      phone: '(14) 98888-1111',
      address: { street: 'Av. Brasil', number: '456', complement: '', neighborhood: 'Jardim Paulista', city: 'Marília', state: 'SP', cep: '17501-000' },
    },
  },
];
