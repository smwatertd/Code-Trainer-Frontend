#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSL_DIR="${SCRIPT_DIR}/ssl"
IP="${1:-92.63.102.50}"

mkdir -p "${SSL_DIR}"

openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
  -keyout "${SSL_DIR}/key.pem" \
  -out "${SSL_DIR}/cert.pem" \
  -subj "/CN=${IP}" \
  -addext "subjectAltName=IP:${IP}"

echo "Сертификат создан: ${SSL_DIR}/cert.pem"
echo "Браузер покажет предупреждение — это нормально для IP без домена."
