import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useEvents } from '@/hooks/use-events';
import { useTeamMembers } from '@/hooks/use-team';
import { useProducts } from '@/hooks/use-products';
import { useOrders } from '@/hooks/use-orders';
import { Calendar, Users, ShoppingBag, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  const { data: events } = useEvents();
  const { data: team } = useTeamMembers();
  const { data: products } = useProducts();
  const { data: orders } = useOrders();

  const cards = [
    { label: 'Total Events', value: events?.length || 0, icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Team Members', value: team?.length || 0, icon: Users, color: 'bg-green-100 text-green-600' },
    { label: 'Products', value: products?.length || 0, icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
    { label: 'Order Inquiries', value: orders?.length || 0, icon: ShoppingCart, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-500">Here's an overview of your platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${c.color} flex items-center justify-center shrink-0`}>
              <c.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{c.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{c.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
