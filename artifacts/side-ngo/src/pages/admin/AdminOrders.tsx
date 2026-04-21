import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useOrders } from '@/hooks/use-orders';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Trash2, ChevronDown, Package, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { apiUrl } from '@/lib/api';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: 'Pending',    bg: 'bg-orange-100', text: 'text-orange-700' },
  confirmed:  { label: 'Confirmed',  bg: 'bg-blue-100',   text: 'text-blue-700'   },
  processing: { label: 'Processing', bg: 'bg-purple-100',  text: 'text-purple-700' },
  completed:  { label: 'Completed',  bg: 'bg-green-100',  text: 'text-green-700'  },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-100',    text: 'text-red-700'    },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

function parseItems(items: string) {
  try {
    const arr = JSON.parse(items);
    if (Array.isArray(arr)) return arr;
  } catch {}
  return null;
}

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      await fetch(apiUrl(`/api/orders/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    } finally {
      setUpdating(null);
    }
  }

  async function deleteOrder(id: number) {
    if (!confirm('Delete this order permanently?')) return;
    setDeleting(id);
    try {
      await fetch(apiUrl(`/api/orders/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    } finally {
      setDeleting(null);
    }
  }

  const filtered = orders?.filter(o => filterStatus === 'all' || o.status === filterStatus) ?? [];

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Inquiries</h1>
          <p className="text-gray-500 mt-1">Manage customer requests for handmade products.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Filter:</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="all">All Orders</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Loading orders...</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(order => {
            const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const parsedItems = parseItems(order.items);
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{order.fullName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Order #{order.id} · {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Status selector */}
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`appearance-none pr-8 pl-3 py-1.5 rounded-full text-xs font-bold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-300 ${sc.bg} ${sc.text} ${updating === order.id ? 'opacity-50' : ''}`}
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>
                      <ChevronDown className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${sc.text}`} />
                    </div>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      disabled={deleting === order.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact info */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-3">Contact Details</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      {order.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      {order.email}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      {order.address}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-3">Items Ordered</p>
                    {parsedItems ? (
                      <div className="space-y-2">
                        {parsedItems.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500">×{item.quantity}</span>
                            <span className="font-semibold text-pink-600">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="text-xs bg-gray-50 rounded-lg p-3 whitespace-pre-wrap font-mono">{order.items}</pre>
                    )}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">Total Estimated</span>
                      <span className="text-xl font-bold text-pink-600">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {filterStatus === 'all' ? 'No order inquiries yet.' : `No ${STATUS_CONFIG[filterStatus]?.label.toLowerCase()} orders.`}
          </p>
        </div>
      )}
    </AdminLayout>
  );
}
