#!/bin/bash

# Tests de Validation DNS pour fixie.run
# Script de vérification post-configuration
# Auteur: Assistant IA - DNS Configuration Expert

set -euo pipefail

# Variables
DOMAIN="fixie.run"
TIMEOUT=5

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }

# Test de résolution DNS
test_dns_resolution() {
    local subdomain="$1"
    local expected_type="${2:-CNAME}"
    local full_domain="$subdomain.$DOMAIN"
    
    if [ "$subdomain" = "@" ]; then
        full_domain="$DOMAIN"
    fi
    
    log "Test DNS: $full_domain ($expected_type)"
    
    if timeout $TIMEOUT nslookup "$full_domain" >/dev/null 2>&1; then
        echo "✅ $full_domain résolu"
        
        # Afficher les détails
        if command -v dig >/dev/null 2>&1; then
            local result=$(dig +short "$full_domain" "$expected_type" 2>/dev/null || echo "N/A")
            echo "   → $expected_type: $result"
        fi
    else
        echo "❌ $full_domain non résolu"
        return 1
    fi
}

# Test SSL/TLS
test_ssl() {
    local subdomain="$1"
    local full_domain="$subdomain.$DOMAIN"
    
    if [ "$subdomain" = "@" ]; then
        full_domain="$DOMAIN"
    fi
    
    log "Test SSL: $full_domain"
    
    if timeout $TIMEOUT openssl s_client -connect "$full_domain:443" -servername "$full_domain" </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
        echo "✅ $full_domain SSL valide"
    else
        echo "❌ $full_domain SSL invalide"
        return 1
    fi
}

# Test HTTP/HTTPS
test_http() {
    local subdomain="$1"
    local expected_status="${2:-200}"
    local full_domain="$subdomain.$DOMAIN"
    
    if [ "$subdomain" = "@" ]; then
        full_domain="$DOMAIN"
    fi
    
    log "Test HTTP: https://$full_domain"
    
    local status=$(timeout $TIMEOUT curl -s -o /dev/null -w "%{http_code}" "https://$full_domain" 2>/dev/null || echo "000")
    
    if [ "$status" = "$expected_status" ] || [ "$status" = "301" ] || [ "$status" = "302" ]; then
        echo "✅ https://$full_domain accessible (HTTP $status)"
    else
        echo "❌ https://$full_domain inaccessible (HTTP $status)"
        return 1
    fi
}

# Test CAA Records
test_caa() {
    log "Test CAA Records"
    
    if command -v dig >/dev/null 2>&1; then
        local caa_records=$(dig +short "$DOMAIN" CAA 2>/dev/null)
        
        if [ -n "$caa_records" ]; then
            echo "✅ Enregistrements CAA trouvés:"
            echo "$caa_records" | sed 's/^/   → /'
        else
            echo "❌ Aucun enregistrement CAA trouvé"
            return 1
        fi
    else
        warn "dig non disponible, test CAA ignoré"
    fi
}

# Test DNSSEC
test_dnssec() {
    log "Test DNSSEC"
    
    if command -v dig >/dev/null 2>&1; then
        local dnssec_result=$(dig +dnssec +short "$DOMAIN" 2>/dev/null)
        
        if echo "$dnssec_result" | grep -q "RRSIG"; then
            echo "✅ DNSSEC activé et fonctionnel"
        else
            echo "⚠️  DNSSEC non détecté (peut être normal si pas encore activé)"
        fi
    else
        warn "dig non disponible, test DNSSEC ignoré"
    fi
}

# Test des enregistrements MX
test_mx() {
    log "Test MX Records"
    
    if command -v dig >/dev/null 2>&1; then
        local mx_records=$(dig +short "$DOMAIN" MX 2>/dev/null)
        
        if [ -n "$mx_records" ]; then
            echo "✅ Enregistrements MX trouvés:"
            echo "$mx_records" | sed 's/^/   → /'
        else
            echo "❌ Aucun enregistrement MX trouvé"
            return 1
        fi
    else
        warn "dig non disponible, test MX ignoré"
    fi
}

# Test SPF/DMARC
test_email_security() {
    log "Test Sécurité Email (SPF/DMARC)"
    
    if command -v dig >/dev/null 2>&1; then
        # Test SPF
        local spf_record=$(dig +short "$DOMAIN" TXT 2>/dev/null | grep "v=spf1" || echo "")
        if [ -n "$spf_record" ]; then
            echo "✅ SPF Record trouvé: $spf_record"
        else
            echo "❌ SPF Record manquant"
        fi
        
        # Test DMARC
        local dmarc_record=$(dig +short "_dmarc.$DOMAIN" TXT 2>/dev/null | grep "v=DMARC1" || echo "")
        if [ -n "$dmarc_record" ]; then
            echo "✅ DMARC Record trouvé: $dmarc_record"
        else
            echo "❌ DMARC Record manquant"
        fi
    else
        warn "dig non disponible, tests email ignorés"
    fi
}

