import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const AdminCategories = () => {
  const token = getAdminToken() || '';
  const qc = useQueryClient();
  const { toast } = useToast();
  const [newCatName, setNewCatName] = useState('');
  const [newSubNames, setNewSubNames] = useState<Record<string, string>>({});

  const { data: catList = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.adminGetCategories(token),
    enabled: !!token,
  });

  const createCategory = useMutation({
    mutationFn: (name: string) => api.adminCreateCategory(token, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Categoria criada com sucesso!' });
    },
    onError: () => toast({ title: 'Erro ao criar categoria', variant: 'destructive' }),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.adminDeleteCategory(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Categoria excluída.' });
    },
    onError: () => toast({ title: 'Erro ao excluir categoria', variant: 'destructive' }),
  });

  const createSubcategory = useMutation({
    mutationFn: (vars: { catId: string; name: string }) => api.adminCreateSubcategory(token, vars.catId, vars.name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Subcategoria criada!' });
    },
    onError: () => toast({ title: 'Erro ao criar subcategoria', variant: 'destructive' }),
  });

  const deleteSubcategory = useMutation({
    mutationFn: (subId: string) => api.adminDeleteSubcategory(token, subId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Subcategoria excluída.' });
    },
    onError: () => toast({ title: 'Erro ao excluir subcategoria', variant: 'destructive' }),
  });

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    createCategory.mutate(name);
    setNewCatName('');
  };

  const addSub = (catId: string) => {
    const name = (newSubNames[catId] || '').trim();
    if (!name) return;
    createSubcategory.mutate({ catId, name });
    setNewSubNames(prev => ({ ...prev, [catId]: '' }));
  };

  if (isLoading) return <div className="pt-6 text-sm text-muted-foreground">Carregando categorias...</div>;

  return (
    <div className="space-y-6 pt-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Categorias</h2>

      <div className="flex gap-2">
        <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nome da nova categoria" className="max-w-xs" onKeyDown={e => e.key === 'Enter' && addCategory()} />
        <Button onClick={addCategory} className="bg-accent text-accent-foreground hover:bg-gold-dark" disabled={createCategory.isPending}>
          <Plus className="mr-2 h-4 w-4" /> Criar Categoria
        </Button>
      </div>

      <div className="space-y-4">
        {catList.map((cat: Category) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">{cat.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => deleteCategory.mutate(cat.id)} disabled={deleteCategory.isPending}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {cat.subcategories.map(sub => (
                <div key={sub.id} className="flex items-center justify-between rounded-sm border border-border px-4 py-2">
                  <span className="flex items-center gap-2 text-sm"><ChevronRight className="h-3 w-3 text-accent" /> {sub.name}</span>
                  <button onClick={() => deleteSubcategory.mutate(sub.id)} disabled={deleteSubcategory.isPending}>
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newSubNames[cat.id] || ''}
                  onChange={e => setNewSubNames(prev => ({ ...prev, [cat.id]: e.target.value }))}
                  placeholder="Nova subcategoria"
                  className="max-w-xs"
                  onKeyDown={e => e.key === 'Enter' && addSub(cat.id)}
                />
                <Button variant="outline" size="sm" onClick={() => addSub(cat.id)} disabled={createSubcategory.isPending}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
