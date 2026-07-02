import React, { useState, useEffect } from 'react';
import { mockDb, Ticket, Category } from '../services/mockDb';
import { DashboardLayout } from '../components/shared/DashboardLayout';
import { StatCard } from '../components/shared/StatCard';
import { TicketTable } from '../components/shared/TicketTable';

export const StudentDashboard: React.FC = () => {
  // Use Stella Starr as the active student user
  const currentUser = { id: 'usr-2', name: 'Stella Starr', role: 'student' as const };
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Submit Ticket Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Reopen Form state
  const [reopenReason, setReopenReason] = useState('');
  const [reopenError, setReopenError] = useState('');

  // Feedback Form state
  const [feedbackText, setFeedbackText] = useState('');

  // New Comment state
  const [commentText, setCommentText] = useState('');

  // Load and subscribe to database updates
  const loadData = () => {
    const studentTickets = mockDb.getTickets().filter((t) => t.studentId === currentUser.id);
    setTickets(studentTickets);
    setCategories(mockDb.getCategories());
    
    // Update selected ticket details if open
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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!newCategory) {
      setSubmitError('Please select a category.');
      return;
    }
    if (newDescription.length < 20 || newDescription.length > 2000) {
      setSubmitError('Description must be between 20 and 2000 characters.');
      return;
    }

    mockDb.createTicket({
      title: newTitle,
      description: newDescription,
      category: newCategory,
      studentId: currentUser.id,
      studentName: currentUser.name
    });

    // Reset Form
    setNewTitle('');
    setNewCategory('');
    setNewDescription('');
    setSubmitModalOpen(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicket) return;

    mockDb.addComment(selectedTicket.id, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: 'student',
      text: commentText
    });

    setCommentText('');
  };

  const handleCloseTicket = (ticketId: string) => {
    mockDb.updateTicketStatus(ticketId, 'closed', {
      feedback: feedbackText || 'No feedback text submitted.'
    });
    setFeedbackText('');
    setDetailModalOpen(false);
    setSelectedTicket(null);
  };

  const handleReopenTicket = (ticketId: string) => {
    setReopenError('');
    if (!reopenReason.trim()) {
      setReopenError('A reason is mandatory to reopen a resolved ticket.');
      return;
    }

    mockDb.updateTicketStatus(ticketId, 'reopened', {
      reopenReason: reopenReason
    });

    setReopenReason('');
    setDetailModalOpen(false);
    setSelectedTicket(null);
  };

  // Stats derivations
  const totalSubmitted = tickets.length;
  const activeTickets = tickets.filter(
    (t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'reopened' || t.status === 'escalated'
  ).length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  const sidebarTabs = [
    {
      id: 'overview',
      name: 'Dashboard Overview',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      onClick: () => setActiveTab('overview')
    }
  ];

  return (
    <DashboardLayout
      roleName="Student"
      userName={currentUser.name}
      activeTab={activeTab}
      tabs={sidebarTabs}
    >
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-main">
            Welcome back, Stella!
          </h1>
          <p className="text-brand-text-muted text-sm font-semibold">
            Track your departmental help requests or launch a new query.
          </p>
        </div>
        <button
          onClick={() => setSubmitModalOpen(true)}
          className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-bold py-3 px-5 rounded-xl shadow-md transition shrink-0"
        >
          + Submit New Complaint
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Tickets Currently Opened"
          value={activeTickets}
          description="In Queue or handling by staff"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          }
        />
        <StatCard
          title="Resolved complaints"
          value={resolvedTickets}
          description="Awaiting feedback or closed"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total tickets filed"
          value={totalSubmitted}
          description="All-time profile metrics"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      {/* Main complaint list card */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-brand-text-main">My Ticket History</h2>
        <TicketTable
          tickets={tickets}
          onViewDetails={(ticket) => {
            setSelectedTicket(ticket);
            setDetailModalOpen(true);
          }}
          showSubmitter={false}
        />
      </div>

      {/* Modal 1: Submit New Complaint */}
      {submitModalOpen && (
        <div className="fixed inset-0 bg-brand-primary/15 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-card border border-brand-border/40 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-extrabold text-brand-text-main">File a Complaint</h3>
                <p className="text-xs text-brand-text-muted font-semibold">Your ticket will be auto-routed to the correct division staff.</p>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="text-brand-text-muted hover:text-brand-primary font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-brand-primary/5 border border-brand-primary text-brand-primary text-xs font-bold rounded-lg">
                  {submitError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Complaint Category</label>
                <select
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Subject Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Missing grades in COS 301"
                  className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-semibold transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Elaborate Description</label>
                  <span className={`text-[10px] font-bold ${newDescription.length < 20 || newDescription.length > 2000 ? 'text-brand-primary' : 'text-brand-text-muted'}`}>
                    {newDescription.length} / 2000 chars
                  </span>
                </div>
                <textarea
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your issue. Minimum 20 characters, maximum 2000 characters."
                  className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-semibold transition"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="w-1/2 border border-brand-border hover:border-brand-primary text-brand-text-muted hover:text-brand-primary font-bold py-3 px-4 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-3 px-4 rounded-xl shadow-md transition"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Ticket Detail View / Dialog */}
      {detailModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-brand-primary/15 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-card border border-brand-border/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-brand-border/30 pb-4">
              <div>
                <span className="text-xs font-bold bg-brand-silver/10 px-2 py-1 rounded text-brand-text-muted uppercase">
                  {selectedTicket.category}
                </span>
                <h3 className="text-xl font-extrabold text-brand-text-main mt-2">
                  {selectedTicket.id}: {selectedTicket.title}
                </h3>
                <p className="text-[10px] text-brand-text-muted font-semibold mt-1">
                  Submitted: {new Date(selectedTicket.date).toLocaleString()}
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

            {/* Description Block */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Detailed Description</h4>
              <p className="text-sm bg-brand-bg/50 border border-brand-border/20 p-4 rounded-xl leading-relaxed text-brand-text-main font-medium">
                {selectedTicket.description}
              </p>
            </div>

            {/* Resolution Note if resolved */}
            {selectedTicket.resolutionNote && (
              <div className="space-y-2 bg-brand-primary/5 border border-brand-primary/40 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Official Resolution Note</h4>
                <p className="text-sm text-brand-text-main font-semibold leading-relaxed">
                  {selectedTicket.resolutionNote}
                </p>
              </div>
            )}

            {/* Discussion / Comments Section */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Workflow log &amp; Comments</h4>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border-b border-brand-border/25 pb-4">
                {selectedTicket.comments.length === 0 ? (
                  <p className="text-xs italic text-brand-text-muted/60">No comments posted yet.</p>
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

              {/* Only allow comments if ticket is not closed */}
              {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ask for update or reply to staff..."
                    className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                  />
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>

            {/* Resolved workflow blocks */}
            {selectedTicket.status === 'resolved' && (
              <div className="border-t border-brand-border/30 pt-4 space-y-4">
                {/* Close with feedback */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Close Ticket with feedback</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Optional: How did the staff handle your complaint?"
                      className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                    />
                    <button
                      onClick={() => handleCloseTicket(selectedTicket.id)}
                      className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                    >
                      Accept &amp; Close
                    </button>
                  </div>
                </div>

                <div className="h-px bg-brand-border/20" />

                {/* Reopen complaint (Requires mandatory reason) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Reopen complaint (If unresolved)</h4>
                  {reopenError && (
                    <p className="text-[10px] text-brand-primary font-extrabold">{reopenError}</p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      placeholder="Mandatory: Why is this complaint still unresolved?"
                      className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                    />
                    <button
                      onClick={() => handleReopenTicket(selectedTicket.id)}
                      className="bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
                    >
                      Reopen Ticket
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
