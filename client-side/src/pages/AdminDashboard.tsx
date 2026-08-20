import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/shared/DashboardLayout';
import { StatCard } from '../components/shared/StatCard';
import { TicketTable } from '../components/shared/TicketTable';
import { DataTable } from '../components/shared/DataTable';
import { ModalOverlay } from '../components/shared/ModalOverlay';
import { EmptyState } from '../components/shared/EmptyState';
import { FiInbox, FiUsers, FiSettings, FiShield, FiBarChart2, FiFolder, FiActivity, FiAlertTriangle } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../components/shared/AuthContext';
import { useSocketContext } from '../components/shared/SocketContext';
import { useTickets } from '../hooks/useTickets';
import { useCategories } from '../hooks/useCategories';
import { useStaff } from '../hooks/useStaff';
import { D3BarChart, D3PieChart } from '../components/shared/D3Charts';

export const AdminDashboard: React.FC = () => {
  const { user: currentUser } = useAuthContext();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('tickets');

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffCategoryId, setStaffCategoryId] = useState<number>(0);
  const [staffError, setStaffError] = useState('');

  // Reassignment select
  const [selectedStaffId, setSelectedStaffId] = useState<number | string>('');

  // Category CRUD states
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catHours, setCatHours] = useState(48);

  // Specialist manual resets
  const [passwordResetUserId, setPasswordResetUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Hooks
  const { useAllTickets, useTicketDetails, reassignTicket } = useTickets();
  const { useCategoriesList, createCategory, deleteCategory } = useCategories();
  const { useStaffList, createStaff, toggleActiveState, resetPassword, useRegistry, useReports } = useStaff();

  const { data: tickets = [], isLoading: ticketsLoading } = useAllTickets();
  const { data: categories = [] } = useCategoriesList();
  const { data: staffList = [] } = useStaffList();
  const { data: registry = [] } = useRegistry();
  const { data: reports } = useReports();
  const { data: selectedTicket } = useTicketDetails(selectedTicketId || 0);

  // Sync real-time updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleTicketUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      if (selectedTicketId) {
        queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', selectedTicketId] });
      }
    };

    const handleStaffUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    };

    const handleCategoryUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    };

    socket.on('ticket:created', handleTicketUpdate);
    socket.on('ticket:status_changed', handleTicketUpdate);
    socket.on('ticket:escalated', handleTicketUpdate);
    socket.on('ticket:reassigned', handleTicketUpdate);
    socket.on('staff:changed', handleStaffUpdate);
    socket.on('category:changed', handleCategoryUpdate);

    return () => {
      socket.off('ticket:created', handleTicketUpdate);
      socket.off('ticket:status_changed', handleTicketUpdate);
      socket.off('ticket:escalated', handleTicketUpdate);
      socket.off('ticket:reassigned', handleTicketUpdate);
      socket.off('staff:changed', handleStaffUpdate);
      socket.off('category:changed', handleCategoryUpdate);
    };
  }, [socket, selectedTicketId, queryClient]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="text-brand-text-muted font-bold animate-pulse">Initializing Administrative dashboard...</p>
      </div>
    );
  }

  const handleReassign = (e: React.FormEvent, ticketId: number) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    reassignTicket.mutate(
      { id: ticketId, staff_id: Number(selectedStaffId) },
      {
        onSuccess: () => {
          setSelectedStaffId('');
          setDetailModalOpen(false);
          setSelectedTicketId(null);
        }
      }
    );
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');

    if (!staffName.trim() || !staffEmail.trim() || !staffCategoryId) {
      setStaffError('All fields are mandatory.');
      return;
    }

    createStaff.mutate(
      { name: staffName.trim(), email: staffEmail.trim(), category_id: staffCategoryId },
      {
        onSuccess: () => {
          setStaffName('');
          setStaffEmail('');
          setStaffCategoryId(0);
          setStaffModalOpen(false);
        },
        onError: (err: any) => {
          setStaffError(err.response?.data?.error || 'Failed to create staff member.');
        }
      }
    );
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    createCategory.mutate(
      { name: catName.trim(), description: catDesc, escalation_hours: catHours },
      {
        onSuccess: () => {
          setCatName('');
          setCatDesc('');
          setCatHours(48);
        }
      }
    );
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this category? Historical tickets will be preserved.')) {
      deleteCategory.mutate(id);
    }
  };

  const handleToggleStaffActive = (userId: number) => {
    toggleActiveState.mutate(userId);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!passwordResetUserId || !newPassword.trim() || newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    resetPassword.mutate(
      { userId: passwordResetUserId, password: newPassword.trim() },
      {
        onSuccess: () => {
          setResetSuccess('Password reset successfully!');
          setNewPassword('');
          setTimeout(() => {
            setPasswordResetUserId(null);
            setResetSuccess('');
          }, 1500);
        },
        onError: (err: any) => {
          setResetError(err.response?.data?.error || 'Failed to reset password.');
        }
      }
    );
  };

  // Stats derivations
  const totalTickets = tickets.length;
  const activeCount = tickets.filter(
    (t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'reopened' || t.status === 'escalated'
  ).length;
  const escalatedCount = tickets.filter((t) => t.status === 'escalated').length;

  const sidebarTabs = [
    {
      id: 'tickets',
      name: 'All Tickets',
      icon: <FiInbox className="h-4 w-4" />,
      onClick: () => setActiveTab('tickets')
    },
    {
      id: 'staff',
      name: 'Manage Staff',
      icon: <FiUsers className="h-4 w-4" />,
      onClick: () => setActiveTab('staff')
    },
    {
      id: 'categories',
      name: 'Categories',
      icon: <FiSettings className="h-4 w-4" />,
      onClick: () => setActiveTab('categories')
    },
    {
      id: 'registry',
      name: 'Registry',
      icon: <FiShield className="h-4 w-4" />,
      onClick: () => setActiveTab('registry')
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: <FiBarChart2 className="h-4 w-4" />,
      onClick: () => setActiveTab('reports')
    }
  ];

  return (
    <DashboardLayout
      roleName="Administrator (HOD)"
      userName={currentUser.name}
      activeTab={activeTab}
      tabs={sidebarTabs}
    >
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-main font-sans">
          HOD Administrative Controls
        </h1>
        <p className="text-brand-text-muted text-sm font-semibold">
          Department of Computer Science UNN Support Infrastructure.
        </p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Filed complaints"
          value={totalTickets}
          description="Lifetime ticketing database volume"
          icon={<FiFolder className="h-6 w-6" />}
        />
        <StatCard
          title="Active Ticketing queue"
          value={activeCount}
          description="Open, Claimed, Reopened"
          icon={<FiActivity className="h-6 w-6" />}
        />
        <StatCard
          title="Escalated warnings"
          value={escalatedCount}
          description="Urgent: Auto-escalated to HOD"
          icon={<FiAlertTriangle className="h-6 w-6" />}
        />
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {/* Tab 1: All Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Full Ticketing Registry</h2>
            {ticketsLoading ? (
              <p className="text-xs italic text-brand-text-muted/65">Loading ticketing log...</p>
            ) : tickets.length === 0 ? (
              <EmptyState
                title="No tickets filed yet"
                description="The student registration complaint database is completely empty."
                icon="inbox"
              />
            ) : (
              <TicketTable
                tickets={tickets}
                onViewDetails={(ticket) => {
                  setSelectedTicketId(ticket.id);
                  setDetailModalOpen(true);
                }}
              />
            )}
          </div>
        )}

        {/* Tab 2: Manage Staff Specialist */}
        {activeTab === 'staff' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Staff Workload Specializations</h2>
              <button
                onClick={() => setStaffModalOpen(true)}
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold py-2.5 px-4 rounded-xl transition"
              >
                + Add Staff Specialist
              </button>
            </div>
            {staffList.length === 0 ? (
              <EmptyState
                title="No staff specialists registered"
                description="Create a staff account and link them to ticket categories to begin auto-routing incoming complaints."
                icon="folder"
                actionButton={{
                  label: "Add Specialist",
                  onClick: () => setStaffModalOpen(true)
                }}
              />
            ) : (
              <DataTable
                data={staffList}
                keyExtractor={(s) => s.id}
                columns={[
                  { key: 'full_name', label: 'Specialist Name', className: 'font-bold' },
                  {
                    key: 'category',
                    label: 'Specialty Category',
                    render: (s) => (
                      <span className="text-xs font-bold bg-brand-silver/10 px-2 py-1 rounded text-brand-text-muted">
                        {s.category || 'Unassigned'}
                      </span>
                    ),
                  },
                  { key: 'email', label: 'Email Address', className: 'text-brand-text-muted' },
                  {
                    key: 'workload_count',
                    label: 'Active Workloads',
                    render: (s) => (
                      <span className="font-extrabold text-brand-primary">{s.workload_count} active tickets</span>
                    ),
                  },
                  {
                    key: 'is_active',
                    label: 'Status',
                    render: (s) =>
                      s.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-silver/20 text-brand-text-muted border border-brand-border/30">
                          Inactive
                        </span>
                      ),
                  },
                ]}
                actions={[
                  {
                    label: 'Reset Pass',
                    onClick: (s) => setPasswordResetUserId(s.id),
                    variant: 'ghost',
                  },
                  {
                    label: (s) => (s.is_active ? 'Deactivate' : 'Activate'),
                    onClick: (s) => handleToggleStaffActive(s.id),
                    variant: 'outline',
                  },
                ]}
                emptyTitle="No staff specialists registered"
                emptyDescription="Create a staff account and link them to ticket categories to begin auto-routing incoming complaints."
              />
            )}
          </div>
        )}

        {/* Tab 3: Categories CRUD Settings */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* List */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Active Categories</h2>
              {categories.length === 0 ? (
                <EmptyState
                  title="No categories configured"
                  description="Register category slots (Academic, Facility, Portal) with escalation hour triggers."
                  icon="inbox"
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {categories.map((c) => (
                    <div key={c.id} className="bg-brand-card border border-brand-border/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-3 shadow-xs">
                      <div className="space-y-1 max-w-md">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-bold text-brand-text-main">{c.name}</h4>
                          <span className="text-[10px] font-extrabold uppercase bg-brand-silver/20 text-brand-text-muted px-2 py-0.5 rounded">
                            Escalation: {c.escalation_hours}h
                          </span>
                          {!c.is_active && (
                            <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Inactive</span>
                          )}
                        </div>
                        <p className="text-xs text-brand-text-muted font-semibold leading-relaxed">{c.description}</p>
                      </div>
                      {c.is_active && (
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="text-xs font-extrabold border border-brand-primary/40 hover:border-brand-primary hover:bg-brand-primary hover:text-brand-white text-brand-primary px-3 py-1.5 rounded-lg transition"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create form */}
            <div className="bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-lg font-extrabold text-brand-text-main font-sans">Create Category</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Category Name</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Hostel Accommodation"
                    className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    rows={3}
                    placeholder="Brief description..."
                    className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Escalation Threshold (Hours)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={catHours}
                    onChange={(e) => setCatHours(Number(e.target.value))}
                    className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={createCategory.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-3 rounded-xl transition shadow-xs"
                >
                  {createCategory.isPending ? 'Saving...' : 'Save Category'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Student Registry Logs */}
        {activeTab === 'registry' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Authorized Students Registry</h2>
            <p className="text-xs text-brand-text-muted font-medium">Preloaded student records permitted to perform activation registration.</p>
            {registry.length === 0 ? (
              <EmptyState
                title="Registry is empty"
                description="Add entries to student_registry table to authorize student self-activations."
                icon="folder"
              />
            ) : (
              <DataTable
                data={registry}
                keyExtractor={(r) => r.id}
                columns={[
                  { key: 'matric_no', label: 'Matric / Reg Number', className: 'font-bold text-brand-primary' },
                  { key: 'full_name', label: 'Official Full Name' },
                  { key: 'email', label: 'Official Email', className: 'text-brand-text-muted' },
                  {
                    key: 'is_used',
                    label: 'Activation Status',
                    render: (r) =>
                      r.is_used ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-primary text-brand-white">
                          Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20">
                          Unactivated
                        </span>
                      ),
                  },
                ]}
                emptyTitle="Registry is empty"
                emptyDescription="Add entries to student_registry table to authorize student self-activations."
              />
            )}
          </div>
        )}

        {/* Tab 5: Analytics Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Ticketing Metrics &amp; Charts</h2>

            {reports ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category volume */}
                <div className="bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-brand-text-main uppercase tracking-wider border-b border-brand-border/30 pb-2">
                    Complaints Volume by Category
                  </h3>
                  <div className="flex justify-center py-4">
                    {reports.byCategory.length === 0 ? (
                      <p className="text-xs italic text-brand-text-muted/50">No category statistics available.</p>
                    ) : (
                      <D3BarChart data={reports.byCategory} />
                    )}
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-brand-text-main uppercase tracking-wider border-b border-brand-border/30 pb-2">
                    System Status breakdown
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-4">
                    <D3PieChart data={reports.byStatus} />

                    <div className="space-y-1.5 text-xs font-semibold text-brand-text-muted">
                      {reports.byStatus.map((stat, idx) => {
                        const colors = ['#004d26', '#005d2e', '#d4dee5', '#b9c0c3', '#686a6d'];
                        const strokeColor = colors[idx % colors.length];
                        return (
                          <div key={stat.status} className="flex items-center space-x-2">
                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: strokeColor }} />
                            <span className="capitalize">{stat.status.replace('_', ' ')}:</span>
                            <span className="font-extrabold text-brand-text-main">{stat.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-brand-text-muted/60">Compiling statistics logs...</p>
            )}
          </div>
        )}
      </div>

      {/* Ticket Details Reassignment Dialog */}
      {detailModalOpen && selectedTicket && (
        <ModalOverlay onClose={() => { setDetailModalOpen(false); setSelectedTicketId(null); }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-border/30 pb-4">
              <div>
                <span className="text-xs font-bold bg-brand-silver/10 px-2 py-1 rounded text-brand-text-muted">
                  ADMINISTRATIVE OVERVIEW
                </span>
                <h3 className="text-xl font-extrabold text-brand-text-main mt-2">
                  {selectedTicket.ticket_ref}: {selectedTicket.title}
                </h3>
                <p className="text-[10px] text-brand-text-muted font-bold mt-1">
                  Filed By: {selectedTicket.student_name} ({selectedTicket.student_email || 'No email'} | Matric: {selectedTicket.student_matric || 'N/A'}) | Assigned Specialist: {selectedTicket.staff_name || 'Unassigned'}
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
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Complaint Detail Text</h4>
              <p className="text-sm bg-brand-bg/50 border border-brand-border/20 p-4 rounded-xl leading-relaxed text-brand-text-main font-medium">
                {selectedTicket.description}
              </p>
            </div>

            {/* Reopen reason if flagged */}
            {selectedTicket.reopen_reason && (
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/30 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Reason for Reopening</h4>
                <p className="text-xs text-brand-text-main font-semibold">
                  "{selectedTicket.reopen_reason}"
                </p>
              </div>
            )}

            {/* Resolution Note if resolved */}
            {selectedTicket.resolution_notes && (
              <div className="space-y-2 bg-brand-primary/5 border border-brand-primary/40 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Resolution details</h4>
                <p className="text-xs text-brand-text-main font-semibold leading-relaxed">
                  {selectedTicket.resolution_notes}
                </p>
              </div>
            )}

            {/* Reassignment form */}
            <div className="border-t border-brand-border/30 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Reassign Complaint workload</h4>

              <form onSubmit={(e) => handleReassign(e, selectedTicket.id)} className="flex flex-col sm:flex-row gap-2">
                <select
                  required
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                >
                  <option value="">-- Select Specialist --</option>
                  {staffList.filter(s => s.is_active).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.category || 'Specialist'})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={reassignTicket.isPending}
                  className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                >
                  {reassignTicket.isPending ? 'Saving...' : 'Reassign'}
                </button>
              </form>
            </div>
        </ModalOverlay>
      )}

      {/* Reset password Modal */}
      {passwordResetUserId && (
        <ModalOverlay onClose={() => setPasswordResetUserId(null)} maxWidth="max-w-md">
            <h3 className="text-lg font-extrabold text-brand-text-main">Reset Staff Password</h3>
            {resetError && <p className="text-xs text-red-600 font-bold">{resetError}</p>}
            {resetSuccess && <p className="text-xs text-brand-secondary font-bold">{resetSuccess}</p>}
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordResetUserId(null)}
                  className="w-1/2 border border-brand-border text-brand-text-muted hover:text-brand-primary font-bold py-2 px-4 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetPassword.isPending}
                  className="w-1/2 bg-brand-primary text-brand-white font-extrabold py-2 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetPassword.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
        </ModalOverlay>
      )}

      {/* Create Staff Specialist Modal Overlay */}
      {staffModalOpen && (
        <ModalOverlay onClose={() => setStaffModalOpen(false)} maxWidth="max-w-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-extrabold text-brand-text-main">Add Staff Specialist</h3>
                <p className="text-[10px] text-brand-text-muted font-bold">Register a new specialist to handle category assignments.</p>
              </div>
              <button
                onClick={() => setStaffModalOpen(false)}
                className="text-brand-text-muted hover:text-brand-primary font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              {staffError && (
                <div className="p-3 bg-red-500/10 border border-red-500/35 text-red-700 text-xs font-bold rounded-lg">
                  {staffError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Specialist Name</label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Dr. Jane Doe"
                  className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. jane.doe@unn.edu.ng"
                  className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">Specialty Category</label>
                <select
                  required
                  value={staffCategoryId || ''}
                  onChange={(e) => setStaffCategoryId(Number(e.target.value))}
                  className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.filter(c => c.is_active).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="w-1/2 border border-brand-border hover:border-brand-primary text-brand-text-muted hover:text-brand-primary font-bold py-2.5 px-4 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createStaff.isPending}
                  className="w-1/2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-brand-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition"
                >
                  {createStaff.isPending ? 'Saving...' : 'Add Specialist'}
                </button>
              </div>
            </form>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
