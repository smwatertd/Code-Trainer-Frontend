# Деплой frontend (VPS)

Nginx отдаёт статику и проксирует `/api` на backend (`127.0.0.1:8000` на хосте).

**Сначала** поднимите backend — см. `Code-Trainer-Backend/DEPLOY.md` (создаст сеть `code-trainer-net`).

## Установка

```bash
sudo apt update && sudo apt install -y git docker.io docker-compose-v2 openssl
sudo systemctl enable --now docker

git clone git@github.com:smwatertd/Code-Trainer-Frontend.git /opt/code-trainer-frontend
cd /opt/code-trainer-frontend

chmod +x deploy/generate-self-signed.sh
./deploy/generate-self-signed.sh 92.63.102.50

docker compose up -d --build
```

## Обновление

```bash
cd /opt/code-trainer-frontend
git pull
docker compose up -d --build
```

## Проверка

Откройте `https://92.63.102.50` (примите self-signed сертификат в браузере).

```bash
curl -k -s https://127.0.0.1/api/health
```

## Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Порты 8000, 5432, 6379 наружу не открывать.
