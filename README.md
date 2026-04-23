# Free Mentors

Free Mentors is a simple mentoring web application built to match the project guide requirements:

- `React` + `Material UI` + `Redux Toolkit` for the frontend
- `Django` + `GraphQL` for the backend
- `MongoDB` for application persistence
- `Docker` and `docker-compose` for containerized setup

## Features covered

- Users can sign up
- Users can sign in
- Admin can promote a user to mentor through GraphQL
- Users can view mentors
- Users can view a specific mentor
- Users can create mentorship session requests
- Mentors can accept session requests
- Mentors can decline session requests
- Users can view their mentorship sessions

## Project structure

- [`frontend`](C:/Users/user/free-mentors/frontend) contains the React app
- [`backend`](C:/Users/user/free-mentors/backend) contains the Django GraphQL API
- [`docker-compose.yml`](C:/Users/user/free-mentors/docker-compose.yml) runs frontend, backend, and MongoDB together

## Local setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py shell -c "from core.seed import seed_users; seed_users()"
python manage.py runserver
```

### Docker

```bash
docker compose up --build
```

Frontend runs on `http://localhost:3000` and the backend GraphQL endpoint runs on `http://localhost:8000/graphql/`.

## Demo accounts

- Admin: `admin@freementors.dev` / `Admin123!`
- Mentor: `mentor@freementors.dev` / `Mentor123!`

## Important note

The backend uses Django as the web framework and GraphQL host, while MongoDB stores users and mentorship sessions through `pymongo`.
