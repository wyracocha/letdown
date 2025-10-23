#!/bin/bash

##############################################################################
# Script: github-app-token.sh
# Descripción: Genera token de GitHub App y lo exporta a GitHub Output
# Uso: ./github-app-token.sh <APP_ID> <PEM_FILE_OR_CONTENT>
#
# Argumentos:
#   $1 - APP_ID: ID de la GitHub App
#   $2 - PEM: Ruta al archivo .pem o contenido de la clave privada
#
# Outputs (GitHub Actions):
#   token           - Token de acceso generado
#   installation-id - ID de la instalación
#   expires-at      - Fecha de expiración del token
#
# Ejemplos:
#   ./github-app-token.sh 123456 ./mi-app.pem
#   ./github-app-token.sh 123456 "-----BEGIN RSA PRIVATE KEY-----..."
##############################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

# # Verificar argumentos
# if [ $# -lt 2 ]; then
#     log_error "Argumentos insuficientes"
#     echo ""
#     echo "Uso: $0 <APP_ID> <PEM_FILE_OR_CONTENT>"
#     echo ""
#     echo "Ejemplos:"
#     echo "  $0 123456 ./mi-app.pem"
#     echo "  $0 123456 \"\$(cat mi-app.pem)\""
#     echo "  $0 \${{ secrets.APP_ID }} \${{ secrets.APP_PRIVATE_KEY }}"
#     exit 1
# fi

# APP_ID="$1"
# PEM_INPUT="$2"

log_info "Iniciando generación de token para GitHub App..."

# Verificar dependencias
for cmd in openssl jq curl; do
    if ! command -v $cmd &> /dev/null; then
        log_error "Dependencia faltante: $cmd"
        exit 1
    fi
done

# Procesar el PEM
if [ -f "$PEM_INPUT" ]; then
    log_info "Leyendo clave privada desde archivo: $PEM_INPUT"
    PRIVATE_KEY=$(cat "$PEM_INPUT")
else
    log_info "Usando clave privada desde argumento"
    PRIVATE_KEY="$PEM_INPUT"
fi

# Validar formato PEM
if ! echo "$PRIVATE_KEY" | grep -q "BEGIN.*PRIVATE KEY"; then
    log_error "El PEM no tiene formato válido"
    log_error "Debe contener '-----BEGIN ... PRIVATE KEY-----'"
    exit 1
fi

# Función para codificar base64 URL-safe
base64url_encode() {
    openssl base64 -A | tr '+/' '-_' | tr -d '='
}

# 1. Generar JWT
log_info "Generando JWT..."

now=$(date +%s)
iat=$((now - 60))
exp=$((now + 600))

header='{"typ":"JWT","alg":"RS256"}'
header_b64=$(echo -n "$header" | base64url_encode)

payload="{\"iat\":${iat},\"exp\":${exp},\"iss\":\"${APP_ID}\"}"
payload_b64=$(echo -n "$payload" | base64url_encode)

header_payload="${header_b64}.${payload_b64}"
signature=$(echo -n "$header_payload" | \
    openssl dgst -binary -sha256 -sign <(echo "$PRIVATE_KEY") | \
    base64url_encode)

jwt="${header_payload}.${signature}"
log_success "JWT generado exitosamente"

# 2. Obtener Installation ID
log_info "Obteniendo Installation ID..."

installations_response=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $jwt" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/app/installations)

http_code=$(echo "$installations_response" | tail -n1)
installations_body=$(echo "$installations_response" | head -n-1)

if [ "$http_code" != "200" ]; then
    log_error "Error al obtener instalaciones (HTTP $http_code)"
    echo "$installations_body" >&2
    exit 1
fi

installation_id=$(echo "$installations_body" | jq -r '.[0].id')

if [ "$installation_id" = "null" ] || [ -z "$installation_id" ]; then
    log_error "No se encontró ninguna instalación"
    log_error "Asegúrate de que la GitHub App esté instalada"
    exit 1
fi

log_success "Installation ID: $installation_id"

# 3. Generar token de instalación
log_info "Generando token de instalación..."

token_response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $jwt" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/app/installations/${installation_id}/access_tokens")

http_code=$(echo "$token_response" | tail -n1)
token_body=$(echo "$token_response" | head -n-1)

if [ "$http_code" != "201" ]; then
    log_error "Error al generar token (HTTP $http_code)"
    echo "$token_body" >&2
    exit 1
fi

token=$(echo "$token_body" | jq -r '.token')
expires_at=$(echo "$token_body" | jq -r '.expires_at')

if [ "$token" = "null" ] || [ -z "$token" ]; then
    log_error "No se pudo extraer el token"
    exit 1
fi

log_success "Token generado exitosamente"
log_success "Expira en: $expires_at"

# 4. Exportar a GitHub Actions Output
if [ -n "$GITHUB_OUTPUT" ]; then
    log_info "Exportando a GITHUB_OUTPUT..."
    
    echo "token=$token" >> "$GITHUB_OUTPUT"
    echo "installation-id=$installation_id" >> "$GITHUB_OUTPUT"
    echo "expires-at=$expires_at" >> "$GITHUB_OUTPUT"
    
    # Ocultar token en logs
    echo "::add-mask::$token"
    
    log_success "Variables exportadas:"
    echo "  - token (masked)"
    echo "  - installation-id: $installation_id"
    echo "  - expires-at: $expires_at"
else
    # Si no está en GitHub Actions, mostrar el output
    log_info "No se detectó GITHUB_OUTPUT, mostrando valores:"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "TOKEN:"
    echo "$token"
    echo ""
    echo "INSTALLATION_ID:"
    echo "$installation_id"
    echo ""
    echo "EXPIRES_AT:"
    echo "$expires_at"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

echo ""
log_success "✨ Proceso completado exitosamente"

# También exportar como variables de entorno para uso inmediato en el mismo script
export GITHUB_TOKEN="$token"
export GITHUB_INSTALLATION_ID="$installation_id"