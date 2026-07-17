#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="seka-bike"
APP_DIR="/var/www/${APP_NAME}"
APP_USER="seka"
SOURCE_DIR="${SOURCE_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BRANCH="${BRANCH:-main}"
RUN_SEED="${RUN_SEED:-0}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/update-ubuntu.sh"
  exit 1
fi

if [[ ! -f "${APP_DIR}/.env" ]]; then
  echo "Missing ${APP_DIR}/.env. Run deploy/install-ubuntu.sh first."
  exit 1
fi

if [[ -d "${SOURCE_DIR}/.git" ]]; then
  echo "==> Updating source repository"
  git -C "${SOURCE_DIR}" fetch --prune origin
  git -C "${SOURCE_DIR}" checkout "${BRANCH}"
  git -C "${SOURCE_DIR}" pull --ff-only origin "${BRANCH}"
fi

echo "==> Syncing source to ${APP_DIR}"
rsync -a --delete \
  --exclude ".git" \
  --exclude ".artifacts" \
  --exclude ".next" \
  --exclude "node_modules" \
  --exclude ".env" \
  --exclude "/background/" \
  --exclude "/donebike/" \
  --exclude "/seka exaero GR/" \
  --exclude "/seka exceed rdc/" \
  --exclude "/seka exceed standart/" \
  --exclude "/seka spear rdc/" \
  --exclude "/seka spear standart/" \
  --exclude "/carbonara logo.png" \
  --exclude "*.txt" \
  --exclude "public/media/reference" \
  --exclude "public/media/donebike/*.jpg" \
  --exclude "public/media/donebike/*.jpeg" \
  --exclude "scripts/scrape-*.ts" \
  --exclude "*.tsbuildinfo" \
  "${SOURCE_DIR}/" "${APP_DIR}/"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"

if [[ ! -f "${APP_DIR}/public/media/donebike/all/bike-01.jpg" ]]; then
  echo "Gallery image check failed: ${APP_DIR}/public/media/donebike/all/bike-01.jpg is missing."
  exit 1
fi

cd "${APP_DIR}"

echo "==> Installing dependencies"
sudo -u "${APP_USER}" npm ci

echo "==> Applying database migrations"
sudo -u "${APP_USER}" npm run prisma:deploy

if [[ "${RUN_SEED}" == "1" ]]; then
  echo "==> Running seed"
  sudo -u "${APP_USER}" npm run seed
else
  echo "==> Skipping seed. Use RUN_SEED=1 to run it."
fi

echo "==> Building app"
sudo -u "${APP_USER}" npm run build

echo "==> Pruning development dependencies"
sudo -u "${APP_USER}" npm prune --omit=dev

echo "==> Restarting service"
systemctl restart "${APP_NAME}"

echo "==> Checking service"
systemctl --no-pager --full status "${APP_NAME}" || true

echo
echo "Update complete."
echo "Logs: journalctl -u ${APP_NAME} -f"
