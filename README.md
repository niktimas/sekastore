# SEKA Carbonara Bike

Сайт официального дистрибьютора SEKA для доменов `seka-bike.ru` и `seka-bike.store`.

## Стек

- Next.js App Router + TypeScript
- PostgreSQL
- Prisma
- Node.js
- Nginx + systemd на production-сервере

## Локальная разработка

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run seed
npm run dev
```

Локально сайт открывается на `http://localhost:3000`.

## Проверки перед GitHub

```bash
npm run lint
npm run typecheck
npm run build
```

В репозиторий не нужно добавлять:

- `.env`
- `.next/`
- `node_modules/`
- `.artifacts/`
- исходные папки с сырыми материалами из корня проекта
- временные скриншоты, тестовые артефакты и локальные загрузки

Production-ассеты уже лежат в `public/media`.

## Деплой на Ubuntu 24.04 из клонированного репозитория

1. Направить DNS A-записи на IP сервера:
   - `seka-bike.ru`
   - `www.seka-bike.ru`
   - `seka-bike.store`
   - `www.seka-bike.store`

2. Зайти на сервер и выполнить:

```bash
git clone https://github.com/USER/REPO.git seka-bike
cd seka-bike
sudo bash deploy/install-ubuntu.sh
```

Скрипт установит Node.js, PostgreSQL, Nginx, Certbot, создаст базу, `.env`, systemd-сервис, применит миграции, загрузит seed, соберет проект и выпустит SSL-сертификаты.

В конце установки скрипт выведет:

- пароль PostgreSQL;
- `DATABASE_URL`;
- email и пароль админки;
- адрес файла `/root/seka-bike-credentials.txt` с теми же доступами.

Повторный запуск `deploy/install-ubuntu.sh` переиспользует существующие пароли из `/var/www/seka-bike/.env`. Чтобы принудительно сгенерировать новые доступы:

```bash
sudo RESET_CREDENTIALS=1 bash deploy/install-ubuntu.sh
```

## Деплой одной командой с GitHub

После публикации репозитория можно запускать установку на чистом VPS так:

```bash
curl -fsSL https://raw.githubusercontent.com/USER/REPO/main/deploy/bootstrap-ubuntu.sh \
  | sudo REPO_URL=https://github.com/USER/REPO.git BRANCH=main bash
```

`USER/REPO` заменить на реальный GitHub-репозиторий.

## Защита сервера

Скрипт дополнительно настраивает:

- UFW с закрытым входящим трафиком по умолчанию;
- Nginx rate limit для сайта, форм и логина админки;
- security headers;
- блок прямого захода по IP;
- Fail2Ban для SSH и подозрительных Nginx-событий;
- PostgreSQL только на localhost;
- ежедневные PostgreSQL-бэкапы в `/var/backups/seka-bike`;
- автоматические security-updates Ubuntu.

## Полезные команды на сервере

```bash
sudo systemctl status seka-bike
sudo journalctl -u seka-bike -f
sudo systemctl restart seka-bike
sudo nginx -t
```

## Админка

Админка доступна по адресу:

```text
https://seka-bike.ru/admin
```

Email по умолчанию: `niktimas696@gmail.com`.
Пароль генерируется установочным скриптом и сохраняется в `.env`.
