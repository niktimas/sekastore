#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="seka-bike"
APP_DIR="/var/www/${APP_NAME}"
APP_USER="seka"
NODE_MAJOR="22"
PORT="3000"

PRIMARY_DOMAIN="seka-bike.ru"
SECONDARY_DOMAIN="seka-bike.store"
DOMAINS=("${PRIMARY_DOMAIN}" "www.${PRIMARY_DOMAIN}" "${SECONDARY_DOMAIN}")

if [[ "${ADD_WWW_SECONDARY:-0}" == "1" ]]; then
  DOMAINS+=("www.${SECONDARY_DOMAIN}")
fi

ADMIN_EMAIL="niktimas696@gmail.com"
DB_NAME="seka_bike"
DB_USER="seka_app"
BACKUP_DIR="/var/backups/${APP_NAME}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CREDENTIALS_FILE="/root/${APP_NAME}-credentials.txt"
DB_PASSWORD=""
ADMIN_PASSWORD=""
NEXTAUTH_SECRET=""

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/install-ubuntu.sh"
  exit 1
fi

read_env_value() {
  local key="$1"
  local file="$2"
  grep -E "^${key}=" "${file}" | tail -n 1 | sed -E 's/^[^=]+="?([^"]*)"?$/\1/' || true
}

read_database_password() {
  local file="$1"
  sed -nE 's#^DATABASE_URL="?postgresql://[^:]+:([^@]+)@.*#\1#p' "${file}" | tail -n 1 || true
}

echo "==> Installing system packages"
apt-get update
apt-get install -y ca-certificates curl fail2ban git gnupg nginx postgresql postgresql-contrib ufw rsync openssl sudo unattended-upgrades

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'Number(process.versions.node.split(".")[0])')" -lt 20 ]]; then
  echo "==> Installing Node.js ${NODE_MAJOR}.x"
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL "https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key" | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
  apt-get update
  apt-get install -y nodejs
fi

echo "==> Creating app user and directory"
if ! id "${APP_USER}" >/dev/null 2>&1; then
  useradd --system --create-home --shell /usr/sbin/nologin "${APP_USER}"
fi
mkdir -p "${APP_DIR}"

if [[ -f "${APP_DIR}/.env" && "${RESET_CREDENTIALS:-0}" != "1" ]]; then
  echo "==> Reusing existing .env credentials"
  DB_PASSWORD="$(read_database_password "${APP_DIR}/.env")"
  ADMIN_PASSWORD="$(read_env_value "ADMIN_PASSWORD" "${APP_DIR}/.env")"
  NEXTAUTH_SECRET="$(read_env_value "ADMIN_SESSION_SECRET" "${APP_DIR}/.env")"
fi

if [[ -z "${DB_PASSWORD}" ]]; then
  DB_PASSWORD="$(openssl rand -hex 24)"
fi
if [[ -z "${ADMIN_PASSWORD}" ]]; then
  ADMIN_PASSWORD="$(openssl rand -base64 24 | tr -d '\n')"
fi
if [[ -z "${NEXTAUTH_SECRET}" ]]; then
  NEXTAUTH_SECRET="$(openssl rand -hex 32)"
fi

echo "==> Syncing project to ${APP_DIR}"
rsync -a --delete \
  --exclude ".git" \
  --exclude ".artifacts" \
  --exclude ".next" \
  --exclude "node_modules" \
  --exclude ".env" \
  --exclude "background" \
  --exclude "donebike" \
  --exclude "seka exaero GR" \
  --exclude "seka exceed rdc" \
  --exclude "seka exceed standart" \
  --exclude "seka spear rdc" \
  --exclude "seka spear standart" \
  --exclude "carbonara logo.png" \
  --exclude "договор публичной оферты.txt" \
  --exclude "public/media/reference" \
  --exclude "public/media/donebike/*.jpg" \
  --exclude "public/media/donebike/*.jpeg" \
  --exclude "scripts/scrape-*.ts" \
  --exclude "*.tsbuildinfo" \
  "${SOURCE_DIR}/" "${APP_DIR}/"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"

