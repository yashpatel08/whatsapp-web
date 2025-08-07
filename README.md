# 📱 WhatsApp Web Clone – Chat Interface with Webhook Integration

A full-stack simulation of WhatsApp Web built using **React**, **Node.js**, **MongoDB**, and **Socket.IO**. This application processes WhatsApp Business API webhook payloads, stores messages, and provides a real-time chat interface similar to WhatsApp Web.

---

## ✨ Features

- ✅ WhatsApp-like UI (responsive & mobile-friendly)
- ✅ View all conversations grouped by user
- ✅ Real-time message updates using **Socket.IO**
- ✅ Message status tracking: sent, delivered, read
- ✅ New chat creation with number + name input
- ✅ Input validation (only numeric numbers allowed)
- ✅ Messages stored in MongoDB (`processed_messages`)
- ✅ Backend built with Express.js
- ✅ Vercel & Render Deployment ready

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|------------|---------------------------------|
| Frontend   | React + Tailwind CSS            |
| Backend    | Node.js + Express               |
| Database   | MongoDB (via MongoDB Atlas)     |
| Real-time  | Socket.IO                       |
| Hosting    | Vercel (Frontend), Render (API) |

---

## ⚙️ Project Structure

```bash
.
├── backend
│   ├── app.js
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── .env
├── frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── SendBox.jsx
│   │   └── socket.js
│   └── .env
````

---

## 🚀 Getting Started

### 🔧 Backend Setup

```bash
cd backend
npm install
```

#### Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/whatsapp
```

#### Run the server:

```bash
node index.js
```

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
```

#### Create a `.env` file:

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

#### Start the frontend:

```bash
npm run dev
```

> Note: Use `localhost` if running both locally.

---

## 📬 Webhook Data Processing

* Accepts WhatsApp webhook JSON payloads
* Extracts messages and stores in `processed_messages`
* Updates status on new webhook event
* Simulated with test JSON (use Postman)

---

## 💡 Functional Highlights

* 👤 **New Chat Creation**: User can enter a mobile number + name to start a new conversation.
* 🧠 **Validation**: Only valid numbers are accepted.
* 🔄 **Real-Time**: Messages sent by one user are automatically updated for the recipient using WebSockets.
* 📦 **Persisted**: All messages are saved to MongoDB.

---

## 🌐 Deployment

* Frontend: **Vercel** ([https://whatsapp-web-xi.vercel.app](https://whatsapp-psi-nine.vercel.app/))
* Backend: **Render / Your own server**

---

## ✅ Sample API Endpoints

* `GET /api/messages?myWaId=919876543210` – Get grouped messages
* `POST /api/messages` – Send a new message
* `POST /api/webhook` – Webhook endpoint for message events

---

## 🧪 Testing with Postman

You can simulate sending messages by POSTing to:

```http
POST /api/messages
Content-Type: application/json

{
  "from_wa_id": "919876543210",
  "to_wa_id": "912345678900",
  "name": "John",
  "number": "912345678900",
  "message": "Hello from Postman"
}
```

---

## 📡 Socket.IO Events

* `new_message` — emitted by backend when a new message is stored
* Frontend listens to this event and re-fetches the conversation

---
---

## 🙌 Author

**Yash Patel**

---

## 📃 License

MIT License – Use freely for learning and demo purposes.

```

---

Let me know if you'd like a GitHub-flavored README with collapsible sections or want to include CI/CD badges.
```
