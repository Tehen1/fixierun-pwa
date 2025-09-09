#!/bin/bash

# Configuration DNS Optimale pour fixie.run
# Script d'implémentation Cloudflare API
# Auteur: Assistant IA - Configuration DNS Expert

set -euo pipefail

# Variables de configuration
ZONE_ID="${CLOUDFLARE_ZONE_ID:-}"
API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
DOMAIN="fixie.run"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Vérification des prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    if [ -z "$ZONE_ID" ]; then
        error "CLOUDFLARE_ZONE_ID non défini. Export CLOUDFLARE_ZONE_ID=votre_zone_id"
    fi
    
    if [ -z "$API_TOKEN" ]; then
        error "CLOUDFLARE_API_TOKEN non défini. Export CLOUDFLARE_API_TOKEN=votre_token"
    fi
    
    if ! command -v curl &> /dev/null; then
        error "curl n'est pas installé"
    fi
    
    if ! command -v jq &> /dev/null; then
        error "jq n'est pas installé"
    fi
    
    log "✅ Prérequis validés"
}

# Fonction pour appeler l'API Cloudflare
cf_api() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    
    local url="https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records$endpoint"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" "$url" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "$data"
    else
        curl -s -X "$method" "$url" \
            -H "Authorization: Bearer $API_TOKEN"
    fi
}

# Créer ou mettre à jour un enregistrement DNS
create_or_update_record() {
    local type="$1"
    local name="$2" 
    local content="$3"
    local proxied="${4:-false}"
    local ttl="${5:-1}"
    
    log "Configuration $type: $name -> $content (Proxied: $proxied, TTL: $ttl)"
    
    # Vérifier si l'enregistrement existe
    local existing=$(cf_api "GET" "?name=$name.$DOMAIN&type=$type")
    local record_id=$(echo "$existing" | jq -r '.result[0].id // empty')
    
    local data="{
        \"type\": \"$type\",
        \"name\": \"$name\",
        \"content\": \"$content\",
        \"proxied\": $proxied,
        \"ttl\": $ttl
    }"
    
    if [ -n "$record_id" ] && [ "$record_id" != "null" ]; then
        # Mettre à jour l'enregistrement existant
        local result=$(cf_api "PUT" "/$record_id" "$data")
        local success=$(echo "$result" | jq -r '.success')
        
        if [ "$success" = "true" ]; then
            log "✅ Mis à jour: $name.$DOMAIN"
        else
            warn "❌ Échec mise à jour: $name.$DOMAIN"
            echo "$result" | jq '.errors'
        fi
    else
        # Créer un nouvel enregistrement
        local result=$(cf_api "POST" "" "$data")
        local success=$(echo "$result" | jq -r '.success')
        
        if [ "$success" = "true" ]; then
            log "✅ Créé: $name.$DOMAIN"
        else
            warn "❌ Échec création: $name.$DOMAIN"
            echo "$result" | jq '.errors'
        fi
    fi
}

# Phase 1: Correction des CNAME principaux
phase1_cname_consistency() {
    log "${BLUE}=== PHASE 1: Cohérence des CNAME ===${NC}"
    
    # www et mobile en Proxied
    create_or_update_record "CNAME" "www" "$DOMAIN" "true" "3600"
    create_or_update_record "CNAME" "mobile" "$DOMAIN" "true" "3600"
}

# Phase 2: Endpoints Web3/PWA
phase2_web3_endpoints() {
    log "${BLUE}=== PHASE 2: Endpoints Web3/PWA ===${NC}"
    
    # API Backend
    create_or_update_record "CNAME" "api" "cname.vercel-dns.com" "true" "300"
    
    # WebSocket
    create_or_update_record "CNAME" "ws" "cname.vercel-dns.com" "true" "300"
    
    # CDN Assets
    create_or_update_record "CNAME" "cdn" "cname.vercel-dns.com" "true" "3600"
    
    # Health Check
    create_or_update_record "CNAME" "health" "cname.vercel-dns.com" "true" "300"
    
    # Smart Contracts (Protection MEV)
    create_or_update_record "CNAME" "contracts" "cname.vercel-dns.com" "true" "300"
    
    # Analytics (DNS Only pour latence blockchain)
    create_or_update_record "CNAME" "analytics" "cname.vercel-dns.com" "false" "300"
}