echo "==> Configuring PostgreSQL"
systemctl enable --now postgresql
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER SYSTEM SET listen_addresses TO 'localhost';"
systemctl restart postgresql
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

echo "==> Writing .env"
cat > "${APP_DIR}/.env" <<ENV
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
NEXT_PUBLIC_SITE_URL="https://${PRIMARY_DOMAIN}"
ADMIN_EMAIL="${ADMIN_EMAIL}"
ADMIN_PASSWORD="${ADMIN_PASSWORD}"
ADMIN_SESSION_SECRET="${NEXTAUTH_SECRET}"
NODE_ENV="production"
ENV
chown "${APP_USER}:${APP_USER}" "${APP_DIR}/.env"
chmod 600 "${APP_DIR}/.env"

echo "==> Configuring daily PostgreSQL backups"
install -d -m 700 -o root -g root "${BACKUP_DIR}"
cat > "/usr/local/sbin/${APP_NAME}-backup.sh" <<BACKUP
#!/usr/bin/env bash
set -Eeuo pipefail

BACKUP_DIR="${BACKUP_DIR}"
DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"
DB_PASSWORD="${DB_PASSWORD}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS}"

install -d -m 700 "\${BACKUP_DIR}"
timestamp="\$(date +%Y%m%d-%H%M%S)"
PGPASSWORD="\${DB_PASSWORD}" pg_dump -h 127.0.0.1 -U "\${DB_USER}" "\${DB_NAME}" | gzip > "\${BACKUP_DIR}/\${DB_NAME}-\${timestamp}.sql.gz"
find "\${BACKUP_DIR}" -type f -name "\${DB_NAME}-*.sql.gz" -mtime "+\${RETENTION_DAYS}" -delete
BACKUP
chmod 700 "/usr/local/sbin/${APP_NAME}-backup.sh"
cat > "/etc/cron.d/${APP_NAME}-backup" <<CRON
17 3 * * * root /usr/local/sbin/${APP_NAME}-backup.sh >/var/log/${APP_NAME}-backup.log 2>&1
CRON
chmod 644 "/etc/cron.d/${APP_NAME}-backup"

echo "==> Installing npm dependencies"
cd "${APP_DIR}"
sudo -u "${APP_USER}" npm ci

echo "==> Applying database migrations and seed"
sudo -u "${APP_USER}" npm run prisma:deploy
sudo -u "${APP_USER}" npm run seed

echo "==> Building Next.js app"
sudo -u "${APP_USER}" npm run build

echo "==> Removing development dependencies from production install"
sudo -u "${APP_USER}" npm prune --omit=dev

echo "==> Creating systemd service"
cat > "/etc/systemd/system/${APP_NAME}.service" <<SERVICE
[Unit]
Description=SEKA Carbonara Bike Next.js app
After=network.target postgresql.service

[Service]
Type=simple
User=${APP_USER}
Group=${APP_USER}
WorkingDirectory=${APP_DIR}
EnvironmentFile=${APP_DIR}/.env
Environment=PORT=${PORT}
ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port ${PORT}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable --now "${APP_NAME}"

echo "==> Configuring Nginx"
cat > "/etc/nginx/conf.d/${APP_NAME}-limits.conf" <<'NGINX'
limit_req_zone $binary_remote_addr zone=seka_global:20m rate=8r/s;
limit_req_zone $binary_remote_addr zone=seka_forms:10m rate=3r/m;
limit_req_zone $binary_remote_addr zone=seka_login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=seka_admin:10m rate=2r/s;
limit_conn_zone $binary_remote_addr zone=seka_conn:10m;
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

    location = /api/orders {
        limit_req zone=seka_forms burst=3 nodelay;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }

    location = /api/leads {
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
        limit_req zone=seka_global burst=40 nodelay;
        limit_conn seka_conn 30;
        include /etc/nginx/snippets/${APP_NAME}-proxy.conf;
    }
}
NGINX

