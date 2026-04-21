import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import {
  useProducts, useCategories,
  useCreateProduct, useUpdateProduct, useDeleteProduct,
  useCreateCategory, useUpdateCategory, useDeleteCategory,
} from '@/hooks/use-products';
import { Plus, Trash2, FolderPlus, Pencil, X, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import DriveImageUpload from '@/components/DriveImageUpload';

const EMPTY_PROD = { name: '', price: 0, description: '', imageUrl: '', categoryId: undefined as number | undefined, inStock: true, discount: 0 };
const EMPTY_CAT = { name: '', description: '' };

export default function AdminProducts() {
  const { data: products, isLoading: prodLoad } = useProducts();
  const { data: categories } = useCategories();

  const createProduct  = useCreateProduct();
  const updateProduct  = useUpdateProduct();
  const deleteProduct  = useDeleteProduct();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Product form state
  const [prodMode, setProdMode] = useState<'create' | 'edit' | null>(null);
  const [editingProdId, setEditingProdId] = useState<number | null>(null);
  const [prodData, setProdData] = useState(EMPTY_PROD);
  const [prodError, setProdError] = useState('');

  // Category panel state
  const [catPanelOpen, setCatPanelOpen] = useState(false);
  const [catMode, setCatMode] = useState<'create' | 'edit' | null>(null);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [catData, setCatData] = useState(EMPTY_CAT);
  const [catError, setCatError] = useState('');

  // ─── Product handlers ───────────────────────────────────────────
  function openCreate() {
    setProdData(EMPTY_PROD);
    setEditingProdId(null);
    setProdMode('create');
    setProdError('');
  }

  function openEdit(prod: any) {
    setProdData({
      name: prod.name,
      price: Number(prod.price),
      description: prod.description,
      imageUrl: prod.imageUrl || '',
      categoryId: prod.categoryId || undefined,
      inStock: prod.inStock,
      discount: Number(prod.discount) || 0,
    });
    setEditingProdId(prod.id);
    setProdMode('edit');
    setProdError('');
  }

  function closeProductForm() {
    setProdMode(null);
    setEditingProdId(null);
    setProdData(EMPTY_PROD);
    setProdError('');
  }

  async function handleProdSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProdError('');
    try {
      if (prodMode === 'edit' && editingProdId !== null) {
        await updateProduct.mutateAsync({ id: editingProdId, data: prodData });
      } else {
        await createProduct.mutateAsync(prodData);
      }
      closeProductForm();
    } catch {
      setProdError('Failed to save product. Please try again.');
    }
  }

  // ─── Category handlers ──────────────────────────────────────────
  function openCatCreate() {
    setCatData(EMPTY_CAT);
    setEditingCatId(null);
    setCatMode('create');
    setCatError('');
  }

  function openCatEdit(cat: any) {
    setCatData({ name: cat.name, description: cat.description || '' });
    setEditingCatId(cat.id);
    setCatMode('edit');
    setCatError('');
  }

  function closeCatForm() {
    setCatMode(null);
    setEditingCatId(null);
    setCatData(EMPTY_CAT);
    setCatError('');
  }

  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCatError('');
    try {
      if (catMode === 'edit' && editingCatId !== null) {
        await updateCategory.mutateAsync({ id: editingCatId, data: catData });
      } else {
        await createCategory.mutateAsync(catData);
      }
      closeCatForm();
    } catch {
      setCatError('Failed to save category. Please try again.');
    }
  }

  async function handleDeleteCategory(id: number, name: string) {
    if (!confirm(`Delete category "${name}"? Products in this category will become uncategorised.`)) return;
    try {
      await deleteCategory.mutateAsync(id);
      if (editingCatId === id) closeCatForm();
    } catch {
      alert('Failed to delete category.');
    }
  }

  const isProdPending = createProduct.isPending || updateProduct.isPending;
  const isCatPending  = createCategory.isPending || updateCategory.isPending;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products & Categories</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setCatPanelOpen(p => !p); closeCatForm(); }}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Tag className="w-4 h-4" />
            Categories
            {catPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={openCreate} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800">
            <Plus className="w-4 h-4" /> Product
          </button>
        </div>
      </div>

      {/* ─── Categories Panel ─────────────────────────────────────── */}
      {catPanelOpen && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-500" /> Product Categories
            </h2>
            <button
              onClick={openCatCreate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg font-medium transition-colors"
            >
              <FolderPlus className="w-4 h-4" /> Add Category
            </button>
          </div>

          {/* Category add/edit form */}
          {catMode !== null && (
            <div className="px-6 py-4 border-b border-gray-100 bg-purple-50/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-gray-700">
                  {catMode === 'edit' ? `Editing: ${catData.name}` : 'New Category'}
                </h3>
                <button onClick={closeCatForm}><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <form onSubmit={handleCatSubmit} className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    value={catData.name}
                    onChange={e => setCatData({ ...catData, name: e.target.value })}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    value={catData.description}
                    onChange={e => setCatData({ ...catData, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={isCatPending} className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 disabled:opacity-50">
                    {isCatPending ? 'Saving...' : catMode === 'edit' ? 'Update' : 'Save'}
                  </button>
                  <button type="button" onClick={closeCatForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                </div>
                {catError && <p className="w-full text-xs text-red-500">{catError}</p>}
              </form>
            </div>
          )}

          {/* Category list */}
          {!categories || categories.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">No categories yet.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((cat: any) => (
                <li key={cat.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 group">
                  <div>
                    <span className="font-medium text-gray-800 text-sm">{cat.name}</span>
                    {cat.description && <span className="text-gray-400 text-xs ml-3">{cat.description}</span>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openCatEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit category"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ─── Product form ─────────────────────────────────────────── */}
      {prodMode !== null && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{prodMode === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
            <button onClick={closeProductForm}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={handleProdSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input required className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-300" value={prodData.name} onChange={e => setProdData({ ...prodData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number" step="0.01" min="0" required
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={prodData.price || ''}
                onChange={e => setProdData({ ...prodData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={prodData.categoryId || ''}
                onChange={e => setProdData({ ...prodData, categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
              >
                <option value="">No category</option>
                {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount (%) <span className="text-gray-400 font-normal">— set 0 for no discount</span>
              </label>
              <input
                type="number" min="0" max="99" step="1"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={prodData.discount}
                onChange={e => setProdData({ ...prodData, discount: Math.min(99, Math.max(0, parseInt(e.target.value) || 0)) })}
                placeholder="e.g. 30 for 30% off"
              />
              {prodData.discount > 0 && prodData.price > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  MRP shown: <span className="line-through">₹{Math.round(prodData.price / (1 - prodData.discount / 100)).toLocaleString('en-IN')}</span>
                  {' '}→ Sale: ₹{Number(prodData.price).toLocaleString('en-IN')}
                </p>
              )}
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={prodData.inStock} onChange={e => setProdData({ ...prodData, inStock: e.target.checked })} className="w-5 h-5 rounded" />
                <span className="font-medium">In Stock</span>
              </label>
            </div>
            <div className="col-span-2">
              <DriveImageUpload
                label="Product Images"
                value={prodData.imageUrl}
                onChange={url => setProdData({ ...prodData, imageUrl: url })}
                folderPath={["products", prodData.name || "product"]}
                multiple
                placeholder="https://res.cloudinary.com/... or any image URL (comma-separated)"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea required rows={2} className="w-full border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300" value={prodData.description} onChange={e => setProdData({ ...prodData, description: e.target.value })} />
            </div>
            {prodError && (
              <div className="col-span-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
                {prodError}
              </div>
            )}
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={closeProductForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              <button type="submit" disabled={isProdPending} className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-50">
                {isProdPending ? 'Saving...' : prodMode === 'edit' ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Products table ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-500">Product</th>
              <th className="p-4 font-medium text-gray-500">Category</th>
              <th className="p-4 font-medium text-gray-500">Price / Discount</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prodLoad ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-400">Loading...</td></tr>
            ) : products?.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No products yet. Add your first product.</td></tr>
            ) : products?.map((prod: any) => (
              <tr key={prod.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border bg-gray-50 overflow-hidden shrink-0">
                      {prod.imageUrl && <img src={prod.imageUrl.split(',')[0].trim()} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
                    </div>
                    <span className="truncate max-w-[160px]">{prod.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{prod.categoryName || '—'}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">₹{Number(prod.price).toLocaleString('en-IN')}</div>
                  {Number(prod.discount) > 0 && (
                    <div className="text-xs text-red-500 font-semibold">{prod.discount}% OFF</div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${prod.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {prod.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => openEdit(prod)} className="p-2 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete this product?')) deleteProduct.mutateAsync(prod.id); }} className="p-2 text-gray-400 hover:text-red-500 rounded hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