# Test de performance DNS
test_dns_performance() {
    log "Test Performance DNS"
    
    local start_time=$(date +%s%3N)
    nslookup "$DOMAIN" >/dev/null 2>&1
    local end_time=$(date +%s%3N)
    local duration=$((end_time - start_time))
    
    echo "⏱️  Temps de résolution: ${duration}ms"
    
    if [ "$duration" -lt 100 ]; then
        echo "✅ Performance DNS excellente (< 100ms)"
    elif [ "$duration" -lt 300 ]; then
        echo "⚠️  Performance DNS acceptable (< 300ms)"
    else
        echo "❌ Performance DNS lente (> 300ms)"
    fi
}

# Tests principaux
run_dns_tests() {
    info "${BLUE}=== TESTS DE RÉSOLUTION DNS ===${NC}"
    
    # Domaines principaux
    test_dns_resolution "@" "A"
    test_dns_resolution "www" "CNAME"
    test_dns_resolution "mobile" "CNAME"
    
    # Services applicatifs
    test_dns_resolution "app" "CNAME"
    test_dns_resolution "admin" "CNAME"  
    test_dns_resolution "docs" "CNAME"
    
    # API & WebSocket
    test_dns_resolution "api" "CNAME"
    test_dns_resolution "ws" "CNAME"
    
    # Web3 & Blockchain
    test_dns_resolution "contracts" "CNAME"
    test_dns_resolution "ipfs" "CNAME"
    test_dns_resolution "analytics" "CNAME"
    
    # Auth & Monitoring
    test_dns_resolution "login" "CNAME"
    test_dns_resolution "health" "CNAME"
    
    # CDN
    test_dns_resolution "cdn" "CNAME"
}

run_ssl_tests() {
    info "${BLUE}=== TESTS SSL/TLS ===${NC}"
    
    # Domaines principaux avec SSL
    test_ssl "@"
    test_ssl "www"
    test_ssl "app"
    test_ssl "admin"
    test_ssl "api"
    test_ssl "health"
}

run_http_tests() {
    info "${BLUE}=== TESTS HTTP/HTTPS ===${NC}"
    
    # Tests d'accessibilité HTTP
    test_http "@" "200"
    test_http "www" "200"
    test_http "app" "200"
    test_http "health" "200"
}

run_security_tests() {
    info "${BLUE}=== TESTS DE SÉCURITÉ ===${NC}"
    
    test_caa
    test_dnssec
    test_mx
    test_email_security
}

run_performance_tests() {
    info "${BLUE}=== TESTS DE PERFORMANCE ===${NC}"
    
    test_dns_performance
}

# Rapport final
generate_report() {
    info "${BLUE}=== RAPPORT FINAL ===${NC}"
    
    log "Configuration DNS pour $DOMAIN testée"
    log "Timestamp: $(date)"
    
    # Recommandations
    echo ""
    echo "📋 Recommandations:"
    echo "   • Vérifier les endpoints qui ont échoué"
    echo "   • Attendre la propagation DNS (24-48h)"
    echo "   • Tester depuis différentes localisations"
    echo "   • Configurer les alertes de monitoring"
    echo ""
    echo "🔗 Liens utiles:"
    echo "   • DNS Checker: https://dnschecker.org/"
    echo "   • SSL Labs: https://www.ssllabs.com/ssltest/"
    echo "   • Cloudflare Analytics: https://dash.cloudflare.com/"
}

# Menu principal
main() {
    log "${GREEN}🔍 Tests de Validation DNS pour fixie.run${NC}"
    echo ""
    
    case "${1:-all}" in
        "dns")
            run_dns_tests
            ;;
        "ssl")
            run_ssl_tests
            ;;
        "http")
            run_http_tests
            ;;
        "security")
            run_security_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "all")
            run_dns_tests
            echo ""
            run_ssl_tests
            echo ""
            run_http_tests
            echo ""
            run_security_tests
            echo ""
            run_performance_tests
            echo ""
            generate_report
            ;;
        "help"|*)
            echo "Usage: $0 {dns|ssl|http|security|performance|all|help}"
            echo ""
            echo "Tests disponibles:"
            echo "  dns         - Tests de résolution DNS"
            echo "  ssl         - Tests de certificats SSL/TLS"
            echo "  http        - Tests d'accessibilité HTTP/HTTPS"
            echo "  security    - Tests de sécurité (CAA, DNSSEC, SPF, DMARC)"
            echo "  performance - Tests de performance DNS"
            echo "  all         - Tous les tests (par défaut)"
            echo "  help        - Afficher cette aide"
            echo ""
            echo "Exemples:"
            echo "  $0           # Tous les tests"
            echo "  $0 dns       # Tests DNS uniquement"
            echo "  $0 security  # Tests de sécurité uniquement"
            exit 0
            ;;
    esac
}

# Point d'entrée
main "$@"