import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product, ProductColor, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const emptyProduct = (): Partial<Product> => ({
  name: '',
  price: 0,
  categoryId: '',
  subcategoryId: '',
  sizes: [],
  colors: [],
  description: '',
  image: '',
  featured: false,
  isNew: false,
});

const AdminProducts = () => {
  const token = getAdminToken() || '';
  const qc = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(emptyProduct());
  const [sizeInput, setSizeInput] = useState('');
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.adminGetCategories(token),
    enabled: !!token,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.adminGetProducts(token),
    enabled: !!token,
  });

  const subcategories = useMemo(() => {
    if (!form.categoryId) return [];
    return (categories as Category[]).find(c => c.id === form.categoryId)?.subcategories || [];
  }, [categories, form.categoryId]);

  const createProduct = useMutation({
    mutationFn: (p: Partial<Product>) => api.adminCreateProduct(token, p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Produto cadastrado com sucesso!' });
    },
    onError: () => toast({ title: 'Erro ao cadastrar produto', variant: 'destructive' }),
  });

  const updateProduct = useMutation({
    mutationFn: (vars: { id: string; p: Partial<Product> }) => api.adminUpdateProduct(token, vars.id, vars.p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Produto atualizado com sucesso!' });
    },
    onError: () => toast({ title: 'Erro ao atualizar produto', variant: 'destructive' }),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => api.adminDeleteProduct(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Produto excluído.' });
    },
    onError: () => toast({ title: 'Erro ao excluir produto', variant: 'destructive' }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct());
    setOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setOpen(true);
  };

  const addSize = () => {
    const s = sizeInput.trim();
    if (s && !form.sizes?.includes(s)) {
      setForm(prev => ({ ...prev, sizes: [...(prev.sizes || []), s] }));
      setSizeInput('');
    }
  };

  const removeSize = (s: string) => setForm(prev => ({ ...prev, sizes: prev.sizes?.filter(x => x !== s) }));

  const addColor = () => {
    const name = colorName.trim();
    if (name && !form.colors?.find(c => c.name === name)) {
      setForm(prev => ({ ...prev, colors: [...(prev.colors || []), { name, hex: colorHex, inStock: true } as ProductColor] }));
      setColorName('');
      setColorHex('#000000');
    }
  };

  const removeColor = (name: string) => setForm(prev => ({ ...prev, colors: prev.colors?.filter(c => c.name !== name) }));

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.adminUpload(token, file);
      setForm(p => ({ ...p, image: url }));
      toast({ title: 'Imagem enviada!' });
    } catch {
      toast({ title: 'Erro ao enviar imagem', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.categoryId || !form.image) {
      toast({ title: 'Preencha os campos obrigatórios (Nome, Preço, Categoria, Imagem)', variant: 'destructive' });
      return;
    }

    const payload: Partial<Product> = {
      ...form,
      price: Number(form.price),
      subcategoryId: form.subcategoryId || '',
      sizes: form.sizes || [],
      colors: form.colors || [],
      description: form.description || '',
    };

    if (editing) updateProduct.mutate({ id: editing.id, p: payload });
    else createProduct.mutate(payload);

    setOpen(false);
  };

  const filtered = useMemo(() => {
    return (products as Product[]).filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCat && p.categoryId !== filterCat) return false;
      return true;
    });
  }, [products, search, filterCat]);

  if (isLoading) return <div className="pt-6 text-sm text-muted-foreground">Carregando produtos...</div>;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Produtos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-accent text-accent-foreground hover:bg-gold-dark"><Plus className="mr-2 h-4 w-4" /> Criar Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Editar Produto' : 'Novo Produto'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Nome *</Label><Input value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>Preço *</Label><Input type="number" step="0.01" value={form.price ?? 0} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} /></div>

                <div>
                  <Label>Categoria *</Label>
                  <Select value={form.categoryId || ''} onValueChange={v => setForm(p => ({ ...p, categoryId: v, subcategoryId: '' }))}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      {(categories as Category[]).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subcategoria</Label>
                  <Select value={form.subcategoryId || ''} onValueChange={v => setForm(p => ({ ...p, subcategoryId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {subcategories.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Imagem */}
              <div className="space-y-2">
                <Label>Imagem *</Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input value={form.image || ''} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="URL da imagem (ou envie um arquivo abaixo)" />
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleUpload(e.target.files?.[0])}
                    />
                    <Button type="button" variant="outline" className="gap-2" disabled={uploading}>
                      <Upload className="h-4 w-4" /> {uploading ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </label>
                </div>
                {form.image ? (
                  <img src={form.image} alt="preview" className="h-40 w-40 rounded-sm border border-border object-cover" />
                ) : null}
              </div>

              <div><Label>Descrição</Label><Textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={!!form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                  <Label className="text-sm">Destaque</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={!!form.isNew} onChange={e => setForm(p => ({ ...p, isNew: e.target.checked }))} />
                  <Label className="text-sm">Novo</Label>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <Label>Tamanhos</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="Ex: M" className="w-24" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} />
                  <Button type="button" variant="outline" size="sm" onClick={addSize}>Adicionar</Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.sizes?.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-1 text-xs">
                      {s} <button onClick={() => removeSize(s)}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <Label>Cores em Estoque</Label>
                <div className="flex gap-2 mt-1 items-end">
                  <div><Label className="text-xs">Nome</Label><Input value={colorName} onChange={e => setColorName(e.target.value)} placeholder="Preto" className="w-28" /></div>
                  <div><Label className="text-xs">Cor</Label><input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} className="h-10 w-10 cursor-pointer rounded border border-border" /></div>
                  <Button type="button" variant="outline" size="sm" onClick={addColor}>Adicionar</Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.colors?.map(c => (
                    <span key={c.name} className="inline-flex items-center gap-2 rounded-sm border border-border px-2 py-1 text-xs">
                      <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: c.hex }} /> {c.name}
                      <button onClick={() => removeColor(c.name)}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-dark" disabled={createProduct.isPending || updateProduct.isPending}>
                {editing ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..." className="max-w-xs" />
        <Select value={filterCat} onValueChange={v => setFilterCat(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {(categories as Category[]).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-sm border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Cores</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>R$ {p.price.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>{(categories as Category[]).find(c => c.id === p.categoryId)?.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">{p.colors.map(c => <span key={c.name} className="h-4 w-4 rounded-full border" style={{ backgroundColor: c.hex }} title={c.name} />)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProduct.mutate(p.id)} disabled={deleteProduct.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;
