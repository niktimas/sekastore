# Tavelo Front On Shared Backend

Дата: 2026-07-22

## Цель

Создать отдельный фронт для `tavelo.ru` в том же Next.js/PostgreSQL/VPS-проекте, где уже работает SEKA Carbonara Bike.

## Архитектура

- Один Next.js app и один systemd/nginx upstream.
- Один PostgreSQL backend, общие API заявок, метрик и админки.
- Разные фронты по host:
  - `seka-bike.ru`, `seka-bike.store` -> текущий SEKA-фронт.
  - `tavelo.ru`, `www.tavelo.ru` -> Tavelo-фронт через `middleware.ts`.
- Tavelo URL на домене:
  - `/`
  - `/models/arow-race`
  - `/models/arow-sl`
  - `/models/arden`
  - `/models/grow`
  - `/models/wild`
  - `/inventory`
  - `/build-options`
  - `/contacts`

## Источники

- Визуальная референция и SKU/цвета: `https://tavelo.cc/products`.
- Рублевые цены и модельная линейка: `https://carbonara-premium.ru/brands/tavelo`.

## Модели

- TAVELO AROW Race: 165 000 ₽.
- TAVELO AROW SL: 215 000 ₽.
- TAVELO Arden: 245 000 ₽.
- TAVELO GROW: 165 000 ₽.
- TAVELO WILD: 134 000 ₽.
- TAVELO Rise Handlebar: 28 000 ₽ как компонент.

## Дизайн

- Темный фон, высокий контраст, кислотно-зеленый accent.
- Крупный TAVELO wordmark в hero.
- Товарная сетка близко к tavelo.cc: крупное фото, название, цена, CTA.
- Модельные страницы: крупное фото, цена, спецификации, SKU/цвета.

## Deploy

- `deploy/install-ubuntu.sh` включает `tavelo.ru` и `www.tavelo.ru` в список доменов.
- `deploy/update-ubuntu.sh` обновляет `server_name` существующего nginx-конфига и может выпустить SSL для Tavelo через:

```bash
ISSUE_TAVELO_SSL=1 sudo bash deploy/update-ubuntu.sh
```

Перед SSL DNS A-записи `tavelo.ru` и `www.tavelo.ru` должны указывать на VPS.

## Самопроверка

- SEKA routes не удаляются и не переписываются на SEKA-доменах.
- Tavelo host переписывает публичные URL на `/tavelo`.
- `/api`, `/admin`, `/_next`, `/media` остаются общими.
- Tavelo имеет собственные `robots.txt` и `sitemap.xml`.
- Заявки Tavelo уходят через общий `OrderModal` в общий `/api/orders`.
