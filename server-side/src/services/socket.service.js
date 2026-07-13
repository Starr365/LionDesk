/**
 * Socket.IO event emitter service.
 * Provides helper functions to emit real-time events to targeted rooms.
 * The `io` instance is set once from app.js after Socket.IO initializes.
 */

let io = null;

/**
 * Initialize the socket service with the Socket.IO server instance.
 */
export const initSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

/**
 * Get the active io instance (for direct use in controllers if needed).
 */
export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized. Call initSocket() first.');
  return io;
};

// ---- Event Emitters ----

export const emitTicketCreated = (ticket, studentId, staffId) => {
  if (!io) return;
  io.to(`user:${studentId}`).emit('ticket:created', { ticket });
  if (staffId) io.to(`user:${staffId}`).emit('ticket:created', { ticket });
  io.to('role:admin').emit('ticket:created', { ticket });
};

export const emitTicketStatusChanged = (ticketId, newStatus, studentId, staffId) => {
  if (!io) return;
  io.to(`user:${studentId}`).emit('ticket:status_changed', { ticketId, newStatus });
  if (staffId) io.to(`user:${staffId}`).emit('ticket:status_changed', { ticketId, newStatus });
  io.to('role:admin').emit('ticket:status_changed', { ticketId, newStatus });
};

export const emitTicketCommented = (ticketId, comment, studentId, staffId) => {
  if (!io) return;
  io.to(`user:${studentId}`).emit('ticket:commented', { ticketId, comment });
  if (staffId) io.to(`user:${staffId}`).emit('ticket:commented', { ticketId, comment });
};

export const emitTicketReassigned = (ticketId, oldStaffId, newStaffId, studentId) => {
  if (!io) return;
  if (oldStaffId) io.to(`user:${oldStaffId}`).emit('ticket:reassigned', { ticketId });
  io.to(`user:${newStaffId}`).emit('ticket:reassigned', { ticketId });
  io.to(`user:${studentId}`).emit('ticket:reassigned', { ticketId });
  io.to('role:admin').emit('ticket:reassigned', { ticketId });
};

export const emitTicketReopened = (ticketId, staffId) => {
  if (!io) return;
  if (staffId) io.to(`user:${staffId}`).emit('ticket:reopened', { ticketId });
  io.to('role:admin').emit('ticket:reopened', { ticketId });
};

export const emitTicketEscalated = (ticketId) => {
  if (!io) return;
  io.to('role:admin').emit('ticket:escalated', { ticketId });
};

export const emitNotification = (userId, notification) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification:new', notification);
};

export const emitStaffChanged = () => {
  if (!io) return;
  io.to('role:admin').emit('staff:changed');
};

export const emitCategoryChanged = () => {
  if (!io) return;
  io.to('role:admin').emit('category:changed');
  io.to('role:student').emit('category:changed');
};