ln -sf "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Configuring firewall"
ufw default deny incoming >/dev/null || true
ufw default allow outgoing >/dev/null || true
ufw allow OpenSSH >/dev/null || true
ufw allow "Nginx Full" >/dev/null || true
ufw --force enable >/dev/null || true

echo "==> Configuring Fail2Ban"
cat > "/etc/fail2ban/filter.d/${APP_NAME}-nginx-limit.conf" <<'FILTER'
[Definition]
failregex = limiting requests, excess: .* by zone "seka_.*", client: <HOST>,
ignoreregex =
FILTER

cat > "/etc/fail2ban/filter.d/${APP_NAME}-nginx-403.conf" <<'FILTER'
[Definition]
failregex = ^<HOST> - .* "(GET|POST|HEAD) .*" (403|444) .*
ignoreregex =
FILTER

cat > "/etc/fail2ban/jail.d/${APP_NAME}.local" <<JAIL
[sshd]
enabled = true
maxretry = 5
findtime = 10m
bantime = 1h

[${APP_NAME}-nginx-limit]
enabled = true
filter = ${APP_NAME}-nginx-limit
logpath = /var/log/nginx/error.log
maxretry = 20
findtime = 10m
bantime = 1h

[${APP_NAME}-nginx-403]
enabled = true
filter = ${APP_NAME}-nginx-403
logpath = /var/log/nginx/access.log
maxretry = 80
findtime = 10m
bantime = 1h
JAIL
systemctl enable --now fail2ban
systemctl restart fail2ban

echo "==> Configuring automatic security updates"
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'APT'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
APT
systemctl enable --now unattended-upgrades || true

echo "==> Installing SSL certificates"
apt-get install -y certbot python3-certbot-nginx
if certbot --nginx --non-interactive --agree-tos --redirect --email "${ADMIN_EMAIL}" $(printf -- "-d %s " "${DOMAINS[@]}"); then
  SSL_STATUS="issued"
else
  SSL_STATUS="not issued. Check DNS A records for all domains, then run: certbot --nginx -d ${DOMAINS[*]}"
fi

cat > "${CREDENTIALS_FILE}" <<CREDS
SEKA Carbonara Bike installation credentials

App directory: ${APP_DIR}
Systemd service: ${APP_NAME}
Primary URL: https://${PRIMARY_DOMAIN}
Secondary URL: https://${SECONDARY_DOMAIN}
SSL status: ${SSL_STATUS}
Backup directory: ${BACKUP_DIR}

PostgreSQL:
  database: ${DB_NAME}
  user: ${DB_USER}
  password: ${DB_PASSWORD}
  DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public

Admin:
  email: ${ADMIN_EMAIL}
  password: ${ADMIN_PASSWORD}

Useful commands:
  systemctl status ${APP_NAME}
  journalctl -u ${APP_NAME} -f
  systemctl restart ${APP_NAME}
CREDS
chmod 600 "${CREDENTIALS_FILE}"

echo
echo "=============================================="
echo "Installation complete"
echo "=============================================="
echo "Primary URL:   https://${PRIMARY_DOMAIN}"
echo "Secondary URL: https://${SECONDARY_DOMAIN}"
echo "SSL status:    ${SSL_STATUS}"
echo "Backups:       ${BACKUP_DIR} (daily, ${BACKUP_RETENTION_DAYS} days)"
echo
echo "PostgreSQL database: ${DB_NAME}"
echo "PostgreSQL user:     ${DB_USER}"
echo "PostgreSQL password: ${DB_PASSWORD}"
echo "DATABASE_URL:        postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
echo
echo "Admin email:    ${ADMIN_EMAIL}"
echo "Admin password: ${ADMIN_PASSWORD}"
echo
echo "Credentials saved to: ${CREDENTIALS_FILE}"
echo "Service: systemctl status ${APP_NAME}"
echo "Logs:    journalctl -u ${APP_NAME} -f"
echo "=============================================="
