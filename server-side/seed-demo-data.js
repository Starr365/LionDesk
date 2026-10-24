import bcrypt from 'bcryptjs';
import { pool } from './src/config/db.js';

const demoUsers = {
  admin: {
    email: 'admin@csunn.com',
    password: 'admin123',
    role: 'admin',
    fullName: 'Demo System Administrator'
  },
  staff: [
    { email: 'staff1@csunn.com', password: 'staff123', fullName: 'Prof Bakpo' },
    { email: 'staff2@csunn.com', password: 'staff123', fullName: 'Dr Mrs Ugwuishu' }
  ],
  students: [
    { email: 'student1@csunn.com', password: 'student123' },
    { email: 'student2@csunn.com', password: 'student123' }
  ]
};

async function upsertUser(connection, { email, password, role, fullName }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await connection.execute(
    `INSERT INTO users (email, password, role, full_name, is_active)
     VALUES (?, ?, ?, ?, TRUE)
     ON DUPLICATE KEY UPDATE
       id = LAST_INSERT_ID(id), password = VALUES(password), role = VALUES(role),
       full_name = VALUES(full_name), is_active = TRUE`,
    [email, passwordHash, role, fullName]
  );
  return result.insertId;
}

async function getOrCreateDemoStudent(connection, demoStudent) {
  const [existing] = await connection.execute(
    `SELECT u.id AS user_id, s.matric_no, r.full_name
     FROM users u
     LEFT JOIN students s ON s.user_id = u.id
     LEFT JOIN student_registry r ON r.matric_no = s.matric_no
     WHERE u.email = ?`,
    [demoStudent.email]
  );

  if (existing.length > 0 && existing[0].matric_no) {
    const student = existing[0];
    const userId = await upsertUser(connection, {
      ...demoStudent,
      role: 'student',
      fullName: student.full_name
    });
    await connection.execute('UPDATE student_registry SET is_used = TRUE WHERE matric_no = ?', [student.matric_no]);
    return { userId, matricNo: student.matric_no, fullName: student.full_name };
  }

  const [available] = await connection.query(
    `SELECT r.matric_no, r.full_name
     FROM student_registry r
     LEFT JOIN students s ON s.matric_no = r.matric_no
     WHERE r.is_used = FALSE AND s.id IS NULL
     ORDER BY RAND()
     LIMIT 1`
  );
  if (available.length === 0) throw new Error('No unused student-registry records are available for demo accounts.');

  const student = available[0];
  const userId = await upsertUser(connection, {
    ...demoStudent,
    role: 'student',
    fullName: student.full_name
  });
  await connection.execute('INSERT INTO students (user_id, matric_no) VALUES (?, ?)', [userId, student.matric_no]);
  await connection.execute('UPDATE student_registry SET is_used = TRUE WHERE matric_no = ?', [student.matric_no]);
  return { userId, matricNo: student.matric_no, fullName: student.full_name };
}

