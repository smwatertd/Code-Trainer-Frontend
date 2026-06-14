#!/usr/bin/env bash
# Бесплатный доверенный HTTPS через Let's Encrypt (нужен поддомен, напр. DuckDNS).
set -euo pipefail

DOMAIN="${1:?Usage: ./deploy/setup-letsencrypt.sh your-name.duckdns.org admin@example.com}"
EMAIL="${2:-admin@${DOMAIN}}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

mkdir -p "${SCRIPT_DIR}/certbot/www"

# Временный nginx только для HTTP-01 challenge
sed "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" "${SCRIPT_DIR}/nginx.letsencrypt-http.conf" \
  > "${SCRIPT_DIR}/nginx.conf"

cd "${ROOT_DIR}"
docker compose up -d --force-recreate

docker run --rm \
  -v "${SCRIPT_DIR}/certbot/www:/var/www/certbot" \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d "${DOMAIN}" \
  --email "${EMAIL}" \
  --agree-tos \
  --non-interactive

sed "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" "${SCRIPT_DIR}/nginx.letsencrypt.conf" \
  > "${SCRIPT_DIR}/nginx.conf"

docker compose up -d --force-recreate

echo ""
echo "Готово. Откройте https://${DOMAIN}"
echo "Обновите CORS на backend:"
echo "  CORS__ORIGINS=https://${DOMAIN}"
echo "  docker compose --env-file .env -f docker/docker-compose.prod.yml up -d"
