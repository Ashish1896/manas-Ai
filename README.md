# Nexus Mind Care

<div align="center">

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19+-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-6+-646cff?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5+-2d3748?logo=prisma)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6c47ff?logo=clerk)

**AI-Powered Mental Health Platform**

[Live Demo](https://manas-ai-theta.vercel.app) | [Report Bug](https://github.com/Ashish1896/manas-Ai/issues) | [Request Feature](https://github.com/Ashish1896/manas-Ai/issues)

![manas-Ai Banner](https://img.shields.io/badge/Nexus-Mind%20Care-1a1a2e?style=for-the-badge)

</div>

---

## About The Project

**Nexus Mind Care** is an AI-powered mental health and wellness platform that provides personalized support through Google Generative AI. Built with modern web technologies, it offers a safe space for users to access mental health resources, mood tracking, and AI-guided conversations.

### Key Features

- **AI-Powered Chat** - Conversations powered by Google Generative AI (Gemini)
- **Secure Authentication** - User authentication via Clerk
- **Multi-Language Support** - i18n internationalization for global accessibility
- **Mood Tracking** - Track and visualize your emotional well-being
- **Responsive Design** - Beautiful UI with TailwindCSS and shadcn/ui components
- **Real-time Updates** - TanStack Query for efficient data synchronization
- **Analytics** - Vercel Speed Insights integrated
- **MindWell Prototype** - Experimental mental wellness features

### Built With

- [React 19+](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) + PostgreSQL
- [Clerk](https://clerk.com)
- [Google Generative AI](https://ai.google.dev)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com)
- [Lottie](https://lottiefiles.com)
- [i18next](https://www.i18next.com)
- [Vercel](https://vercel.com)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- A Clerk account
- A Google Generative AI API key
- PostgreSQL database (or use Prisma Accelerate)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ashish1896/manas-Ai.git
cd manas-Ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Fill in your CLERK_SECRET_KEY, GOOGLE_GENERATIVE_AI_API_KEY, DATABASE_URL
```

4. Set up the database
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server
```bash
npm run dev:full
```

The app will be available at `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run dev:full` | Run frontend + backend concurrently |
| `npm run server` | Start backend server |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## Project Structure

```
manas-Ai/
├── animation/       # Lottie animations
├── locales/         # i18n translation files
├── prisma/          # Database schema and migrations
├── public/          # Static assets
├── scripts/         # Utility scripts
├── src/
│   ├── assets/      # Images and media
│   ├── auth/        # Authentication logic
│   ├── components/  # Reusable UI components
│   ├── contexts/    # React contexts
│   ├── data/        # Mock/static data
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── pages/       # Page components
│   └── types/       # TypeScript types
├── .env.example
└── package.json
```

---

## Screenshots

<div align="center">

> Add your screenshots here by uploading to the `public/` folder

</div>

---

## Roadmap

- [ ] Add user dashboard with mental health analytics
- [ ] Implement crisis helpline integration
- [ ] Add journaling feature with AI insights
- [ ] Support more languages (currently: EN)
- [ ] Add meditation and breathing exercises
- [ ] Implement group support sessions
- [ ] Add mobile app with React Native
- [ ] Integrate wearable device data (heart rate, sleep)

See the [open issues](https://github.com/Ashish1896/manas-Ai/issues) for a full list of proposed features and known issues.

---

## Contributing

Contributions are what make the open source community such an amazing place! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See `CONTRIBUTING.md` for detailed guidelines.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

**Ashish Kumar Sahoo** - [@Ashish1896](https://github.com/Ashish1896)

Project Link: [https://github.com/Ashish1896/manas-Ai](https://github.com/Ashish1896/manas-Ai)

---

<div align="center">

If you like this project, please ⭐ star this repository!

**Built with ❤️ in Bhubaneswar, India**

</div>
