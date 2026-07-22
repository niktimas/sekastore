#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="seka-bike"
APP_DIR="/var/www/${APP_NAME}"
APP_USER="seka"
PORT="3000"
SOURCE_DIR="${SOURCE_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BRANCH="${BRANCH:-main}"
RUN_SEED="${RUN_SEED:-0}"
PRIMARY_DOMAIN="seka-bike.ru"
SECONDARY_DOMAIN="seka-bike.store"
TAVELO_DOMAIN="tavelo.ru"
DOMAINS=("${PRIMARY_DOMAIN}" "www.${PRIMARY_DOMAIN}" "${SECONDARY_DOMAIN}" "${TAVELO_DOMAIN}" "www.${TAVELO_DOMAIN}")

if [[ "${ADD_WWW_SECONDARY:-0}" == "1" ]]; then
  DOMAINS+=("www.${SECONDARY_DOMAIN}")
fi

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
if [[ ! -f "${SOURCE_DIR}/public/media/donebike/all/bike-01.jpg" ]]; then
  echo "Gallery image check failed in source: ${SOURCE_DIR}/public/media/donebike/all/bike-01.jpg is missing."
  echo "Try: git -C ${SOURCE_DIR} checkout -- public/media/donebike/all"
  exit 1
fi

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

echo "==> Syncing gallery images"
install -d -m 755 "${APP_DIR}/public/media/donebike/all"
rsync -a --delete "${SOURCE_DIR}/public/media/donebike/all/" "${APP_DIR}/public/media/donebike/all/"
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

echo "==> Refreshing Nginx limits and bot protection"
cat > "/etc/nginx/conf.d/${APP_NAME}-limits.conf" <<'NGINX'
limit_req_zone $binary_remote_addr zone=seka_global:20m rate=8r/s;
limit_req_zone $binary_remote_addr zone=seka_forms:10m rate=3r/m;
limit_req_zone $binary_remote_addr zone=seka_login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=seka_admin:10m rate=2r/s;
limit_req_zone $binary_remote_addr zone=seka_metrics:10m rate=30r/m;
limit_conn_zone $binary_remote_addr zone=seka_conn:10m;

map $http_user_agent $seka_blocked_bot {
    default 0;
    ~*(gptbot|chatgpt-user|ccbot|anthropic-ai|claudebot|perplexitybot|bytespider|amazonbot|applebot-extended|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|scrapy|python-requests|curl|wget|httpclient|headlesschrome) 1;
}
NGINX

cat > "/etc/nginx/snippets/${APP_NAME}-security-headers.conf" <<'NGINX'
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
NGINX

cat > "/etc/nginx/snippets/${APP_NAME}-admin-noindex.conf" <<'NGINX'
add_header X-Robots-Tag "noindex, nofollow" always;
NGINX

cat > "/etc/nginx/snippets/${APP_NAME}-proxy.conf" <<NGINX
proxy_pass http://127.0.0.1:${PORT};
proxy_http_version 1.1;
proxy_set_header Upgrade \$http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host \$host;
proxy_set_header X-Real-IP \$remote_addr;
proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto \$scheme;
proxy_cache_bypass \$http_upgrade;
NGINX

if [[ -f "/etc/nginx/sites-available/${APP_NAME}" ]] && grep -q "listen 443" "/etc/nginx/sites-available/${APP_NAME}"; then
  echo "==> Keeping existing HTTPS Nginx site config. Run install script on a clean server to regenerate the full site block."
  python3 - <<PY
from pathlib import Path
path = Path("/etc/nginx/sites-available/${APP_NAME}")
text = path.read_text()
domains = "${DOMAINS[*]}"
lines = []
for line in text.splitlines():
    stripped = line.strip()
    if stripped.startswith("server_name ") and stripped != "server_name _;":
        indent = line[: len(line) - len(line.lstrip())]
        lines.append(f"{indent}server_name {domains};")
    else:
        lines.append(line)
path.write_text("\\n".join(lines) + "\\n")
PY
else
cat > "/etc/nginx/sites-available/${APP_NAME}" <<NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAINS[*]};

    client_max_body_size 30M;
    server_tokens off;

    include /etc/nginx/snippets/${APP_NAME}-security-headers.conf;

    location = /robots.txt {
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location = /sitemap.xml {
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location = /api/metrics {
        if (\$seka_blocked_bot) { return 403; }
        limit_req zone=seka_metrics burst=20 nodelay;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location = /api/orders {
        if (\$seka_blocked_bot) { return 403; }
        limit_req zone=seka_forms burst=3 nodelay;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location = /api/leads {
        if (\$seka_blocked_bot) { return 403; }
        limit_req zone=seka_forms burst=3 nodelay;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location = /api/admin/login {
        limit_req zone=seka_login burst=3 nodelay;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location ^~ /admin {
        include /etc/nginx/snippets/${APP_NAME}-admin-noindex.conf;
        limit_req zone=seka_admin burst=20 nodelay;
        limit_conn seka_conn 10;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location / {
        if (\$seka_blocked_bot) { return 403; }
        limit_req zone=seka_global burst=40 nodelay;
        limit_conn seka_conn 30;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }
}
NGINX

ln -sf "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
fi
nginx -t
systemctl reload nginx

if [[ "${ISSUE_TAVELO_SSL:-0}" == "1" ]]; then
  echo "==> Requesting SSL for Tavelo domains"
  certbot --nginx --non-interactive --agree-tos --redirect --email "niktimas696@gmail.com" -d "${TAVELO_DOMAIN}" -d "www.${TAVELO_DOMAIN}" || true
fi

echo "==> Restarting service"
systemctl restart "${APP_NAME}"

echo "==> Checking service"
systemctl --no-pager --full status "${APP_NAME}" || true

echo
echo "Update complete."
echo "Logs: journalctl -u ${APP_NAME} -f"
