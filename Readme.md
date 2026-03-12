#  Trello Clone

##  What's This?
A lightweight **Trello-inspired task management application** built with JSON-based persistence.  
It allows users to sign up, log in, and manage tasks with full CRUD operations.

---

##  What's Going On?
- Users can **sign up** with name, email, and password.
- Credentials are stored in `users.json`.
- On **login**, credentials are validated against `users.json`.
- Successful login redirects to the **Home Page**.
- Home Page provides a **task board** where users can:
  - Add tasks
  - View tasks
  - Update tasks
  - Delete tasks
- Tasks are stored in `tasks.json`.

---

##  Contributors
- **Pratham** → [@pratham00007](https://github.com/pratham00007)  
- **Prisha Chaudhary** → [@prishachaudhary27-bit](https://github.com/prishachaudhary27-bit)

---

##  Project Description
This project is a **Trello clone** designed to replicate the core functionality of Trello boards:
- User authentication
- Task creation and management
- JSON-based storage for simplicity
- CRUD operations for tasks

It’s a **beginner-friendly project** to understand authentication, data persistence, and workflow management.

---
##  Technical Workflow
1. **Signup**
   - Input: `name`, `email`, `password`
   - Save to `users.json`

2. **Login**
   - Input: `email`, `password`
   - Validate against `users.json`
   - On success → Redirect to Home Page

3. **Task Management**
   - Input: `task title`, `status`
   - Save to `tasks.json`
   - CRUD operations supported:
     - Create → Add new task
     - Read → Fetch tasks
     - Update → Modify task details
     - Delete → Remove task

4. **Data Storage**
   - `users.json` → Stores user credentials
   - `tasks.json` → Stores tasks linked to user email

---

##  Product Workflow
1. **User Journey**
   - New user signs up → credentials saved
   - User logs in → credentials validated
   - Redirected to Home Page

2. **Task Journey**
   - User creates tasks → saved in `tasks.json`
   - User views tasks → fetched from `tasks.json`
   - User updates/deletes tasks → changes reflected in `tasks.json`

3. **Board Experience**
   - Each user sees only their tasks
   - Tasks can be marked as `pending`, `in-progress`, or `completed`

---

##  File Structure
```
trello-clone/
│── users.json        # Stores user data
│── tasks.json        # Stores task data
│── index.html        # Login and SignUp 
│── home.html         # Main application 
│── README.md         # Architecture documentation
```

---

## Future Enhancements
- Password hashing for security
- Multiple boards per user
- Drag-and-drop UI for tasks
- Migration from JSON to database (SQLite/PostgreSQL)
