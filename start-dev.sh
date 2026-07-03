#!/bin/bash
set -e

echo "🚀 Iniciando SEOForge..."

# Levantar infraestructura
echo "📦 Levantando servicios de Docker..."
docker compose -f docker/docker-compose.yml up -d

# Instalar dependencias
echo "📦 Instalando dependencias con npm..."
npm install

# Levantar servidores de desarrollo
echo "💻 Iniciando servidores en modo de desarrollo..."
npx turbo run dev
