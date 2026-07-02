import React, { useState, useEffect } from 'react';
import { mockDb, Ticket } from '../services/mockDb';
import { DashboardLayout } from '../components/shared/DashboardLayout';
import { StatCard } from '../components/shared/StatCard';
import { TicketTable } from '../components/shared/TicketTable';

export const StaffDashboard: React.FC = () => {
  // Use Dr. Charles Uzo as the active faculty staff user
  const currentUser = { id: 'usr-3', name: 'Dr. Charles Uzo', role: 'staff' as const, category: 'Academic' };

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState('workload');
  
  // Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Form states
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionError, setResolutionError] = useState('');
  const [commentText, setCommentText] = useState('');

  const loadData = () => {
    const staffTickets = mockDb.getTickets().filter((t) => t.staffId === currentUser.id);
    setTickets(staffTickets);

    if (selectedTicket) {
      const updated = mockDb.getTicketById(selectedTicket.id);
      if (updated) {
        setSelectedTicket(updated);
      }
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mockDbUpdate', loadData);
    return () => window.removeEventListener('mockDbUpdate', loadData);
  }, [selectedTicket]);

  const handleStartWork = (ticketId: string) => {
    mockDb.updateTicketStatus(ticketId, 'in_progress');
  };

  const handleResolveTicket = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    setResolutionError('');

    if (!resolutionNote.trim()) {
      setResolutionError('Resolution note is mandatory to resolve a ticket.');
      return;
    }

    mockDb.updateTicketStatus(ticketId, 'resolved', {
      resolutionNote: resolutionNote
    });

    setResolutionNote('');
    setDetailModalOpen(false);
    setSelectedTicket(null);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicket) return;

    mockDb.addComment(selectedTicket.id, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: 'staff',
      text: commentText
    });

    setCommentText('');
  };

  // Stats derivations
  const totalAssigned = tickets.length;
  const activeWorkload = tickets.filter(
    (t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'reopened' || t.status === 'escalated'
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  const sidebarTabs = [
    {
      id: 'workload',
      name: 'Assigned Workload',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      onClick: () => setActiveTab('workload')
    }
  ];

  return (
    <DashboardLayout
      roleName="Faculty Staff"
      userName={currentUser.name}
      activeTab={activeTab}
      tabs={sidebarTabs}
    >
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-main">
          Staff Hub &mdash; {currentUser.category} Category
        </h1>
        <p className="text-brand-text-muted text-sm font-semibold">
          Handle complaints routed to your workload queue.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Complaints"
          value={totalAssigned}
          description="Total lifetime tickets"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Queues"
          value={activeWorkload}
          description="Needs attention &amp; logs"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Resolved complaints"
          value={resolvedCount}
          description="Resolved or closed"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Workload list */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-brand-text-main font-sans">My Workload Queue</h2>
        <TicketTable
          tickets={tickets}
          onViewDetails={(ticket) => {
            setSelectedTicket(ticket);
            setDetailModalOpen(true);
          }}
          showAssignee={false}
        />
      </div>

      {/* Ticket Details Dialog */}
      {detailModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-brand-primary/15 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-card border border-brand-border/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-border/30 pb-4">
              <div>
                <span className="text-xs font-bold bg-brand-silver/10 px-2 py-1 rounded text-brand-text-muted">
                  STUDENT SUBMISSION
                </span>
                <h3 className="text-xl font-extrabold text-brand-text-main mt-2">
                  {selectedTicket.id}: {selectedTicket.title}
                </h3>
                <p className="text-[10px] text-brand-text-muted font-bold mt-1">
                  Filed By: {selectedTicket.studentName} | Submitted: {new Date(selectedTicket.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedTicket(null);
                }}
                className="text-brand-text-muted hover:text-brand-primary font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Complaint text</h4>
              <p className="text-sm bg-brand-bg/50 border border-brand-border/20 p-4 rounded-xl leading-relaxed text-brand-text-main font-medium">
                {selectedTicket.description}
              </p>
            </div>

            {/* Reopen reason if flagged */}
            {selectedTicket.reopenReason && (
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/30 rounded-xl space-y-1">
                <h4 className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">Reason for Reopening</h4>
                <p className="text-xs text-brand-text-main font-semibold">
                  "{selectedTicket.reopenReason}"
                </p>
              </div>
            )}

            {/* Feedback from student if closed */}
            {selectedTicket.feedback && (
              <div className="p-4 bg-brand-silver/10 border border-brand-border/30 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">Student Feedback</h4>
                <p className="text-xs text-brand-text-muted italic font-medium">
                  "{selectedTicket.feedback}"
                </p>
              </div>
            )}

            {/* Resolution log */}
            {selectedTicket.resolutionNote && (
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/30 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Submitted Resolution</h4>
                <p className="text-xs text-brand-text-main font-semibold">
                  {selectedTicket.resolutionNote}
                </p>
              </div>
            )}

            {/* Discussion Thread */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Workflow log &amp; discussion</h4>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border-b border-brand-border/25 pb-4">
                {selectedTicket.comments.length === 0 ? (
                  <p className="text-xs italic text-brand-text-muted/60">No comments logged.</p>
                ) : (
                  selectedTicket.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-brand-bg/30 border border-brand-border/20 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-extrabold text-brand-primary uppercase">
                          {c.authorName} ({c.authorRole})
                        </span>
                        <span className="text-brand-text-muted font-semibold">
                          {new Date(c.date).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-main font-semibold">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Log comment update..."
                    className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                  />
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                  >
                    Post Log
                  </button>
                </form>
              )}
            </div>

            {/* Actions Workflow */}
            {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
              <div className="border-t border-brand-border/30 pt-4 space-y-4">
                {selectedTicket.status === 'open' && (
                  <div className="flex items-center justify-between bg-brand-light/30 border border-brand-primary/20 p-4 rounded-xl">
                    <div>
                      <h4 className="text-xs font-bold text-brand-text-main">Claim this Ticket</h4>
                      <p className="text-[10px] text-brand-text-muted font-semibold">Signal to the student that research has started.</p>
                    </div>
                    <button
                      onClick={() => handleStartWork(selectedTicket.id)}
                      className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4 py-2 rounded-lg transition"
                    >
                      Start Work
                    </button>
                  </div>
                )}

                {/* Resolve Box */}
                <form onSubmit={(e) => handleResolveTicket(e, selectedTicket.id)} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                      Resolution Note (Mandatory)
                    </label>
                    {resolutionError && (
                      <p className="text-[10px] text-brand-primary font-extrabold">{resolutionError}</p>
                    )}
                    <textarea
                      required
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      rows={3}
                      placeholder="Detail exactly what was done to resolve the complaint..."
                      className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-3 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold py-3 rounded-xl shadow-xs transition"
                  >
                    Submit Resolution &amp; Resolve Ticket
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StaffDashboard;
