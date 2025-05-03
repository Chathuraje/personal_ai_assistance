# AI Chat Assistant

AI Chat Assistant is a lightweight, web-based conversational tool built with a **Next.js** frontend and an **n8n** workflow backend. It allows users to interact with an AI model through a clean, responsive chat interface powered by **shadcn/ui** components, while all backend processing and AI integration are handled through automated workflows in n8n.

## Overview

- **Frontend**: Built with **Next.js** and **shadcn/ui** for a seamless and accessible chat experience.
- **Backend**: Developed using **n8n** for API communication, automation, and response handling.
- **AI Integration**: Connected to [OpenAI API](https://platform.openai.com/) for generating intelligent, human-like responses.
- **Hosting**: Designed for easy deployment across cloud platforms like Vercel.

---

## Key Features

- **Real-time AI Chat**: Users send and receive AI-generated responses instantly via a smooth chat UI.
- **Modular Backend**: The n8n workflow is easily extendable for features like authentication, logging, or advanced AI prompts.
- **Simple Configuration**: Environment-based configuration supports development and production switching.
- **Modern UI**: Built with **shadcn/ui** components for a polished, accessible design.
- **Scalable and Lightweight**: Minimal initial setup with plenty of room for expansion.

---

## Technologies Used

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | Next.js, TypeScript, Axios, shadcn/ui |
| Backend    | n8n (low-code workflows)              |
| AI Service | OpenAI API / Custom API               |
| Deployment | Vercel / n8n (self-hosted backend)    |

---

## How It Works

1. The **user** sends a message through the Next.js chat interface.
2. The **frontend** sends a POST request to an **internal API route**.
3. The API route forwards the message to the **n8n webhook**.
4. The **n8n workflow** sends the prompt to the AI API, retrieves the response, formats it, and sends it back.
5. The API route returns the AI's response to the frontend, and the chat UI displays it in real-time.

---

## Setup and Deployment

### Frontend (Next.js)

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env.local` file:

```
NEXT_PUBLIC_N8N_ENDPOINT=https://your-n8n-domain.com/webhook/chat
```

4. Run the app locally:

```bash
npm run dev
```

5. Deploy to **Vercel** (best with Next.js).

---

### Backend (n8n)

1. Set up an **n8n Webhook** node to accept incoming chat messages.
2. Use an **HTTP Request** node to forward input to the AI API.
3. Format the AI's response using a **Set** node.
4. Return the AI response back to the frontend.

Sample Workflow:

```plaintext
[Webhook] → [HTTP Request (AI API)] → [Set Response] → [Webhook Response]
```

---

## Possible Extensions

- User authentication with NextAuth.js
- Maintain multi-turn conversation context
- Chat history and analytics dashboard
- Connect with other AI models (Claude, Gemini, etc.)
- Admin panel for chat monitoring/moderation

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and enhance it as needed.

---

## About Me

I'm passionate about building automation-driven, AI-powered products.
