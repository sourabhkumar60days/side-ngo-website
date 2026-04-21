import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ShoppingBag, 
  ShoppingBasket,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth, useLogout } from '@/hooks/use-auth';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin...</div>;
  }

  if (!isAuthenticated) return null;

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Team Members', path: '/admin/team', icon: Users },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBasket },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout.mutateAsync({});
    setLocation('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-16 flex items-center px-6 bg-slate-950 text-white font-bold text-xl tracking-wider">
          SIDE Admin
        </div>
        
        <div className="p-4 space-y-1 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors hover:bg-slate-800 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 justify-between shrink-0">
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-800">
              {links.find(l => l.path === location)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Admin Panel
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
