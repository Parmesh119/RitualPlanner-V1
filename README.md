# 🕉️ RitualPlanner

**RitualPlanner** is a full-stack application built for managing traditional Karmakand (ritual) services. It streamlines task assignments, co-worker coordination, required items (Yaadi), billing, and payment tracking—empowering priests and their teams to focus more on the rituals and less on manual tracking.

---

## ✨ Features

### 🗓️ Task Management
- Create, update, and schedule ritual tasks.
- Assign task owner and assistants.
- Track task status: `PENDING` or `COMPLETED`.
- Add notes for each task.

### 👥 Co-worker Management
- Add and manage co-workers (priests/helpers) with contact details.
- Shared co-workers across users without duplicate entries.
- Secure update system to prevent accidental overwrites.

### 📄 Ritual Templates (Yaadi)
- Create reusable templates with required items (e.g., 2kg Ghee, 1L Dahi).
- Units support: grams, kg, litres, pieces, packets, etc.
- Support quantity per packet and optional items.

### 💰 Billing & Payments
- Create itemized bills per ritual using templates.
- Add real-time market rate and extra charges per item.
- Track bill status: paid, pending, amount, and payment mode (cash/UPI/etc).
- Link bills with specific tasks and clients.
- Full breakdown via `ItemBill` entries.

### ✉️ Suggestions & Contact
- Allow users to send questions or feature suggestions.
- Admin-only response access (like Stack Overflow or Contact Us form).

---

## 🧠 Tech Stack

| Layer           | Tech                                       |
| --------------- | ------------------------------------------ |
| Backend         | Kotlin, Spring Boot, JDBC Template         |
| Frontend        | React.js, Tailwind CSS                     |
| Database        | PostgreSQL / Neon DB / Supabase (optional) |
| Auth (optional) | Spring Security or Firebase Auth           |
| Email           | JavaMailSender (Spring Boot)               |
| UI Animation    | Framer Motion, Cursor.so for Landing Page  |
| Deployment      | Render / Vercel / Railway / Heroku         |

---