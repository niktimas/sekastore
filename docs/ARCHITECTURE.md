# Архитектура сайта SEKA Bike Russia

## Цель

Сделать официальный русскоязычный сайт дистрибьютора SEKA, который работает как премиальный каталог с полноценный интернет-магазин с админкой, остатками, заказами

## Домены

- `seka-bike.ru` - основной публичный домен.
- `seka-bike.store` - дополнительный домен. Рекомендуемый сценарий: 301-редирект на основной домен

## Технологический стек

- OS: Ubuntu 24.04 LTS на VPS.
- Runtime: Node.js LTS.
- Backend: Node.js + TypeScript.
- Web framework: Fastify или NestJS.
- Frontend: Next.js, либо отдельный React/Vite если сайт будет полностью SPA.
- DB: PostgreSQL
- ORM/migrations: Prisma или Drizzle.
- Reverse proxy: Nginx.
- TLS: Let's Encrypt через Certbot.
- Process manager: systemd.
- Static/media storage MVP: локальная директория `/var/www/seka-bike/media` за Nginx.

## Логическая структура приложения

1. Публичный сайт
   - Главная.
   - Каталог моделей.
   - Страница модели.
   - Цвета/варианты.
   - Комплектации, системы, колеса.
   - Наличие.
   - Заявка/предзаказ.
   - Контакты официального дистрибьютора.

2. Админ-панель
   - Модели.
   - Цвета.
   - Размеры.
   - Комплектации.
   - Остатки.
   - Цены.
   - Заявки.
   - Медиа.

3. API
   - `GET /api/models`
   - `GET /api/models/:slug`
   - `GET /api/inventory`
   - `POST /api/leads`
   - Admin CRUD endpoints under `/api/admin/*`

4. Импорт данных
   - через админ панель

## Безопасность

- Не коммитить `.env`.
- Хранить `DATABASE_URL`, admin credentials, SMTP/API tokens только в переменных окружения.
- Admin routes закрыть сессией и ролью.
- Для заявок добавить rate limit и серверную валидацию.
- Формы защищать от спама: honeypot, rate limit, позже CAPTCHA.

## SEO и аналитика

- Canonical URLs на основном домене.
- ЧПУ: `/models/spear-rdc`, `/models/exceed-standard`.
- `sitemap.xml`, `robots.txt`.
- Open Graph изображения для моделей.
- Schema.org Product для страниц моделей.
