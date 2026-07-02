import React, { useState, useEffect } from 'react';
import { mockDb, Ticket, Category } from '../services/mockDb';
import { DashboardLayout } from '../components/shared/DashboardLayout';
import { StatCard } from '../components/shared/StatCard';
import { TicketTable } from '../components/shared/TicketTable';
import { FiHome, FiClock, FiCheckCircle, FiFileText, FiUser } from 'react-icons/fi';

export const StudentDashboard: React.FC = () => {
  const currentUser = { id: 'usr-2', name: 'Stella Starr', role: 'student' as const };
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Detail Modal state
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

  // Load database state
  const loadData = () => {
    const studentTickets = mockDb.getTickets().filter((t) => t.studentId === currentUser.id);
    setTickets(studentTickets);
    setCategories(mockDb.getCategories());
    
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

    // Reset Form & Switch Tab to history to see the new ticket
    setNewTitle('');
    setNewCategory('');
    setNewDescription('');
    setActiveTab('history');
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

  // Sidebar items
  const sidebarTabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: <FiHome className="h-4 w-4" />,
      onClick: () => setActiveTab('overview')
    },
    {
      id: 'submit',
      name: 'File Complaint',
      icon: <FiFileText className="h-4 w-4" />,
      onClick: () => setActiveTab('submit')
    },
    {
      id: 'history',
      name: 'My History',
      icon: <FiClock className="h-4 w-4" />,
      onClick: () => setActiveTab('history')
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
      roleName="Student"
      userName={currentUser.name}
      activeTab={activeTab}
      tabs={sidebarTabs}
      onAvatarClick={() => setActiveTab('profile')}
    >
      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-brand-text-main font-sans">
                Welcome back, Stella Starr
              </h1>
              <p className="text-brand-text-muted text-xs font-semibold">
                Track your student complaints or log a new assistance ticket.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('submit')}
              className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              File New Complaint
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Open complaints"
              value={activeTickets}
              description="Assigned and under review"
              icon={<FiClock className="h-5 w-5" />}
            />
            <StatCard
              title="Resolved"
              value={resolvedTickets}
              description="Awaiting feedback or closed"
              icon={<FiCheckCircle className="h-5 w-5" />}
            />
            <StatCard
              title="Total complaints"
              value={totalSubmitted}
              description="Lifetime dashboard metrics"
              icon={<FiFileText className="h-5 w-5" />}
            />
          </div>

          {/* Recent Tickets preview list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-brand-text-main">Recent Complaints</h2>
              {tickets.length > 3 && (
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover transition"
                >
                  View All &rarr;
                </button>
              )}
            </div>
            <TicketTable
              tickets={tickets.slice(0, 3)}
              onViewDetails={(ticket) => {
                setSelectedTicket(ticket);
                setDetailModalOpen(true);
              }}
              showSubmitter={false}
            />
          </div>
        </div>
      )}

      {/* Tab 2: File Complaint Inline Panel */}
      {activeTab === 'submit' && (
        <div className="max-w-2xl bg-brand-card border border-brand-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">File a Departmental Complaint</h2>
            <p className="text-xs text-brand-text-muted font-semibold mt-1">
              Your inquiry will be auto-routed to the workload specialist matching your category choice.
            </p>
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
                className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-3 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
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
                placeholder="e.g. Missing grades in COS 301 first semester"
                className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-3 text-xs text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-semibold transition"
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
                rows={5}
                placeholder="Describe your issue. Minimum 20 characters, maximum 2000 characters."
                className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-3 text-xs text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-semibold transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-3.5 px-4 rounded-xl shadow-xs transition"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: My History List */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Full Ticketing History</h2>
          <TicketTable
            tickets={tickets}
            onViewDetails={(ticket) => {
              setSelectedTicket(ticket);
              setDetailModalOpen(true);
            }}
            showSubmitter={false}
          />
        </div>
      )}

      {/* Tab 4: Student Profile Details */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Student Identity</h2>
            <p className="text-xs text-brand-text-muted font-semibold mt-1">
              Pre-verified registry parameters loaded for Stella Starr.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border/40 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            <div className="h-24 w-24 rounded-full bg-brand-primary border-2 border-brand-secondary/40 flex items-center justify-center font-bold text-brand-white text-3xl shadow-md shrink-0">
              SS
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Full Name</span>
                  <span className="text-xs font-extrabold text-brand-text-main">{currentUser.name}</span>
                </div>
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">University Registry Role</span>
                  <span className="text-xs font-extrabold text-brand-text-main capitalize">{currentUser.role}</span>
                </div>
                <div className="border-b border-brand-border/20 pb-2">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Registration Number</span>
                  <span className="text-xs font-extrabold text-brand-primary">{currentUser.matricNo}</span>
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
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Verification Status</span>
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20">
                      Active Verified
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
                <h4 className="text-2xl font-extrabold text-brand-text-main mt-1">{activeTickets}</h4>
              </div>
              <button
                onClick={() => setActiveTab('history')}
                className="bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                View History
              </button>
            </div>
            <div className="bg-brand-card border border-brand-border/40 p-5 rounded-2xl shadow-xs flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Total Complaints Filed</span>
                <h4 className="text-2xl font-extrabold text-brand-text-main mt-1">{totalSubmitted}</h4>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                File New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Dialog Modal (Kept for overlays details) */}
      {detailModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-brand-primary/15 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-card border border-brand-border/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-border/30 pb-4">
              <div>
                <span className="text-[10px] font-extrabold bg-brand-silver/10 px-2 py-0.5 rounded text-brand-text-muted uppercase">
                  {selectedTicket.category}
                </span>
                <h3 className="text-lg font-extrabold text-brand-text-main mt-2">
                  {selectedTicket.id}: {selectedTicket.title}
                </h3>
                <p className="text-[10px] text-brand-text-muted font-bold mt-1">
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

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Detailed Description</h4>
              <p className="text-xs bg-brand-bg/50 border border-brand-border/20 p-4 rounded-xl leading-relaxed text-brand-text-main font-semibold">
                {selectedTicket.description}
              </p>
            </div>

            {/* Resolution */}
            {selectedTicket.resolutionNote && (
              <div className="space-y-2 bg-brand-primary/5 border border-brand-primary/30 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Resolution note</h4>
                <p className="text-xs text-brand-text-main font-bold leading-relaxed">
                  {selectedTicket.resolutionNote}
                </p>
              </div>
            )}

            {/* Comment logs */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Log &amp; Comment Threads</h4>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border-b border-brand-border/25 pb-4">
                {selectedTicket.comments.length === 0 ? (
                  <p className="text-xs italic text-brand-text-muted/50">No logs posted yet.</p>
                ) : (
                  selectedTicket.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-brand-bg/30 border border-brand-border/20 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-extrabold text-brand-primary uppercase">
                          {c.authorName} ({c.authorRole})
                        </span>
                        <span className="text-brand-text-muted font-bold">
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
                    placeholder="Add comments or reply to specialist..."
                    className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                  />
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>

            {/* Resolution Form actions */}
            {selectedTicket.status === 'resolved' && (
              <div className="border-t border-brand-border/30 pt-4 space-y-4">
                {/* Accept & Close */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Close complaint with feedback</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Optional feedback..."
                      className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                    />
                    <button
                      onClick={() => handleCloseTicket(selectedTicket.id)}
                      className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      Accept &amp; Close
                    </button>
                  </div>
                </div>

                <div className="h-px bg-brand-border/25" />

                {/* Reopen (Mandatory reason) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Reopen complaint (If unresolved)</h4>
                  {reopenError && (
                    <p className="text-[10px] text-brand-primary font-bold">{reopenError}</p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      placeholder="Mandatory: Detail why this remains unresolved..."
                      className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                    />
                    <button
                      onClick={() => handleReopenTicket(selectedTicket.id)}
                      className="bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white text-xs font-bold px-4 py-2 rounded-xl transition"
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
