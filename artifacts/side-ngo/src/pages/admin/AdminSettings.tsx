import React, { useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useSettings, useUpdateSettings } from '@/hooks/use-settings';
import { useForm } from 'react-hook-form';
import { Bell, CheckCircle, ExternalLink, Facebook, Instagram, Phone, Youtube } from 'lucide-react';

type SettingsForm = {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
};

function SectionCard({ icon: Icon, title, description, color, children }: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`px-6 py-4 border-b border-gray-100 flex items-center gap-3 ${color}`}>
        <Icon className="w-5 h-5" />
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs opacity-75 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent";

export default function AdminSettings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<SettingsForm>({
    defaultValues: {
      contact_email: '',
      contact_phone: '',
      contact_address: '',
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsForm) => {
    await updateSettings.mutateAsync(data);
    reset(data);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-gray-500 py-12 text-center">Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Website Settings</h1>
        <p className="text-gray-500 mt-1">Manage contact information for the website.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

        {/* Email Notifications — Info Only */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700">
            <Bell className="w-5 h-5" />
            <div>
              <h2 className="text-base font-semibold">Notification Settings</h2>
              <p className="text-xs opacity-75 mt-0.5">Where order and volunteer notifications are delivered</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800">Notifications are active</p>
                <p className="text-sm text-green-700 mt-1">
                  All order and volunteer notifications are automatically sent to:
                </p>
                <p className="mt-2 font-mono text-sm font-bold text-green-900 bg-green-100 px-3 py-1.5 rounded-lg inline-block">
                  sidevinayabhawan@gmail.com
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Sent via <span className="font-medium">side.ngo.official@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media — Info Only */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700">
            <ExternalLink className="w-5 h-5" />
            <div>
              <h2 className="text-base font-semibold">Social Media Links</h2>
              <p className="text-xs opacity-75 mt-0.5">Links shown in the website footer</p>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {[
              { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/SideNgo1/', color: 'text-blue-600 bg-blue-50' },
              { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/sidengo1/', color: 'text-pink-600 bg-pink-50' },
              { icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com/@SideNgo-1', color: 'text-red-600 bg-red-50' },
            ].map(({ icon: Icon, label, url, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                  <a href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate block">{url}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <SectionCard
          icon={Phone}
          title="Contact Information"
          description="Shown in the footer and Contact / Join Us pages"
          color="bg-gradient-to-r from-green-50 to-teal-50 text-teal-700"
        >
          <Field label="Contact Email">
            <input
              {...register('contact_email')}
              type="email"
              placeholder="sidevinayabhawan@gmail.com"
              className={inputClass}
            />
          </Field>
          <Field label="Phone Number">
            <input
              {...register('contact_phone')}
              type="text"
              placeholder="011-29957270 | +91 7042136250"
              className={inputClass}
            />
          </Field>
          <Field label="Address">
            <textarea
              {...register('contact_address')}
              rows={3}
              placeholder="19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </SectionCard>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
          {updateSettings.isSuccess && !isDirty && (
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <span>✓</span> Saved successfully
            </span>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}
