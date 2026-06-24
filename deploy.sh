#!/bin/bash

# Script de deploy para Drive Data LP Front
# Uso: ./deploy.sh [ambiente]
# Ambiente: local (padrão) | staging | production

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_warn "Docker Compose não está instalado. Instale para usar 'docker-compose up'."
fi

# Configuração
AMBIENTE=${1:-local}
IMAGE_NAME="drive-data-lp-front"
CONTAINER_NAME="drive-data-lp-front"
PORT=3000

log_info "Iniciando deploy para ambiente: $AMBIENTE"

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    log_error "Arquivo .env não encontrado!"
    log_info "Crie um arquivo .env baseado no .env.example"
    exit 1
fi

log_info "Usando variáveis do arquivo .env local"

# Parar e remover container existente
if docker ps -a | grep -q $CONTAINER_NAME; then
    log_info "Parando container existente..."
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# Build da imagem (o .env será copiado para dentro e lido automaticamente)
log_info "Building imagem Docker..."
log_info "O Next.js vai ler o arquivo .env durante o build"
docker build \
    -t $IMAGE_NAME:latest \
    -t $IMAGE_NAME:$AMBIENTE \
    .

# Executar o container
log_info "Iniciando container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    -e NODE_ENV=production \
    --restart unless-stopped \
    $IMAGE_NAME:latest

# Aguardar container iniciar
log_info "Aguardando container iniciar..."
sleep 5

# Verificar se o container está rodando
if docker ps | grep -q $CONTAINER_NAME; then
    log_info "✅ Container iniciado com sucesso!"
    log_info "Aplicação disponível em: http://localhost:$PORT"
    
    # Mostrar logs
    log_info "Últimos logs:"
    docker logs --tail 20 $CONTAINER_NAME
    
    log_info ""
    log_info "Comandos úteis:"
    log_info "  Ver logs em tempo real: docker logs -f $CONTAINER_NAME"
    log_info "  Parar aplicação: docker stop $CONTAINER_NAME"
    log_info "  Ver status: docker ps | grep $CONTAINER_NAME"
else
    log_error "❌ Falha ao iniciar o container"
    log_error "Logs do container:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Limpar imagens antigas
log_info "Limpando imagens antigas..."
docker image prune -f

log_info "🚀 Deploy concluído com sucesso!"

