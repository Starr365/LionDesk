import React from 'react';

interface Ticket {
  id: number;
  ticket_ref: string;
  title: string;
  category?: string;
  category_name?: string;
  studentName?: string;
  student_name?: string;
  student_email?: string;
  student_matric?: string;
  staffName?: string | null;
  staff_name?: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened' | 'escalated';
  created_at: string;
  date?: string; // Fallback
}

interface TicketTableProps {
  tickets: Ticket[];
  onViewDetails: (ticket: any) => void;
  showAssignee?: boolean;
  showSubmitter?: boolean;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onViewDetails,
  showAssignee = true,
  showSubmitter = true
}) => {
  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-light text-brand-primary border border-brand-primary/20">
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary text-brand-white">
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-silver/20 text-brand-text-muted border border-brand-border/30">
            Closed
          </span>
        );
      case 'reopened':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-light/60 text-brand-primary border border-brand-primary/45">
            Reopened
          </span>
        );
      case 'escalated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-dark text-brand-white border border-brand-primary animate-pulse">
            Escalated
          </span>
        );
      default:
        return null;
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-brand-card border border-brand-border/40 rounded-2xl">
        <p className="text-brand-text-muted font-bold text-sm">No tickets found in this queue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden md:block bg-brand-card border border-brand-border/40 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border/30 bg-brand-bg/30 text-xs uppercase font-extrabold tracking-wider text-brand-text-muted">
                <th className="py-4 px-6">Ticket ID</th>
                <th className="py-4 px-6">Subject</th>
                <th className="py-4 px-6">Category</th>
                {showSubmitter && <th className="py-4 px-6">Submitter</th>}
                {showAssignee && <th className="py-4 px-6">Assignee</th>}
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-sm font-semibold">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-brand-bg/15 transition duration-150">
                  <td className="py-4 px-6 text-brand-primary font-bold">{ticket.ticket_ref}</td>
                  <td className="py-4 px-6 text-brand-text-main max-w-xs truncate">
                    {ticket.title}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold bg-brand-silver/10 px-2 py-1 rounded-md text-brand-text-muted">
                      {ticket.category_name || ticket.category}
                    </span>
                  </td>
                  {showSubmitter && (
                    <td className="py-4 px-6 text-brand-text-muted">
                      {ticket.student_name || ticket.studentName}
                    </td>
                  )}
                  {showAssignee && (
                    <td className="py-4 px-6 text-brand-text-muted">
                      {ticket.staff_name || ticket.staffName ? (ticket.staff_name || ticket.staffName) : <span className="italic text-brand-text-muted/50">Unassigned</span>}
                    </td>
                  )}
                  <td className="py-4 px-6">{getStatusBadge(ticket.status)}</td>
                  <td className="py-4 px-6 text-brand-text-muted text-xs">
                    {new Date(ticket.created_at || ticket.date || '').toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onViewDetails(ticket)}
                      className="bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white text-xs font-extrabold px-3 py-1.5 rounded-lg transition"
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-brand-card border border-brand-border/40 p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-primary font-bold">{ticket.ticket_ref}</span>
              {getStatusBadge(ticket.status)}
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-brand-text-main leading-snug">{ticket.title}</h4>
              <p className="text-[10px] text-brand-text-muted font-bold">
                {new Date(ticket.created_at || ticket.date || '').toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="flex flex-col gap-1 text-[10px] font-semibold text-brand-text-muted pt-2.5 border-t border-brand-border/20">
              <div className="flex justify-between">
                <span>Category: <span className="text-brand-text-main font-bold">{ticket.category_name || ticket.category}</span></span>
                {showSubmitter && (
                  <span>Submitter: <span className="text-brand-text-main font-bold">{ticket.student_name || ticket.studentName}</span></span>
                )}
              </div>
              {showAssignee && (
                <div>
                  Assignee: <span className="text-brand-text-main font-bold">{ticket.staff_name || ticket.staffName ? (ticket.staff_name || ticket.staffName) : 'Unassigned'}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onViewDetails(ticket)}
                className="w-full text-center bg-transparent border border-brand-primary hover:bg-brand-primary hover:text-brand-white text-xs font-extrabold py-2 rounded-xl transition"
              >
                View Details &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TicketTable;
