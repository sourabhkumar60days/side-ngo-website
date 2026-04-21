import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useTeamMembers } from '@/hooks/use-team';
import { Users, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Team() {
  const { data: members, isLoading } = useTeamMembers();
  const [activeTab, setActiveTab] = useState<string>('Board Members');

  const categories = ['Board Members', 'Management Team', 'Project Team'];

  const filteredMembers = members?.filter(m => m.category === activeTab).sort((a,b) => a.order - b.order) || [];

  return (
    <Layout>
      <div className="bg-primary/5 py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-display font-bold mb-6 text-[#e25a87]">Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated individuals who make our mission possible.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' 
                  : 'bg-card border border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center bg-card p-6 rounded-3xl border border-border animate-pulse">
                <div className="w-32 h-32 rounded-full bg-muted mb-4"></div>
                <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredMembers.map(member => (
              <div key={member.id} className="group bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-background shadow-lg group-hover:border-primary/20 transition-colors">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <UserCircle className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No members found</h3>
            <p className="text-muted-foreground">There are currently no members listed in this category.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
