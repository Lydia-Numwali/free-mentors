# Free Mentors

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Lydia-Numwali/free-mentors)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django)](https://www.djangoproject.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://www.docker.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-007FFF?logo=mui)](https://mui.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-API-E10098?logo=graphql)](https://graphql.org/)

A modern mentorship platform connecting mentees with experienced professionals. Built with React, Django, GraphQL, and MongoDB.

## 🌟 Features

### Core Functionality
- ✅ User registration and authentication
- ✅ Role-based access control (Admin, Mentor, Mentee)
- ✅ Mentor discovery and profiles
- ✅ Session request management
- ✅ Accept/decline session requests
- ✅ Session history and reviews
- ✅ Admin moderation dashboard

### Technical Features
- 🎨 Modern, responsive UI with Material-UI
- 🔐 Secure authentication with JWT
- 📊 GraphQL API for efficient data fetching
- 🐳 Docker containerization for easy deployment
- 🔄 Redux Toolkit for state management
- 🎯 Role-based navigation and access control

## 🏗️ Architecture

```
free-mentors/
├── frontend/          # React + Material-UI + Redux
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Redux slices
│   │   ├── pages/         # Page components
│   │   └── app/           # Store and GraphQL client
│   └── Dockerfile
├── backend/           # Django + GraphQL + MongoDB
│   ├── core/              # Main app logic
│   │   ├── schema.py      # GraphQL schema
│   │   ├── auth.py        # Authentication
│   │   └── repositories.py # Data access layer
│   └── Dockerfile
└── docker-compose.yml # Container orchestration
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/Lydia-Numwali/free-mentors.git
cd free-mentors
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend GraphQL: http://localhost:8000/graphql/

### Local Development

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py shell -c "from core.seed import seed_users; seed_users()"
python manage.py runserver
```

## 👥 Demo Accounts

| Role   | Email                      | Password    |
|--------|----------------------------|-------------|
| Admin  | admin@freementors.dev      | Admin123!   |
| Mentor | mentor@freementors.dev     | Mentor123!  |
| Mentee | mentee@freementors.dev     | Mentee123!  |

## 🔄 Git Workflow

This project follows a structured Git workflow:

### Branch Structure
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches

### Workflow
1. Create feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit with conventional commits:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push feature branch:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create Pull Request to `develop` on GitHub

5. After review and approval, merge to `develop`

6. Periodically merge `develop` to `main` for releases

### Commit Message Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `build:` - Build system changes

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Material-UI 5** - Component library
- **Redux Toolkit** - State management
- **Apollo Client** - GraphQL client
- **React Router** - Routing
- **Vite** - Build tool

### Backend
- **Django 5** - Web framework
- **Graphene-Django** - GraphQL integration
- **PyMongo** - MongoDB driver
- **PyJWT** - JWT authentication
- **Gunicorn** - WSGI server

### Database
- **MongoDB 7** - NoSQL database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📝 API Documentation

### GraphQL Endpoint
```
http://localhost:8000/graphql/
```

### Key Mutations
- `signup` - Register new user
- `signin` - Authenticate user
- `createSessionRequest` - Request mentorship session
- `acceptSessionRequest` - Accept session (mentor only)
- `declineSessionRequest` - Decline session (mentor only)

### Key Queries
- `me` - Get current user
- `mentors` - List all mentors
- `mentor(id)` - Get specific mentor
- `sessions` - Get user's sessions

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python manage.py test
```

## 📦 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
```bash
cd backend
gunicorn free_mentors.wsgi:application
```

### Environment Variables

Create `.env` files for configuration:

**Backend `.env`:**
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
MONGODB_URI=mongodb://mongo:27017/
```

**Frontend `.env`:**
```env
VITE_API_URL=https://api.your-domain.com/graphql/
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request to `develop` branch

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lydia Numwali**
- GitHub: [@Lydia-Numwali](https://github.com/Lydia-Numwali)

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- Django and Graphene for the robust backend framework
- MongoDB for flexible data storage
- The open-source community for inspiration and tools

---

**Built with ❤️ for connecting mentors and mentees**
