# Task Tracker - Next.js Application

## 🚀 Швидкий старт

### Встановлення залежностей

```bash
npm install
```

### Налаштування бази даних

Проект використовує PostgreSQL за замовчуванням.

Створіть файл `.env.local` в корені проекту:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=ipiaskovskyi
POSTGRES_PASSWORD=your_password
POSTGRES_DB=db_development
NODE_ENV=development
```

### Запуск сервера розробки

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

### Білд для продакшн

```bash
npm run build
npm start
```

## 📁 Структура проекту

```
nextjs-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── tasks/         # Tasks API
│   │   ├── board/             # Board page
│   │   └── layout.tsx        # Root layout
│   ├── components/            # React components
│   │   ├── Board/            # Board components
│   │   ├── Auth/             # Auth components
│   │   └── Layout/            # Layout components
│   ├── lib/                   # Utilities
│   │   ├── api/              # API client
│   │   ├── db/               # Database config
│   │   ├── models/           # Sequelize models
│   │   ├── services/         # Business logic
│   │   └── validators/       # Zod schemas
│   └── types/                # TypeScript types
└── data/                     # SQLite database (якщо використовується)
```

## 🗄️ База даних

### PostgreSQL (за замовчуванням)

Проект налаштований на використання PostgreSQL з такими credentials за замовчуванням:

- User: `ipiaskovskyi`
- Database: `db_development`

Переконайтеся, що:

1. PostgreSQL запущений
2. База даних `db_development` існує
3. Користувач має права доступу

### SQLite (альтернатива)

Для використання SQLite, не встановлюйте змінні `POSTGRES_*`. База даних створиться автоматично в `data/database.sqlite`.

## 🧪 Тестування

```bash
npm test
```

## 📝 API Endpoints

- `GET /api/tasks` - Отримати всі задачі (з фільтрами)
- `POST /api/tasks` - Створити задачу
- `GET /api/tasks/[id]` - Отримати задачу за ID
- `PUT /api/tasks/[id]` - Оновити задачу
- `DELETE /api/tasks/[id]` - Видалити задачу

## 🔧 Технології

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Material UI** - UI components
- **Sequelize** - ORM
- **PostgreSQL** - Database
- **Zod** - Validation
- **dnd-kit** - Drag and drop

## 📚 Документація

- [Best Practices](./BEST_PRACTICES.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Migration Status](./MIGRATION_STATUS.md)
