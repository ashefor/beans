# Beans 🫘

A fast and efficient technical issues tracking system built with NestJS + MySQL backend and Next.js frontend. Track your bugs, errors, and their solutions with ease.

## Features

- ✅ **Log Technical Issues**: Record errors, descriptions, and solutions
- 📸 **Screenshot Support**: Add optional screenshot URLs to issues
- 🏷️ **Tag-Based Organization**: Categorize issues with tags
- 🔍 **Advanced Search**: Search issues by error or description
- 🎯 **Tag Filtering**: Filter issues by multiple tags
- 🚫 **Duplicate Prevention**: Automatic detection of duplicate issues
- 📄 **Pagination**: Efficiently browse through large numbers of issues
- ⚡ **Fast Performance**: Optimized with MySQL indexing

## Tech Stack

### Backend
- **NestJS**: Modern Node.js framework
- **TypeORM**: Object-Relational Mapping
- **MySQL**: Relational database
- **TypeScript**: Type-safe development
- **Class Validator**: Input validation

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Lucide React**: Icons

## Prerequisites

- Node.js 18+ and npm
- Docker (for MySQL)
- Or a local MySQL installation

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ashefor/beans.git
cd beans
```

### 2. Start MySQL Database

Using Docker:

```bash
docker-compose up -d
```

Or use your own MySQL instance and update the connection details in `backend/.env`.

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed to match your MySQL configuration
npm run start:dev
```

The backend will start on `http://localhost:3000`.

### 4. Setup Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3001`.

### 5. Access the Application

Open your browser and navigate to `http://localhost:3001`.

## Project Structure

```
beans/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── issues/      # Issues module
│   │   │   ├── dto/     # Data Transfer Objects
│   │   │   ├── entities/# TypeORM entities
│   │   │   ├── issues.controller.ts
│   │   │   ├── issues.service.ts
│   │   │   └── issues.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # API client
│   │   └── types/      # TypeScript types
│   └── package.json
└── docker-compose.yml   # MySQL container
```

## API Endpoints

### Issues

- `GET /issues` - List all issues (supports search, tags, pagination)
  - Query params: `search`, `tags`, `page`, `limit`
- `GET /issues/:id` - Get a specific issue
- `POST /issues` - Create a new issue
- `PATCH /issues/:id` - Update an issue
- `DELETE /issues/:id` - Delete an issue
- `GET /issues/tags` - Get all available tags

## Features in Detail

### Duplicate Prevention

The system automatically detects duplicate issues by creating a SHA-256 hash of the error and description (case-insensitive). If you try to submit an issue with the same error and description, you'll receive a conflict error.

### Search and Filtering

- **Full-text search**: Search across both error messages and descriptions
- **Tag filtering**: Select one or more tags to filter issues
- **Combined filters**: Use search and tag filters together
- **Pagination**: Browse through results in pages

### Data Validation

Both frontend and backend validate:
- Error message (required, max 500 characters)
- Description (required)
- Tags (at least one required)
- Screenshots (optional, URL format)

## Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=beans
PORT=3000
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development

### Running Tests

Backend:
```bash
cd backend
npm run test
npm run test:e2e
```

Frontend:
```bash
cd frontend
npm run test
```

### Building for Production

Backend:
```bash
cd backend
npm run build
npm run start:prod
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

## Database Schema

### Issue Entity

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| error | VARCHAR(500) | Error message |
| description | TEXT | Detailed description |
| screenshots | TEXT[] | Array of screenshot URLs |
| tags | TEXT[] | Array of tags |
| contentHash | VARCHAR(1000) | SHA-256 hash for duplicate detection |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

**Indexes:**
- error (for search optimization)
- tags (for filtering optimization)
- contentHash (unique, for duplicate prevention)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please file an issue on GitHub.