async function main() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const adminId = await upsertUser(connection, demoUsers.admin);
    const analyticsCategories = [
      ['Academic', 'Course registration, results, and departmental academic support', 48],
      ['Hardware', 'Computers, projectors, printers, and laboratory equipment', 72],
      ['Software', 'Portal, learning systems, licensed applications, and account tools', 24],
      ['Network', 'Wi-Fi, wired network, VPN, DNS, and connectivity support', 24]
    ];
    for (const [name, description, escalationHours] of analyticsCategories) {
      await connection.execute(
        `INSERT INTO categories (name, description, escalation_hours, is_active)
         VALUES (?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE description = VALUES(description), escalation_hours = VALUES(escalation_hours), is_active = TRUE`,
        [name, description, escalationHours]
      );
    }
    const [categories] = await connection.query(
      `SELECT id, name FROM categories WHERE name IN ('Academic', 'Hardware', 'Software', 'Network') ORDER BY FIELD(name, 'Academic', 'Hardware', 'Software', 'Network')`
    );
    if (categories.length !== analyticsCategories.length) throw new Error('Unable to prepare the analytics ticket categories.');
    const categoryByName = new Map(categories.map((category) => [category.name, category]));

    const staff = [];
    for (let index = 0; index < demoUsers.staff.length; index += 1) {
      const staffConfig = demoUsers.staff[index];
      const category = categories[index] ?? categories[0];
      const userId = await upsertUser(connection, { ...staffConfig, role: 'staff' });
      await connection.execute(
        `INSERT INTO staff (user_id, category_id, workload_count)
         VALUES (?, ?, 0)
         ON DUPLICATE KEY UPDATE category_id = VALUES(category_id)`,
        [userId, category.id]
      );
      staff.push({ userId, category });
    }

    const students = [];
    for (const demoStudent of demoUsers.students) students.push(await getOrCreateDemoStudent(connection, demoStudent));

    const ticketDefinitions = [
      { ref: 'DEMO-OPEN-001', category: 'Academic', title: 'Course registration assistance', description: 'I need help confirming my course registration for the current semester.', status: 'open', student: 0, staff: 0 },
      { ref: 'DEMO-PROGRESS-01', category: 'Software', title: 'Portal profile correction', description: 'My portal profile details need to be corrected before course registration.', status: 'in_progress', student: 1, staff: 1 },
      { ref: 'DEMO-RESOLVED-01', category: 'Academic', title: 'Missing result inquiry', description: 'A submitted course result is not yet visible on my academic record.', status: 'resolved', student: 0, staff: 0, resolution: 'The department verified and published the missing result.' },
      { ref: 'DEMO-CLOSED-001', category: 'Network', title: 'Laboratory network access request', description: 'I requested access to the computing laboratory network for project work.', status: 'closed', student: 1, staff: 1, resolution: 'Laboratory network access was granted and the request was confirmed.' },
      { ref: 'DEMO-ESCALATED-1', category: 'Hardware', title: 'Classroom projector fault', description: 'The projector in the assigned classroom is not powering on for lectures.', status: 'escalated', student: 0, staff: 1 },
      { ref: 'DEMO-AC-006', category: 'Academic', title: 'Adviser approval delay', description: 'My course adviser approval has not appeared on the registration portal.', status: 'in_progress', student: 1, staff: 0 },
      { ref: 'DEMO-AC-007', category: 'Academic', title: 'Transcript request follow-up', description: 'I need an update on the status of my departmental transcript request.', status: 'closed', student: 0, staff: 0, resolution: 'The transcript request was processed and sent to the registry office.' },
      { ref: 'DEMO-AC-008', category: 'Academic', title: 'Examination timetable conflict', description: 'Two scheduled examinations appear to overlap on my timetable this week.', status: 'escalated', student: 1, staff: 0 },
      { ref: 'DEMO-HW-009', category: 'Hardware', title: 'Laboratory computer will not boot', description: 'A workstation in the programming laboratory fails to start for practical work.', status: 'open', student: 0, staff: 1 },
      { ref: 'DEMO-HW-010', category: 'Hardware', title: 'Broken keyboard in lab', description: 'The keyboard assigned to my laboratory desk has several non-working keys.', status: 'closed', student: 1, staff: 1, resolution: 'The faulty keyboard was replaced by the laboratory technician.' },
      { ref: 'DEMO-HW-011', category: 'Hardware', title: 'Department printer queue issue', description: 'Documents remain pending in the department printer queue during office hours.', status: 'in_progress', student: 0, staff: 1 },
      { ref: 'DEMO-HW-012', category: 'Hardware', title: 'UPS power backup issue', description: 'The laboratory UPS has been repaired and power backup is now stable.', status: 'resolved', student: 1, staff: 1, resolution: 'The UPS battery connection was repaired and tested successfully.' },
      { ref: 'DEMO-SW-013', category: 'Software', title: 'Learning platform access', description: 'I cannot access the learning platform materials for my registered courses.', status: 'open', student: 0, staff: 1 },
      { ref: 'DEMO-SW-014', category: 'Software', title: 'Compiler license activation', description: 'The approved compiler software license has been activated on my workstation.', status: 'resolved', student: 1, staff: 1, resolution: 'The software license was renewed and the compiler now launches normally.' },
      { ref: 'DEMO-SW-015', category: 'Software', title: 'Development tool installation', description: 'I need help installing the required development tools for a practical course.', status: 'closed', student: 0, staff: 1, resolution: 'The required development tools were installed and verified.' },
      { ref: 'DEMO-SW-016', category: 'Software', title: 'University email client error', description: 'The university email client keeps displaying an authentication error message.', status: 'escalated', student: 1, staff: 1 },
      { ref: 'DEMO-NW-017', category: 'Network', title: 'Wi-Fi connection drops', description: 'The faculty Wi-Fi disconnects repeatedly while I am submitting coursework.', status: 'open', student: 0, staff: 0 },
      { ref: 'DEMO-NW-018', category: 'Network', title: 'Wired network timeout', description: 'The wired network connection in the laboratory times out during downloads.', status: 'in_progress', student: 1, staff: 0 },
      { ref: 'DEMO-NW-019', category: 'Network', title: 'VPN access restored', description: 'The remote campus VPN access issue has been resolved after verification.', status: 'resolved', student: 0, staff: 0, resolution: 'The VPN account was refreshed and access was successfully tested.' },
      { ref: 'DEMO-NW-020', category: 'Network', title: 'Department DNS outage', description: 'Departmental systems cannot resolve internal service addresses this morning.', status: 'escalated', student: 1, staff: 0 }
    ];

    const tickets = [];
    for (const definition of ticketDefinitions) {
      const category = categoryByName.get(definition.category);
      if (!category) throw new Error(`Unknown demo ticket category: ${definition.category}`);
      const resolvedAt = definition.status === 'resolved' ? new Date() : null;
      const closedAt = definition.status === 'closed' ? new Date() : null;
      await connection.execute(
        `INSERT INTO tickets
          (ticket_ref, title, description, category_id, status, student_id, staff_id, resolution_notes, resolved_at, closed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          title = VALUES(title), description = VALUES(description), category_id = VALUES(category_id),
          status = VALUES(status), student_id = VALUES(student_id), staff_id = VALUES(staff_id),
          resolution_notes = VALUES(resolution_notes), resolved_at = VALUES(resolved_at), closed_at = VALUES(closed_at)`,
        [definition.ref, definition.title, definition.description, category.id, definition.status,
          students[definition.student].userId, staff[definition.staff].userId, definition.resolution ?? null, resolvedAt, closedAt]
      );
      const [[ticket]] = await connection.execute('SELECT id, ticket_ref FROM tickets WHERE ticket_ref = ?', [definition.ref]);
      tickets.push(ticket);
    }

    await connection.execute(
      `DELETE n FROM notifications n
       INNER JOIN tickets t ON n.ticket_id = t.id
       WHERE t.ticket_ref IN (${ticketDefinitions.map(() => '?').join(', ')})`,
      ticketDefinitions.map((ticket) => ticket.ref)
    );
    await connection.execute(
      'INSERT INTO notifications (user_id, type, title, message, ticket_id) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
      [
        students[0].userId, 'confirmation', 'Demo ticket submitted', 'Your course registration ticket has been created.', tickets[0].id,
        students[0].userId, 'status_update', 'Demo ticket resolved', 'Your missing result inquiry has been resolved.', tickets[2].id
      ]
    );

    const [[demoTicketTotal]] = await connection.query(
      `SELECT COUNT(*) AS count FROM tickets WHERE ticket_ref LIKE 'DEMO-%'`
    );
    const [categorySummary] = await connection.query(
      `SELECT c.name, COUNT(*) AS count
       FROM tickets t JOIN categories c ON c.id = t.category_id
       WHERE t.ticket_ref LIKE 'DEMO-%'
       GROUP BY c.name ORDER BY c.name`
    );
    const [statusSummary] = await connection.query(
      `SELECT status, COUNT(*) AS count FROM tickets
       WHERE ticket_ref LIKE 'DEMO-%'
       GROUP BY status ORDER BY status`
    );

    await connection.commit();

    console.log('Demo seed completed successfully.');
    console.log(`Created or refreshed: 1 admin, 2 staff, ${students.length} activated students, ${tickets.length} tickets, and 2 notifications.`);
    console.log(`Demo ticket total: ${demoTicketTotal.count}. Categories: ${categorySummary.map((row) => `${row.name} ${row.count}`).join(', ')}.`);
    console.log(`Status distribution: ${statusSummary.map((row) => `${row.status} ${row.count}`).join(', ')}.`);
    console.log(`Demo student matric numbers: ${students.map((student) => student.matricNo).join(', ')}`);
    console.log(`Admin user ID: ${adminId}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`Demo seed failed: ${error.message}`);
  process.exitCode = 1;
});
