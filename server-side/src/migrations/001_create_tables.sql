-- LionDesk Database Schema
-- Run: mysql -u root liondesk_db < src/migrations/001_create_tables.sql

CREATE TABLE IF NOT EXISTS users (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  email                 VARCHAR(255) UNIQUE NOT NULL,
  password              VARCHAR(255) NOT NULL,
  role                  ENUM('student','staff','admin') NOT NULL,
  full_name             VARCHAR(255) NOT NULL,
  is_active             BOOLEAN DEFAULT TRUE,
  reset_token           VARCHAR(255) DEFAULT NULL,
  reset_token_expires   DATETIME DEFAULT NULL,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL UNIQUE,
  matric_no    VARCHAR(50) UNIQUE NOT NULL,
  level        VARCHAR(10) DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_registry (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  matric_no    VARCHAR(50) UNIQUE NOT NULL,
  full_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  is_used      BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS categories (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(100) UNIQUE NOT NULL,
  description      TEXT,
  escalation_hours INT NOT NULL DEFAULT 48,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL UNIQUE,
  category_id    INT DEFAULT NULL,
  workload_count INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tickets (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  ticket_ref       VARCHAR(20) UNIQUE NOT NULL,
  title            VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  category_id      INT NOT NULL,
  status           ENUM('open','in_progress','resolved','closed','escalated','reopened') DEFAULT 'open',
  student_id       INT NOT NULL,
  staff_id         INT DEFAULT NULL,
  resolution_notes TEXT DEFAULT NULL,
  feedback         TEXT DEFAULT NULL,
  reopen_reason    TEXT DEFAULT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at      TIMESTAMP NULL DEFAULT NULL,
  closed_at        TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (staff_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ticket_comments (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id    INT NOT NULL,
  author_id    INT NOT NULL,
  text         TEXT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  type         ENUM('confirmation','status_update','escalation','reminder','reopen') NOT NULL,
  title        VARCHAR(255) NOT NULL,
  message      TEXT DEFAULT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  ticket_id    INT DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL
);

-- Seed: default categories
INSERT IGNORE INTO categories (name, description, escalation_hours) VALUES
  ('Academic', 'Course registrations, result discrepancies, lectures', 48),
  ('Portal', 'Logins, profile errors, fee clearance updates', 24),
  ('Facility', 'Lab computers, power issues, projector repairs', 72);

-- Seed: student registry (pre-verified students)
INSERT IGNORE INTO student_registry (matric_no, full_name, email) VALUES
  ('2021/240123', 'Chidi Egwu', 'chidi.egwu.student@unn.edu.ng'),
  ('2022/240456', 'Stella Starr', 'stella.starr.student@unn.edu.ng'),
  ('2023/240789', 'Nkem Okafor', 'nkem.okafor.student@unn.edu.ng');

-- Seed: default admin user (password: admin123 — bcrypt hash)
INSERT IGNORE INTO users (email, password, role, full_name, is_active) VALUES
  ('hod.cs@unn.edu.ng', '$2a$10$xJwL5FbKhSqG5Y8K9VxQcOaJ9QqKjG0K5mVxN8rT1uW3jY6zS2dLe', 'admin', 'Prof. Augustine HOD', TRUE);
