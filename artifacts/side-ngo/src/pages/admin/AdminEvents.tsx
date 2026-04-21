import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/use-events';
import { Plus, Trash2, Calendar as CalendarIcon, Pencil, X } from 'lucide-react';
import { format } from 'date-fns';
import DriveImageUpload from '@/components/DriveImageUpload';


const EMPTY_FORM = { name: '', date: '', location: '', description: '', youtubeUrl: '', driveImageUrl: '' };

export default function AdminEvents() {
  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [mode, setMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [rawImages, setRawImages] = useState('');

  function openCreate() {
    setFormData(EMPTY_FORM);
    setRawImages('');
    setEditingId(null);
    setMode('create');
  }

  function openEdit(event: any) {
    setFormData({
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      youtubeUrl: event.youtubeUrl || '',
      driveImageUrl: event.driveImageUrl || '',
    });
    setRawImages(event.driveImageUrl || '');
    setEditingId(event.id);
    setMode('edit');
  }

  function closeForm() {
    setMode(null);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setRawImages('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...formData, driveImageUrl: rawImages };
    if (mode === 'edit' && editingId !== null) {
      await updateEvent.mutateAsync({ id: editingId, data: payload });
    } else {
      await createEvent.mutateAsync(payload);
    }
    closeForm();
  }

  const isPending = createEvent.isPending || updateEvent.isPending;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button onClick={openCreate} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {mode !== null && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{mode === 'edit' ? 'Edit Event' : 'Create New Event'}</h2>
            <button onClick={closeForm} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Name *</label>
              <input required className="w-full border rounded-md p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input type="date" required className="w-full border rounded-md p-2" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input required className="w-full border rounded-md p-2" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea required rows={3} className="w-full border rounded-md p-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube URL</label>
              <input type="url" className="w-full border rounded-md p-2" placeholder="https://youtube.com/..." value={formData.youtubeUrl} onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })} />
            </div>
            <div>
              <DriveImageUpload
                label="Event Photos"
                value={rawImages}
                onChange={setRawImages}
                folderPath={["events", `${formData.name || "Event"}_${formData.date || "NoDate"}`]}
                multiple
                placeholder="https://res.cloudinary.com/... or any image URL (comma-separated)"
              />
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={closeForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary text-white rounded-md">
                {isPending ? 'Saving...' : mode === 'edit' ? 'Update Event' : 'Save Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-500">Date</th>
              <th className="p-4 font-medium text-gray-500">Name</th>
              <th className="p-4 font-medium text-gray-500">Location</th>
              <th className="p-4 font-medium text-gray-500">Photos</th>
              <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-400">Loading...</td></tr>
            ) : events?.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No events yet. Add your first event.</td></tr>
            ) : events?.map(event => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" /> {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="p-4 font-medium">{event.name}</td>
                <td className="p-4 text-sm text-gray-600">{event.location}</td>
                <td className="p-4">
                  {event.driveImageUrl ? (
                    <div className="flex gap-1">
                      {event.driveImageUrl.split(',').slice(0, 3).map((url: string, i: number) => (
                        <img key={i} src={url.trim()} className="w-8 h-8 rounded object-cover border" onError={e => (e.currentTarget.style.display = 'none')} />
                      ))}
                      {event.driveImageUrl.split(',').length > 3 && (
                        <span className="w-8 h-8 rounded border bg-gray-100 text-xs flex items-center justify-center text-gray-500">
                          +{event.driveImageUrl.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => openEdit(event)} className="p-2 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete event?')) deleteEvent.mutateAsync(event.id); }} className="p-2 text-gray-400 hover:text-red-500 rounded hover:bg-red-50">
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
