# Contributing to Free Mentors

Thank you for your interest in contributing to Free Mentors! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/free-mentors.git
   cd free-mentors
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Lydia-Numwali/free-mentors.git
   ```
4. **Install dependencies**:
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

## 🔄 Development Workflow

### Branch Strategy

We follow a **Git Flow** workflow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

1. **Update your local develop branch**:
   ```bash
   git checkout develop
   git pull upstream develop
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Branch naming conventions:
   - `feature/add-user-profile` - New features
   - `bugfix/fix-login-error` - Bug fixes
   - `refactor/improve-auth-flow` - Code refactoring
   - `docs/update-readme` - Documentation updates

3. **Make your changes** and commit regularly

4. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

5. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Commit Guidelines

We follow the **Conventional Commits** specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Code style changes (formatting, missing semi-colons, etc.)
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Changes to build system or dependencies
- `ci` - Changes to CI configuration files
- `chore` - Other changes that don't modify src or test files

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(sessions): resolve session request duplication issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(components): extract reusable Button component"

# Breaking change
git commit -m "feat(api): change authentication endpoint

BREAKING CHANGE: /auth/login endpoint moved to /api/v2/auth/login"
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests when relevant
- Provide detailed description in body for complex changes

## 🔍 Pull Request Process

### Before Submitting

1. **Test your changes**:
   ```bash
   # Frontend
   npm test
   npm run build
   
   # Backend
   python manage.py test
   ```

2. **Lint your code**:
   ```bash
   # Frontend
   npm run lint
   ```

3. **Update documentation** if needed

4. **Ensure your branch is up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

### Submitting a Pull Request

1. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub:
   - Base branch: `develop`
   - Compare branch: `feature/your-feature-name`

3. **Fill out the PR template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   Describe how you tested your changes
   
   ## Screenshots (if applicable)
   Add screenshots for UI changes
   
   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests passing
   ```

4. **Wait for review** - Maintainers will review your PR and may request changes

5. **Address feedback** - Make requested changes and push updates

6. **Merge** - Once approved, your PR will be merged into `develop`

### PR Review Criteria

- Code quality and readability
- Test coverage
- Documentation completeness
- Adherence to project conventions
- No breaking changes (unless discussed)
- Performance considerations

## 💻 Coding Standards

### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Use Material-UI components consistently
- Keep components small and focused
- Use meaningful variable and function names
- Add PropTypes or TypeScript types
- Write unit tests for components

### Backend (Django)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep views and resolvers thin
- Use repository pattern for data access
- Write unit tests for business logic
- Handle errors gracefully

### General

- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Avoid code duplication (DRY principle)
- Use meaningful names for variables and functions
- Follow SOLID principles

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test                 # Run tests
npm run test:coverage    # Generate coverage report
```

### Backend Tests

```bash
cd backend
python manage.py test                    # Run all tests
python manage.py test core.tests         # Run specific tests
python manage.py test --coverage         # With coverage
```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Django Documentation](https://docs.djangoproject.com/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

## ❓ Questions?

If you have questions or need help:

1. Check existing [Issues](https://github.com/Lydia-Numwali/free-mentors/issues)
2. Create a new issue with the `question` label
3. Reach out to maintainers

## 🎉 Thank You!

Your contributions make Free Mentors better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
