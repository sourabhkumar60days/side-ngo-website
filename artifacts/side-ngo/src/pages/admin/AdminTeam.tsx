import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } from '@/hooks/use-team';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import DriveImageUpload from '@/components/DriveImageUpload';

const CATEGORIES = ['Board Members', 'Management Team', 'Project Team'];
const EMPTY_FORM = { name: '', role: '', category: 'Board Members', photoUrl: '', bio: '', order: 0 };

export default function AdminTeam() {
  const { data: members, isLoading } = useTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const [mode, setMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  function openCreate() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setMode('create');
  }

  function openEdit(member: any) {
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      photoUrl: member.photoUrl || '',
      bio: member.bio || '',
      order: member.order,
    });
    setEditingId(member.id);
    setMode('edit');
  }

  function closeForm() {
    setMode(null);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'edit' && editingId !== null) {
      await updateMember.mutateAsync({ id: editingId, data: formData });
    } else {
      await createMember.mutateAsync(formData);
    }
    closeForm();
  }

  const isPending = createMember.isPending || updateMember.isPending;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Team</h1>
        <button onClick={openCreate} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {mode !== null && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{mode === 'edit' ? 'Edit Team Member' : 'Add Team Member'}</h2>
            <button onClick={closeForm}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input required className="w-full border rounded-md p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role / Designation *</label>
              <input required className="w-full border rounded-md p-2" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select className="w-full border rounded-md p-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" className="w-full border rounded-md p-2" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="col-span-2">
              <DriveImageUpload
                label="Profile Photo"
                value={formData.photoUrl}
                onChange={url => setFormData({ ...formData, photoUrl: url })}
                folderPath={["team", formData.category || "Board_Members"]}
                placeholder="https://res.cloudinary.com/... or any image URL"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Short Bio</label>
              <textarea rows={2} className="w-full border rounded-md p-2" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={closeForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary text-white rounded-md">
                {isPending ? 'Saving...' : mode === 'edit' ? 'Update Member' : 'Save Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-500">Member</th>
              <th className="p-4 font-medium text-gray-500">Role</th>
              <th className="p-4 font-medium text-gray-500">Category</th>
              <th className="p-4 font-medium text-gray-500">Order</th>
              <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-400">Loading...</td></tr>
            ) : members?.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No team members yet.</td></tr>
            ) : members?.sort((a, b) => a.order - b.order).map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      {member.photoUrl && <img src={member.photoUrl} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
                    </div>
                    {member.name}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{member.role}</td>
                <td className="p-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">{member.category}</span>
                </td>
                <td className="p-4 text-sm text-gray-500">{member.order}</td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => openEdit(member)} className="p-2 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete member?')) deleteMember.mutateAsync(member.id); }} className="p-2 text-gray-400 hover:text-red-500 rounded hover:bg-red-50">
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