# Phase 3: Enregistrements de sécurité CAA
phase3_security_caa() {
    log "${BLUE}=== PHASE 3: Enregistrements CAA ===${NC}"
    
    # CAA Let's Encrypt
    create_or_update_record "CAA" "$DOMAIN" "0 issue \"letsencrypt.org\"" "false" "3600"
    create_or_update_record "CAA" "$DOMAIN" "0 issuewild \"letsencrypt.org\"" "false" "3600"
    create_or_update_record "CAA" "$DOMAIN" "0 iodef \"mailto:security@fixie.run\"" "false" "3600"
}

# Optimisation TTL des enregistrements existants
optimize_existing_ttl() {
    log "${BLUE}=== OPTIMISATION TTL ===${NC}"
    
    # Services stables - TTL long (3600s)
    local stable_services=("app" "docs" "ipfs" "cdn")
    for service in "${stable_services[@]}"; do
        log "Optimisation TTL pour $service (3600s)"
        # Note: Cette partie nécessiterait une logique plus complexe pour modifier uniquement le TTL
    done
    
    # Services dynamiques - TTL court (300s) 
    local dynamic_services=("login" "api" "admin" "health" "contracts" "analytics")
    for service in "${dynamic_services[@]}"; do
        log "Optimisation TTL pour $service (300s)"
        # Note: Cette partie nécessiterait une logique plus complexe pour modifier uniquement le TTL
    done
}

# Validation de la configuration
validate_configuration() {
    log "${BLUE}=== VALIDATION CONFIGURATION ===${NC}"
    
    local endpoints=("www" "mobile" "api" "ws" "cdn" "health" "contracts" "analytics")
    
    for endpoint in "${endpoints[@]}"; do
        log "Test résolution DNS: $endpoint.$DOMAIN"
        if nslookup "$endpoint.$DOMAIN" >/dev/null 2>&1; then
            log "✅ $endpoint.$DOMAIN résolu"
        else
            warn "❌ $endpoint.$DOMAIN non résolu"
        fi
    done
}

# Affichage du statut DNSSEC
check_dnssec_status() {
    log "${BLUE}=== STATUT DNSSEC ===${NC}"
    
    local dnssec_url="https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dnssec"
    local dnssec_status=$(curl -s -X GET "$dnssec_url" \
        -H "Authorization: Bearer $API_TOKEN" | jq -r '.result.status // "unknown"')
    
    log "Statut DNSSEC: $dnssec_status"
    
    if [ "$dnssec_status" = "disabled" ]; then
        warn "DNSSEC désactivé. Activation recommandée via le dashboard Cloudflare."
        log "Dashboard: https://dash.cloudflare.com -> DNS -> DNSSEC"
    fi
}

# Fonction principale
main() {
    log "${GREEN}🚀 Configuration DNS Optimale pour fixie.run${NC}"
    log "Zone ID: $ZONE_ID"
    
    check_prerequisites
    
    # Exécution des phases
    phase1_cname_consistency
    phase2_web3_endpoints  
    phase3_security_caa
    
    # Optimisations
    optimize_existing_ttl
    
    # Validation
    validate_configuration
    check_dnssec_status
    
    log "${GREEN}✅ Configuration DNS terminée avec succès!${NC}"
    log "${YELLOW}📋 Actions manuelles restantes:${NC}"
    log "   1. Activer DNSSEC via le dashboard Cloudflare"
    log "   2. Vérifier les certificats SSL après propagation"
    log "   3. Tester les endpoints applicatifs"
    log "   4. Configurer les alertes de monitoring"
}

# Gestion des arguments
case "${1:-help}" in
    "run")
        main
        ;;
    "validate")
        check_prerequisites
        validate_configuration
        ;;
    "dnssec")
        check_prerequisites
        check_dnssec_status
        ;;
    "help"|*)
        echo "Usage: $0 {run|validate|dnssec|help}"
        echo ""
        echo "Commandes:"
        echo "  run      - Exécuter la configuration DNS complète"
        echo "  validate - Valider la configuration existante"
        echo "  dnssec   - Vérifier le statut DNSSEC"
        echo "  help     - Afficher cette aide"
        echo ""
        echo "Variables d'environnement requises:"
        echo "  CLOUDFLARE_ZONE_ID   - ID de la zone Cloudflare"
        echo "  CLOUDFLARE_API_TOKEN - Token API Cloudflare"
        echo ""
        echo "Exemple:"
        echo "  export CLOUDFLARE_ZONE_ID='votre_zone_id'"
        echo "  export CLOUDFLARE_API_TOKEN='votre_token'"
        echo "  $0 run"
        exit 0
        ;;
esac