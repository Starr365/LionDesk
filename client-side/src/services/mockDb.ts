export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
  matricNo?: string;
  category?: string; // For staff members
  isActive?: boolean; // For deactivation status
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  text: string;
  date: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened' | 'escalated';
  studentId: string;
  studentName: string;
  staffId?: string;
  staffName?: string;
  date: string;
  comments: Comment[];
  resolutionNote?: string;
  feedback?: string;
  reopenReason?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  escalationHours: number;
}

// Pre-verified student registration list
export const STUDENT_REGISTRY = [
  { matricNo: '2021/240123', name: 'Chidi Egwu', email: 'chidi.egwu.student@unn.edu.ng' },
  { matricNo: '2022/240456', name: 'Stella Starr', email: 'stella.starr.student@unn.edu.ng' },
  { matricNo: '2023/240789', name: 'Nkem Okafor', email: 'nkem.okafor.student@unn.edu.ng' }
];

// Initial mock database state in memory
let users: User[] = [
  { id: 'usr-1', name: 'Chidi Egwu', email: 'chidi.egwu.student@unn.edu.ng', role: 'student', matricNo: '2021/240123', isActive: true },
  { id: 'usr-2', name: 'Stella Starr', email: 'stella.starr.student@unn.edu.ng', role: 'student', matricNo: '2022/240456', isActive: true },
  { id: 'usr-3', name: 'Dr. Charles Uzo', email: 'charles.uzo.staff@unn.edu.ng', role: 'staff', category: 'Academic', isActive: true },
  { id: 'usr-4', name: 'Mrs. Ngozi Alao', email: 'ngozi.alao.staff@unn.edu.ng', role: 'staff', category: 'Portal', isActive: true },
  { id: 'usr-5', name: 'Engr. Frank Eke', email: 'frank.eke.staff@unn.edu.ng', role: 'staff', category: 'Facility', isActive: true },
  { id: 'usr-6', name: 'Prof. Augustine HOD', email: 'hod.cs@unn.edu.ng', role: 'admin', isActive: true }
];

let categories: Category[] = [
  { id: 'cat-1', name: 'Academic', description: 'Course registrations, result discrepancies, lectures', escalationHours: 48 },
  { id: 'cat-2', name: 'Portal', description: 'Logins, profile errors, fee clearance updates', escalationHours: 24 },
  { id: 'cat-3', name: 'Facility', description: 'Lab computers, power issues, projector repairs', escalationHours: 72 }
];

let tickets: Ticket[] = [
  {
    id: 'TK-100244',
    title: 'Result missing for COS 301 first semester',
    description: 'My score for COS 301 is showing outstanding on the portal, but I sat for the exam and signed the attendance sheet.',
    category: 'Academic',
    status: 'open',
    studentId: 'usr-2',
    studentName: 'Stella Starr',
    staffId: 'usr-3',
    staffName: 'Dr. Charles Uzo',
    date: '2026-07-01T10:00:00Z',
    comments: [
      {
        id: 'c-1',
        ticketId: 'TK-100244',
        authorId: 'usr-2',
        authorName: 'Stella Starr',
        authorRole: 'student',
        text: 'I have attached my continuous assessment sheet copy to proof attendance.',
        date: '2026-07-01T10:05:00Z'
      }
    ]
  },
  {
    id: 'TK-100242',
    title: 'Unable to select elective course COS 312',
    description: 'The school portal throws an database integrity error when attempting to add COS 312 to my semester list.',
    category: 'Portal',
    status: 'in_progress',
    studentId: 'usr-1',
    studentName: 'Chidi Egwu',
    staffId: 'usr-4',
    staffName: 'Mrs. Ngozi Alao',
    date: '2026-06-30T14:30:00Z',
    comments: [
      {
        id: 'c-2',
        ticketId: 'TK-100242',
        authorId: 'usr-4',
        authorName: 'Mrs. Ngozi Alao',
        authorRole: 'staff',
        text: 'Checking the database logs to see why the lock occurs.',
        date: '2026-07-01T09:00:00Z'
      }
    ]
  },
  {
    id: 'TK-100231',
    title: 'Computer Lab 2 Projector bulb burnt',
    description: 'The projector bulb has blown out and we have practical sessions scheduled for tomorrow morning.',
    category: 'Facility',
    status: 'resolved',
    studentId: 'usr-2',
    studentName: 'Stella Starr',
    staffId: 'usr-5',
    staffName: 'Engr. Frank Eke',
    date: '2026-06-29T11:00:00Z',
    resolutionNote: 'The bulb has been replaced and testing confirmed the projector display is clear and fully functional.',
    comments: [],
    feedback: 'Thanks for fixing it so quickly!'
  },
  {
    id: 'TK-100227',
    title: 'Library database access key error',
    description: 'System credentials are not matching the active department server profile.',
    category: 'Portal',
    status: 'escalated',
    studentId: 'usr-1',
    studentName: 'Chidi Egwu',
    staffId: 'usr-4',
    staffName: 'Mrs. Ngozi Alao',
    date: '2026-06-28T09:00:00Z',
    comments: []
  }
];

