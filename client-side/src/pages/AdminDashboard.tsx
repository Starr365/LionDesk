import React, { useState, useEffect } from 'react';
import { mockDb, Ticket, Category, User, STUDENT_REGISTRY } from '../services/mockDb';
import { DashboardLayout } from '../components/shared/DashboardLayout';
import { StatCard } from '../components/shared/StatCard';
import { TicketTable } from '../components/shared/TicketTable';
import { FiInbox, FiUsers, FiSettings, FiShield, FiBarChart2, FiFolder, FiActivity, FiAlertTriangle } from 'react-icons/fi';

export const AdminDashboard: React.FC = () => {
  const currentUser = { id: 'usr-6', name: 'Prof. Augustine HOD', role: 'admin' as const };

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  
  // Tab control
  const [activeTab, setActiveTab] = useState('tickets');

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Category Form state
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catHours, setCatHours] = useState(48);

  // Reassignment state
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Add Staff state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffCategory, setStaffCategory] = useState('');
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffError, setStaffError] = useState('');

  const loadData = () => {
    setTickets(mockDb.getTickets());
    setCategories(mockDb.getCategories());
    setStaffList(mockDb.getStaffList());

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

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catDesc.trim()) return;

    mockDb.addCategory({
      name: catName,
      description: catDesc,
      escalationHours: Number(catHours)
    });

    setCatName('');
    setCatDesc('');
    setCatHours(48);
  };

  const handleDeleteCategory = (id: string) => {
    mockDb.deleteCategory(id);
  };

  const handleReassign = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    mockDb.reassignTicket(ticketId, selectedStaffId);
    setSelectedStaffId('');
    setDetailModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');

    if (!staffName.trim() || !staffEmail.trim() || !staffCategory) {
      setStaffError('All fields are mandatory.');
      return;
    }

    mockDb.addStaff({
      name: staffName,
      email: staffEmail,
      category: staffCategory
    });

    setStaffName('');
    setStaffEmail('');
    setStaffCategory('');
    setStaffModalOpen(false);
  };

  const handleToggleStaffActive = (id: string) => {
    mockDb.toggleUserActive(id);
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

  // Dynamic D3-style calculations
  const categoriesCount: Record<string, number> = {};
  const statusCount: Record<string, number> = {};
  
  tickets.forEach((t) => {
    categoriesCount[t.category] = (categoriesCount[t.category] || 0) + 1;
    statusCount[t.status] = (statusCount[t.status] || 0) + 1;
  });

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
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Full Ticketing Registry</h2>
            <TicketTable
              tickets={tickets}
              onViewDetails={(ticket) => {
                setSelectedTicket(ticket);
                setDetailModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 2: Manage Staff Specialist */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Staff Workload Specializations</h2>
              <button
                onClick={() => setStaffModalOpen(true)}
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold py-2.5 px-4 rounded-xl transition"
              >
                + Add Staff Specialist
              </button>
            </div>
            <div className="bg-brand-card border border-brand-border/40 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/30 bg-brand-bg/30 text-xs font-extrabold uppercase tracking-wider text-brand-text-muted">
                    <th className="py-4 px-6">Specialist Name</th>
                    <th className="py-4 px-6">Specialty Category</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Active Handled Workloads</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/20 text-sm font-semibold text-brand-text-main">
                  {staffList.map((s) => {
                    const activeW = tickets.filter(
                      (t) => t.staffId === s.id && (t.status === 'open' || t.status === 'in_progress' || t.status === 'reopened')
                    ).length;
                    return (
                      <tr key={s.id} className="hover:bg-brand-bg/15 transition">
                        <td className="py-4 px-6 font-bold">{s.name}</td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold bg-brand-silver/10 px-2 py-1 rounded text-brand-text-muted">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-brand-text-muted">{s.email}</td>
                        <td className="py-4 px-6">
                          <span className="font-extrabold text-brand-primary">{activeW} active tickets</span>
                        </td>
                        <td className="py-4 px-6">
                          {s.isActive === false ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-silver/20 text-brand-text-muted border border-brand-border/30">
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleToggleStaffActive(s.id)}
                            className="bg-transparent border border-brand-primary hover:bg-brand-primary hover:text-brand-white text-brand-primary text-xs font-extrabold px-3 py-1.5 rounded-lg transition"
                          >
                            {s.isActive === false ? 'Activate' : 'Deactivate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Categories CRUD Settings */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* List */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Active Categories</h2>
              <div className="grid grid-cols-1 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-brand-card border border-brand-border/40 p-5 rounded-2xl flex justify-between items-start shadow-xs">
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center space-x-2.5">
                        <h4 className="text-lg font-bold text-brand-text-main">{c.name}</h4>
                        <span className="text-[10px] font-extrabold uppercase bg-brand-silver/20 text-brand-text-muted px-2 py-0.5 rounded">
                          Escalation: {c.escalationHours}h
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-muted font-semibold leading-relaxed">{c.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="text-xs font-extrabold border border-brand-primary/40 hover:border-brand-primary hover:bg-brand-primary hover:text-brand-white text-brand-primary px-3 py-1.5 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
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
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-extrabold py-3 rounded-xl shadow-xs transition"
                >
                  Add Category specialty
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Student Registry */}
        {activeTab === 'registry' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">Pre-Verified Student registry</h2>
            <p className="text-xs text-brand-text-muted font-semibold">Pre-loaded matric credentials permitted to run registration activation.</p>
            
            <div className="bg-brand-card border border-brand-border/40 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/30 bg-brand-bg/30 text-xs font-extrabold uppercase tracking-wider text-brand-text-muted">
                    <th className="py-4 px-6">Matric / Registration Number</th>
                    <th className="py-4 px-6">Official Name</th>
                    <th className="py-4 px-6">Verified University Email Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/20 text-sm font-semibold text-brand-text-main">
                  {STUDENT_REGISTRY.map((r, i) => (
                    <tr key={i} className="hover:bg-brand-bg/15 transition">
                      <td className="py-4 px-6 font-bold text-brand-primary">{r.matricNo}</td>
                      <td className="py-4 px-6">{r.name}</td>
                      <td className="py-4 px-6 text-brand-text-muted">{r.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Reports & Analytics */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <h2 className="text-xl font-extrabold text-brand-text-main font-sans">System Reports &amp; Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chart 1: Volume by Category */}
              <div className="bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-brand-text-main uppercase tracking-wider border-b border-brand-border/30 pb-2">
                  Complaints Volume by Category
                </h3>
                {/* SVG D3-style Bar Chart */}
                <div className="flex justify-center py-4">
                  <svg width="340" height="200" viewBox="0 0 340 200">
                    {/* Render Category Bars */}
                    {categories.map((cat, index) => {
                      const count = categoriesCount[cat.name] || 0;
                      const maxCount = Math.max(...categories.map(c => categoriesCount[c.name] || 0), 1);
                      const barWidth = 35;
                      const barHeight = (count / maxCount) * 120;
                      const x = 50 + index * 90;
                      const y = 150 - barHeight;

                      return (
                        <g key={cat.id} className="group">
                          {/* Value Tag */}
                          <text x={x + barWidth/2} y={y - 8} textAnchor="middle" className="text-xs font-extrabold fill-brand-primary">
                            {count}
                          </text>
                          {/* Bar */}
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="4"
                            className="fill-brand-primary group-hover:fill-brand-secondary transition duration-200"
                          />
                          {/* Label */}
                          <text x={x + barWidth/2} y="170" textAnchor="middle" className="text-[10px] font-bold fill-brand-text-muted">
                            {cat.name}
                          </text>
                        </g>
                      );
                    })}
                    {/* Axis Line */}
                    <line x1="30" y1="150" x2="310" y2="150" stroke="#b9c0c3" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Chart 2: Status breakdown */}
              <div className="bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-brand-text-main uppercase tracking-wider border-b border-brand-border/30 pb-2">
                  System Status breakdown
                </h3>
                {/* SVG Pie Chart/Donut Chart */}
                <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-4">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle cx="75" cy="75" r="50" fill="none" stroke="#e1e5e9" strokeWidth="20" />
                    {/* Custom dynamic visual slices based on ratios */}
                    {Object.keys(statusCount).length > 0 ? (
                      (() => {
                        let accumulatedPercent = 0;
                        return Object.entries(statusCount).map(([status, count], idx) => {
                          const total = tickets.length;
                          const pct = count / total;
                          const strokeDasharray = `${pct * 314} 314`;
                          const strokeDashoffset = `${-accumulatedPercent * 314}`;
                          accumulatedPercent += pct;

                          // Color schemes
                          const colors = ['#004d26', '#005d2e', '#d4dee5', '#b9c0c3', '#686a6d'];
                          const strokeColor = colors[idx % colors.length];

                          return (
                            <circle
                              key={status}
                              cx="75"
                              cy="75"
                              r="50"
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="20"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              transform="rotate(-90 75 75)"
                            />
                          );
                        });
                      })()
                    ) : (
                      <circle cx="75" cy="75" r="50" fill="none" stroke="#004d26" strokeWidth="20" />
                    )}
                  </svg>

                  {/* Legend */}
                  <div className="space-y-1.5 text-xs font-semibold text-brand-text-muted">
                    {Object.entries(statusCount).map(([status, count], idx) => {
                      const colors = ['#004d26', '#005d2e', '#d4dee5', '#b9c0c3', '#686a6d'];
                      const strokeColor = colors[idx % colors.length];
                      return (
                        <div key={status} className="flex items-center space-x-2">
                          <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: strokeColor }} />
                          <span className="capitalize">{status.replace('_', ' ')}:</span>
                          <span className="font-extrabold text-brand-text-main">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Reassignment Dialog */}
      {detailModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-brand-primary/15 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-card border border-brand-border/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-border/30 pb-4">
              <div>
                <span className="text-xs font-bold bg-brand-silver/10 px-2 py-1 rounded text-brand-text-muted">
                  ADMINISTRATIVE OVERVIEW
                </span>
                <h3 className="text-xl font-extrabold text-brand-text-main mt-2">
                  {selectedTicket.id}: {selectedTicket.title}
                </h3>
                <p className="text-[10px] text-brand-text-muted font-bold mt-1">
                  Filed By: {selectedTicket.studentName} | Assigned Specialist: {selectedTicket.staffName || 'Unassigned'}
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
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Complaint Detail Text</h4>
              <p className="text-sm bg-brand-bg/50 border border-brand-border/20 p-4 rounded-xl leading-relaxed text-brand-text-main font-medium">
                {selectedTicket.description}
              </p>
            </div>

            {/* Reopen reason if flagged */}
            {selectedTicket.reopenReason && (
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/30 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Reason for Reopening</h4>
                <p className="text-xs text-brand-text-main font-semibold">
                  "{selectedTicket.reopenReason}"
                </p>
              </div>
            )}

            {/* Resolution Note if resolved */}
            {selectedTicket.resolutionNote && (
              <div className="space-y-2 bg-brand-primary/5 border border-brand-primary/40 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Resolution details</h4>
                <p className="text-xs text-brand-text-main font-semibold leading-relaxed">
                  {selectedTicket.resolutionNote}
                </p>
              </div>
            )}

            {/* Reassignment form */}
            <div className="border-t border-brand-border/30 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Reassign Complaint workload</h4>
              
              <form onSubmit={(e) => handleReassign(e, selectedTicket.id)} className="flex gap-2">
                <select
                  required
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="flex-1 bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                >
                  <option value="">-- Select Specialist --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                >
                  Reassign Workload
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Create Staff Specialist Modal Overlay */}
      {staffModalOpen && (
        <div className="fixed inset-0 bg-brand-primary/15 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-card border border-brand-border/40 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
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
                <div className="p-3 bg-brand-primary/5 border border-brand-primary text-brand-primary text-xs font-bold rounded-lg">
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
                  value={staffCategory}
                  onChange={(e) => setStaffCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border/50 rounded-xl px-4 py-2.5 text-xs text-brand-text-main focus:outline-none focus:border-brand-primary font-semibold transition"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
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
                  className="w-1/2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition"
                >
                  Add Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
