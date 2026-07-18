import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LionDesk API Documentation',
      version: '1.0.0',
      description: 'Departmental Help-Desk & Ticketing System API for Department of Computer Science, UNN. Designed with role-gated JWT authorization, real-time WebSocket event notifications, and hourly cron business days escalation checks.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['student', 'staff', 'admin'] },
            full_name: { type: 'string' },
            is_active: { type: 'boolean' }
          }
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            ticket_ref: { type: 'string', example: 'TK-100244' },
            title: { type: 'string' },
            description: { type: 'string' },
            category_id: { type: 'integer' },
            status: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed', 'escalated', 'reopened'] },
            student_id: { type: 'integer' },
            staff_id: { type: 'integer', nullable: true },
            resolution_notes: { type: 'string', nullable: true },
            feedback: { type: 'string', nullable: true },
            reopen_reason: { type: 'string', nullable: true }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            ticket_id: { type: 'integer' },
            author_id: { type: 'integer' },
            text: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            escalation_hours: { type: 'integer' },
            is_active: { type: 'boolean' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            type: { type: 'string', enum: ['confirmation', 'status_update', 'escalation', 'reminder', 'reopen'] },
            title: { type: 'string' },
            message: { type: 'string', nullable: true },
            is_read: { type: 'boolean' },
            ticket_id: { type: 'integer', nullable: true }
          }
        }
      }
    },
    paths: {
      '/api/auth/activate': {
        post: {
          summary: 'Student Self-Activation',
          description: 'Allows a student to activate their portal account by verifying their matriculation number against the student registry.',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['matric_no', 'full_name', 'email', 'password'],
                  properties: {
                    matric_no: { type: 'string', example: '2022/240456' },
                    full_name: { type: 'string', example: 'Stella Starr' },
                    email: { type: 'string', format: 'email', example: 'stella.starr.student@unn.edu.ng' },
                    password: { type: 'string', minLength: 6, example: 'studentpassword' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Activated successfully. Returns token and profile details.' },
            400: { description: 'Missing fields or validation errors.' },
            404: { description: 'No matching record found in pre-verified student registry.' },
            409: { description: 'Registry entry already activated or email already in use.' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'User Login',
          description: 'Login for students, staff, and admin. Returns JWT token.',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'hod.cs@unn.edu.ng' },
                    password: { type: 'string', example: 'admin123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login successful. Returns token and role-based user profile.' },
            401: { description: 'Invalid email or password.' },
            403: { description: 'Account deactivated by administrator.' }
          }
        }
      },
      '/api/auth/forgot-password': {
        post: {
          summary: 'Request Password Reset Token',
          description: 'Generates and stores a hashed password recovery token. Emails token to user (Resend).',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'stella.starr.student@unn.edu.ng' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Token generated (logged to server console in dev).' }
          }
        }
      },
      '/api/auth/reset-password': {
        post: {
          summary: 'Reset Password',
          description: 'Resets the password using the token sent in the forgot-password flow.',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'new_password'],
                  properties: {
                    token: { type: 'string' },
                    new_password: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Password reset successfully.' },
            400: { description: 'Invalid or expired token.' }
          }
        }
      },
      '/api/tickets': {
        post: {
          summary: 'Submit Ticket (Student)',
          description: 'Submits a new ticket. Auto-assigns staff using the category least-workload algorithm.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'category_id'],
                  properties: {
                    title: { type: 'string', example: 'Unable to view elective results' },
                    description: { type: 'string', minLength: 20, maxLength: 2000, example: 'My exam grade for COS 301 is outstanding on portal, signed attendance list.' },
                    category_id: { type: 'integer', example: 1 }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Ticket created and auto-assigned.' },
            400: { description: 'Validation error or invalid category.' },
            401: { description: 'Unauthorized JWT.' }
          }
        },
        get: {
          summary: 'Get All Tickets (Admin/HOD Only)',
          description: 'Retrieves all tickets. Supports status and category filters.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'status', in: 'query', schema: { type: 'string' } },
            { name: 'category_id', in: 'query', schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'List of all tickets.' },
            403: { description: 'Forbidden. Admin role required.' }
          }
        }
      },
      '/api/tickets/my': {
        get: {
          summary: 'Get My Tickets (Student)',
          description: 'Retrieves all tickets submitted by the authenticated student.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of student\'s own tickets.' }
          }
        }
      },
      '/api/tickets/assigned': {
        get: {
          summary: 'Get Assigned Tickets (Staff)',
          description: 'Retrieves all active and historical tickets assigned to the authenticated staff member.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of assigned tickets.' }
          }
        }
      },
      '/api/tickets/{id}': {
        get: {
          summary: 'Get Ticket Details',
          description: 'Retrieves single ticket details including comments timeline.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Ticket object with comment logs.' },
            404: { description: 'Ticket not found.' }
          }
        }
      },
      '/api/tickets/{id}/status': {
        patch: {
          summary: 'Update Ticket Status',
          description: 'Updates status of a ticket. Enforces correct state transitions. Staff must provide resolution_notes when setting to resolved.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['in_progress', 'resolved', 'closed'] },
                    resolution_notes: { type: 'string', example: 'Resolution testing complete. Projector bulb replaced.' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Status updated.' },
            400: { description: 'Invalid status transition or missing resolution notes.' }
          }
        }
      },
      '/api/tickets/{id}/comments': {
        post: {
          summary: 'Add Comment to Ticket',
          description: 'Inserts a new message in the ticket timeline and notifies the other active user.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['text'],
                  properties: {
                    text: { type: 'string', example: 'Please send a screenshot of the fee receipt.' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Comment created.' }
          }
        }
      },
      '/api/tickets/{id}/reopen': {
        post: {
          summary: 'Reopen Ticket (Student)',
          description: 'Reopens a resolved ticket. Student must provide a reopen reason.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['reason'],
                  properties: {
                    reason: { type: 'string', example: 'The portal still shows database integrity errors on elective selections.' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Ticket status reverted to reopened.' },
            400: { description: 'Reason missing or ticket is not resolved.' }
          }
        }
      },
      '/api/tickets/{id}/feedback': {
        post: {
          summary: 'Submit Feedback & Close (Student)',
          description: 'Closes the resolved ticket and logs student feedback remarks.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    feedback: { type: 'string', example: 'Excellent turnaround time, the issue is completely resolved.' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Feedback logged and ticket status set to closed.' }
          }
        }
      },
      '/api/tickets/{id}/assign': {
        patch: {
          summary: 'Reassign Ticket (Admin/HOD Only)',
          description: 'Allows an Admin to manually override ticket assignment to a different active staff specialist.',
          tags: ['Tickets'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['staff_id'],
                  properties: {
                    staff_id: { type: 'integer', example: 4 }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Reassigned successfully.' },
            400: { description: 'Invalid staff specialist ID.' }
          }
        }
      },
      '/api/admin/staff': {
        get: {
          summary: 'Get All Staff Members',
          description: 'Lists all staff members and their active workloads.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of staff.' }
          }
        },
        post: {
          summary: 'Create Staff Specialist',
          description: 'Registers a new staff specialist in the system with default credentials (staff123).',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'category_id'],
                  properties: {
                    name: { type: 'string', example: 'Engr. Frank Eke' },
                    email: { type: 'string', format: 'email', example: 'frank.eke.staff@unn.edu.ng' },
                    category_id: { type: 'integer', example: 3 }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Staff created.' }
          }
        }
      },
      '/api/admin/users/{id}/toggle-active': {
        patch: {
          summary: 'Toggle User Account Active State',
          description: 'Activates or deactivates a user. Inactive users cannot log in.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'User account status toggled.' }
          }
        }
      },
      '/api/admin/users/{id}/reset-password': {
        post: {
          summary: 'Admin Manual User Password Reset',
          description: 'Allows Admin to manually reset password for students or staff specialists.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['password'],
                  properties: {
                    password: { type: 'string', minLength: 6, example: 'newpass123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'User password reset successfully.' }
          }
        }
      },
      '/api/admin/categories': {
        get: {
          summary: 'Get All Categories',
          description: 'Lists all categories (both active and inactive).',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of categories.' }
          }
        },
        post: {
          summary: 'Create Category',
          description: 'Creates a new ticket category with configurable escalation hours.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'escalation_hours'],
                  properties: {
                    name: { type: 'string', example: 'Exam Verification' },
                    description: { type: 'string', example: 'Discrepancies in course grading registers' },
                    escalation_hours: { type: 'integer', example: 48 }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Category created.' }
          }
        }
      },
      '/api/admin/categories/{id}': {
        patch: {
          summary: 'Update Category details',
          description: 'Updates metadata, escalation limits, or active status flags for a category.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    escalation_hours: { type: 'integer' },
                    is_active: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Category updated.' }
          }
        },
        delete: {
          summary: 'Delete Category (Soft Delete)',
          description: 'Soft deletes a category by setting its is_active status flag to FALSE.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Category deactivated.' }
          }
        }
      },
      '/api/admin/registry': {
        get: {
          summary: 'List Student Registry Entries',
          description: 'Lists all pre-verified student records permitted to run registration activation.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of registry entries.' }
          }
        }
      },
      '/api/admin/reports': {
        get: {
          summary: 'Get Reports and Analytics Charts Data',
          description: 'Compiles statistics for Admin dashboard charts.',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Category, status and timeline volumes.' }
          }
        }
      },
      '/api/users/me': {
        get: {
          summary: 'Get My Profile details',
          description: 'Retrieves current authenticated profile information.',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Profile details.' }
          }
        }
      },
      '/api/notifications': {
        get: {
          summary: 'Get My Notifications',
          description: 'Lists all notifications for the authenticated user.',
          tags: ['Notifications'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of notifications.' }
          }
        }
      },
      '/api/notifications/{id}/read': {
        patch: {
          summary: 'Mark Notification as Read',
          description: 'Updates notification status to read.',
          tags: ['Notifications'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Status updated.' }
          }
        }
      }
    }
  },
  apis: [], // Defined statically above
};

export const swaggerSpec = swaggerJsdoc(options);