// Helper to save and dispatch updates (simulates API load-outs)
const broadcastDbChange = () => {
  window.dispatchEvent(new Event('mockDbUpdate'));
};

// Database Query & Command Operations
export const mockDb = {
  getUsers: () => [...users],
  getStaffList: () => users.filter((u) => u.role === 'staff'),
  
  getCategories: () => [...categories],
  addCategory: (cat: Omit<Category, 'id'>) => {
    const newCat = { ...cat, id: `cat-${Date.now()}` };
    categories.push(newCat);
    broadcastDbChange();
    return newCat;
  },
  deleteCategory: (id: string) => {
    categories = categories.filter((c) => c.id !== id);
    broadcastDbChange();
  },

  getTickets: () => [...tickets],
  getTicketById: (id: string) => tickets.find((t) => t.id === id),

  createTicket: (data: { title: string; description: string; category: string; studentId: string; studentName: string }) => {
    // Determine target staff with least workload matching this category
    const categoryStaff = users.filter((u) => u.role === 'staff' && u.category === data.category);
    let assignedStaff: User | undefined;

    if (categoryStaff.length > 0) {
      // Find staff with least active tickets count
      let minTicketsCount = Infinity;
      categoryStaff.forEach((s) => {
        const activeCount = tickets.filter(
          (t) => t.staffId === s.id && (t.status === 'open' || t.status === 'in_progress')
        ).length;
        if (activeCount < minTicketsCount) {
          minTicketsCount = activeCount;
          assignedStaff = s;
        }
      });
    }

    const newTicket: Ticket = {
      id: `TK-${Math.floor(100000 + Math.random() * 900000)}`,
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'open',
      studentId: data.studentId,
      studentName: data.studentName,
      staffId: assignedStaff?.id,
      staffName: assignedStaff?.name,
      date: new Date().toISOString(),
      comments: []
    };

    tickets.unshift(newTicket);
    broadcastDbChange();
    return newTicket;
  },

  updateTicketStatus: (id: string, status: Ticket['status'], additionalData?: { resolutionNote?: string; feedback?: string; reopenReason?: string }) => {
    tickets = tickets.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status,
          ...additionalData
        };
      }
      return t;
    });
    broadcastDbChange();
  },

  reassignTicket: (ticketId: string, staffId: string) => {
    const staff = users.find((u) => u.id === staffId);
    if (!staff) return;
    tickets = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          staffId: staff.id,
          staffName: staff.name
        };
      }
      return t;
    });
    broadcastDbChange();
  },

  addComment: (ticketId: string, comment: { authorId: string; authorName: string; authorRole: string; text: string }) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      ticketId,
      ...comment,
      date: new Date().toISOString()
    };

    tickets = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          comments: [...t.comments, newComment]
        };
      }
      return t;
    });
    broadcastDbChange();
    return newComment;
  },

  // Student registration activation helper
  activateStudent: (matricNo: string, fullName: string, email: string) => {
    const record = STUDENT_REGISTRY.find(
      (r) => r.matricNo.toLowerCase() === matricNo.toLowerCase() && r.name.toLowerCase() === fullName.toLowerCase()
    );
    if (!record) return null;

    const existingUser = users.find((u) => u.matricNo === matricNo);
    if (existingUser) return existingUser;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: fullName,
      email,
      role: 'student',
      matricNo,
      isActive: true
    };
    users.push(newUser);
    broadcastDbChange();
    return newUser;
  },

  addStaff: (data: { name: string; email: string; category: string }) => {
    const newStaff: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'staff',
      category: data.category,
      isActive: true
    };
    users.push(newStaff);
    broadcastDbChange();
    return newStaff;
  },

  toggleUserActive: (id: string) => {
    users = users.map((u) => {
      if (u.id === id) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    broadcastDbChange();
  }
};
