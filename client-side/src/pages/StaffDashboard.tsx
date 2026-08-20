import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../components/shared/AuthContext';
import { useSocketContext } from '../components/shared/SocketContext';
import { useTickets } from '../hooks/useTickets';
import { DashboardLayout } from '../components/shared/DashboardLayout';
import { StatCard } from '../components/shared/StatCard';
import { TicketTable } from '../components/shared/TicketTable';
import { EmptyState } from '../components/shared/EmptyState';
import { ModalOverlay } from '../components/shared/ModalOverlay';
import { FiClipboard, FiClock, FiCheckCircle, FiUser } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';

export const StaffDashboard: React.FC = () => {
  const { user: currentUser, logout } = useAuthContext();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('workload');

  // Modal detail view state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  // Form states
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionError, setResolutionError] = useState('');
  const [commentText, setCommentText] = useState('');

  // Hooks integration
  const { useAssignedTickets, useTicketDetails, updateStatus, addComment } = useTickets();
  const { data: tickets = [], isLoading: ticketsLoading } = useAssignedTickets();
  const { data: selectedTicket } = useTicketDetails(selectedTicketId || 0);

  // Socket sync
  useEffect(() => {
    if (!socket) return;

    const handleTicketUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'assigned'] });
      if (selectedTicketId) {
        queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', selectedTicketId] });
      }
    };

    socket.on('ticket:created', handleTicketUpdate);
    socket.on('ticket:status_changed', handleTicketUpdate);
    socket.on('ticket:commented', handleTicketUpdate);
    socket.on('ticket:reassigned', handleTicketUpdate);

    return () => {
      socket.off('ticket:created', handleTicketUpdate);
      socket.off('ticket:status_changed', handleTicketUpdate);
      socket.off('ticket:commented', handleTicketUpdate);
      socket.off('ticket:reassigned', handleTicketUpdate);
    };
  }, [socket, selectedTicketId, queryClient]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="text-brand-text-muted font-bold animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  const handleStartWork = (ticketId: number) => {
    updateStatus.mutate(
      { id: ticketId, status: 'in_progress' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tickets', 'assigned'] });
        }
      }
    );
  };

  const handleResolveTicket = (e: React.FormEvent, ticketId: number) => {
    e.preventDefault();
    setResolutionError('');

    if (!resolutionNote.trim()) {
      setResolutionError('Resolution note is mandatory to resolve a ticket.');
      return;
    }

    updateStatus.mutate(
      { id: ticketId, status: 'resolved', resolution_notes: resolutionNote.trim() },
      {
        onSuccess: () => {
          setResolutionNote('');
          setDetailModalOpen(false);
          setSelectedTicketId(null);
        },
        onError: (err: any) => {
          setResolutionError(err.response?.data?.error || 'Failed to resolve ticket.');
        }
      }
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicketId) return;

    addComment.mutate(
      { id: selectedTicketId, text: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText('');
        }
      }
    );
  };

  // Stats derivations
  const activeWorkloadTickets = tickets.filter(
    (t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'reopened' || t.status === 'escalated'
  );
  const resolvedWorkloadTickets = tickets.filter(
    (t) => t.status === 'resolved' || t.status === 'closed'
  );

  const activeWorkloadCount = activeWorkloadTickets.length;
  const resolvedCount = resolvedWorkloadTickets.length;
  const totalAssigned = tickets.length;

  const sidebarTabs = [
    {
      id: 'workload',
      name: 'Active Workload',
      icon: <FiClipboard className="h-4 w-4" />,
      onClick: () => setActiveTab('workload')
    },
    {
      id: 'resolved',
      name: 'Resolved Tickets',
      icon: <FiCheckCircle className="h-4 w-4" />,
      onClick: () => setActiveTab('resolved')
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: <FiUser className="h-4 w-4" />,
      onClick: () => setActiveTab('profile')
    }
  ];

  return (
    <DashboardLayout
      roleName="Faculty Staff"
      userName={currentUser.name}
      activeTab={activeTab}
      tabs={sidebarTabs}
      onAvatarClick={() => setActiveTab('profile')}
    >
      {/* Tab 1: Active Workload */}
      {activeTab === 'workload' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Banner */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-text-main font-sans">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-brand-text-muted text-xs font-semibold mt-1">
              You are assigned to the <strong className="text-brand-primary font-bold">{currentUser.category || 'Specialist'}</strong> category queue.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Active Workload"
              value={activeWorkloadCount}
              description="Open and in progress tickets"
              icon={<FiClock className="h-5 w-5" />}
            />
            <StatCard
              title="Resolved"
              value={resolvedCount}
              description="Successfully completed tickets"
              icon={<FiCheckCircle className="h-5 w-5" />}
            />
            <StatCard
              title="Total Assigned"
              value={totalAssigned}
              description="Lifetime ticket allocations"
              icon={<FiClipboard className="h-5 w-5" />}
            />
          </div>

          {/* Active Workload List */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-brand-text-main">Currently Assigned Tickets</h2>
            {ticketsLoading ? (
              <p className="text-xs italic text-brand-text-muted/65">Loading workload...</p>
            ) : activeWorkloadTickets.length === 0 ? (
              <EmptyState
                title="Your workload is clear!"
                description="When new student complaints are submitted in your category, they will be auto-allocated here based on your workload count."
                icon="inbox"
              />
            ) : (
              <TicketTable
                tickets={activeWorkloadTickets}
                onViewDetails={(ticket) => {
                  setSelectedTicketId(ticket.id);
                  setDetailModalOpen(true);
                }}
                showAssignee={false}
              />
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Resolved Workload History */}
      {activeTab === 'resolved' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Resolved &amp; Closed Tickets</h2>
          {ticketsLoading ? (
            <p className="text-xs italic text-brand-text-muted/65">Loading history...</p>
          ) : resolvedWorkloadTickets.length === 0 ? (
            <EmptyState
              title="No resolved tickets yet"
              description="Once you resolve and close tickets, they will be saved here as history logs."
              icon="folder"
            />
          ) : (
            <TicketTable
              tickets={resolvedWorkloadTickets}
              onViewDetails={(ticket) => {
                setSelectedTicketId(ticket.id);
                setDetailModalOpen(true);
              }}
              showAssignee={false}
            />
          )}
        </div>
      )}

      {/* Tab 3: Staff Profile Details */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Specialist Identity</h2>
            <p className="text-xs text-brand-text-muted font-semibold mt-1">
              Pre-verified registry parameters loaded for {currentUser.name}.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border/40 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            <div className="h-24 w-24 rounded-full bg-brand-primary border-2 border-brand-secondary/40 flex items-center justify-center font-bold text-brand-white text-3xl shadow-md shrink-0 uppercase">
              {currentUser.name.slice(0, 2)}
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Full Name</span>
                  <span className="text-xs font-extrabold text-brand-text-main">{currentUser.name}</span>
                </div>
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">System Access Role</span>
                  <span className="text-xs font-extrabold text-brand-text-main capitalize">Staff Specialist</span>
                </div>
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Specialist Category</span>
                  <span className="text-xs font-extrabold text-brand-primary">{currentUser.category || 'Specialist'}</span>
                </div>
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Registered Email</span>
                  <span className="text-xs font-extrabold text-brand-text-main">{currentUser.email}</span>
                </div>
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Department / Institution</span>
                  <span className="text-xs font-extrabold text-brand-text-main">Computer Science, UNN</span>
                </div>
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Specialist Status</span>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20">
                      Active duty
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Statistics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-brand-card border border-brand-border/40 p-5 rounded-2xl shadow-xs flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Active Inquiries</span>
                <h4 className="text-2xl font-extrabold text-brand-text-main mt-1">{activeWorkloadCount}</h4>
              </div>
              <button
                onClick={() => setActiveTab('workload')}
                className="bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                View Workload
              </button>
            </div>
            <div className="bg-brand-card border border-brand-border/40 p-5 rounded-2xl shadow-xs flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Resolved Tickets</span>
                <h4 className="text-2xl font-extrabold text-brand-text-main mt-1">{resolvedCount}</h4>
              </div>
              <button
                onClick={() => setActiveTab('resolved')}
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                View History
              </button>
            </div>
          </div>

          {/* Logout Action */}
          <div className="flex justify-end pt-4">
            <button
              onClick={logout}
              className="text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-500/10 border border-red-500/25 px-5 py-3 rounded-xl transition duration-155"
            >
              Sign Out from Session
            </button>
          </div>
        </div>
      )}

      {/* Detail Dialog Modal */}
      {detailModalOpen && selectedTicket && (
        <ModalOverlay onClose={() => { setDetailModalOpen(false); setSelectedTicketId(null); }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-border/30 pb-4">
              <div>
                <span className="text-[10px] font-extrabold bg-brand-silver/10 px-2 py-0.5 rounded text-brand-text-muted uppercase">
                  {selectedTicket.category_name}
                </span>
                <h3 className="text-lg font-extrabold text-brand-text-main mt-2">
                  {selectedTicket.ticket_ref}: {selectedTicket.title}
                </h3>
                <p className="text-[10px] text-brand-text-muted font-bold mt-1">
                  Submitted: {new Date(selectedTicket.created_at || '').toLocaleString()} by {selectedTicket.student_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedTicketId(null);
                }}
                className="text-brand-text-muted hover:text-brand-primary font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Detailed Description</h4>
              <p className="text-xs bg-brand-bg/50 border border-brand-border/20 p-4 rounded-xl leading-relaxed text-brand-text-main font-semibold">
                {selectedTicket.description}
              </p>
            </div>

            {/* Resolution Display */}
            {selectedTicket.resolution_notes && (
              <div className="space-y-2 bg-brand-primary/5 border border-brand-primary/30 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Resolution note</h4>
                <p className="text-xs text-brand-text-main font-bold leading-relaxed">
                  {selectedTicket.resolution_notes}
                </p>
              </div>
            )}

            {/* Student Feedback display */}
            {selectedTicket.feedback && (
              <div className="space-y-2 bg-brand-secondary/5 border border-brand-secondary/30 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider">Student Feedback Remarks</h4>
                <p className="text-xs italic text-brand-text-main font-bold leading-relaxed">
                  "{selectedTicket.feedback}"
                </p>
              </div>
            )}

            {/* Student Reopen Reason display */}
            {selectedTicket.reopen_reason && (
              <div className="space-y-2 bg-red-500/5 border border-red-500/25 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">Student Reopen Reason</h4>
                <p className="text-xs text-brand-text-main font-bold leading-relaxed">
                  {selectedTicket.reopen_reason}
                </p>
              </div>
            )}

            {/* Comment logs */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Log &amp; Comment Threads</h4>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border-b border-brand-border/25 pb-4">
                {!selectedTicket.comments || selectedTicket.comments.length === 0 ? (
                  <p className="text-xs italic text-brand-text-muted/50">No logs posted yet.</p>
                ) : (
                  selectedTicket.comments.map((c: any) => (
                    <div key={c.id} className="p-3 bg-brand-bg/30 border border-brand-border/20 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-extrabold text-brand-primary uppercase">
                          {c.author_name || c.authorName} ({c.author_role || c.authorRole})
                        </span>
                        <span className="text-brand-text-muted font-bold">
                          {new Date(c.created_at || c.date || '').toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-main font-semibold">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add comments or reply to student..."
                    className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                  />
                  <button
                    type="submit"
                    disabled={addComment.isPending}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addComment.isPending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              )}
            </div>

            {/* Resolution Form actions */}
            {selectedTicket.status === 'open' && (
              <div className="pt-2">
                <button
                  onClick={() => handleStartWork(selectedTicket.id)}
                  disabled={updateStatus.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-3.5 rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateStatus.isPending ? 'Starting...' : 'Acknowledge & Start Work'}
                </button>
              </div>
            )}

            {selectedTicket.status === 'in_progress' || selectedTicket.status === 'reopened' || selectedTicket.status === 'escalated' ? (
              <div className="border-t border-brand-border/30 pt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Resolve Complaint</h4>
                  {resolutionError && (
                    <p className="text-[10px] text-brand-primary font-bold">{resolutionError}</p>
                  )}
                  <form onSubmit={(e) => handleResolveTicket(e, selectedTicket.id)} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Detail resolution steps taken (mandatory)..."
                      className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                    />
                    <button
                      type="submit"
                      disabled={updateStatus.isPending}
                      className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateStatus.isPending ? 'Saving...' : 'Mark Resolved'}
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

export default StaffDashboard;
