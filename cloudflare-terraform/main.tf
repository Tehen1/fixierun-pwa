# Configuration DNS Optimale pour fixie.run
# Infrastructure as Code avec Terraform
# Auteur: Assistant IA - DNS Configuration Expert

terraform {
  required_version = ">= 1.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# Variables
variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "zone_id" {
  description = "Cloudflare Zone ID pour fixie.run"
  type        = string
}

variable "domain" {
  description = "Nom de domaine principal"
  type        = string
  default     = "fixie.run"
}

# Provider Cloudflare
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Locals pour la configuration
locals {
  # TTL Configuration
  ttl_long  = 3600  # 1 heure - Services stables
  ttl_short = 300   # 5 minutes - Services dynamiques
  ttl_auto  = 1     # Auto - Pour les enregistrements proxifiés
  
  # Vercel DNS
  vercel_cname = "cname.vercel-dns.com"
  
  # Configuration des sous-domaines
  proxied_subdomains = {
    # Domaines principaux
    "www"    = { content = var.domain, ttl = local.ttl_long }
    "mobile" = { content = var.domain, ttl = local.ttl_long }
    
    # Services applicatifs  
    "app"   = { content = local.vercel_cname, ttl = local.ttl_long }
    "admin" = { content = local.vercel_cname, ttl = local.ttl_short }
    "docs"  = { content = local.vercel_cname, ttl = local.ttl_long }
    
    # API & WebSocket
    "api"    = { content = local.vercel_cname, ttl = local.ttl_short }
    "ws"     = { content = local.vercel_cname, ttl = local.ttl_short }
    
    # Web3 & Blockchain
    "contracts" = { content = local.vercel_cname, ttl = local.ttl_short }
    
    # Monitoring & CDN
    "health" = { content = local.vercel_cname, ttl = local.ttl_short }
    "cdn"    = { content = local.vercel_cname, ttl = local.ttl_long }
  }
  
  dns_only_subdomains = {
    # Authentification (Auth0 requirement)
    "login" = { 
      content = "fixie-run.eu.auth0.com", 
      ttl = local.ttl_short 
    }
    
    # IPFS Gateway (éviter double proxy)
    "ipfs" = { 
      content = "gateway.pinata.cloud", 
      ttl = local.ttl_long 
    }
    
    # Analytics blockchain (éviter latence)
    "analytics" = { 
      content = local.vercel_cname, 
      ttl = local.ttl_short 
    }
  }
}

# Enregistrement A principal (Vercel)
resource "cloudflare_record" "root_a" {
  zone_id = var.zone_id
  name    = var.domain
  value   = "76.76.19.123"  # IP Vercel
  type    = "A"
  proxied = true
  ttl     = local.ttl_auto
  
  tags = ["production", "web3", "main"]
  
  comment = "Enregistrement A principal - Vercel hosting"
}

# Enregistrements CNAME Proxifiés
resource "cloudflare_record" "proxied_cnames" {
  for_each = local.proxied_subdomains
  
  zone_id = var.zone_id
  name    = each.key
  value   = each.value.content
  type    = "CNAME"
  proxied = true
  ttl     = local.ttl_auto
  
  tags = ["production", "web3", "proxied"]
  
  comment = "CNAME proxifié pour ${each.key} - Performance et sécurité"
}

# Enregistrements CNAME DNS Only
resource "cloudflare_record" "dns_only_cnames" {
  for_each = local.dns_only_subdomains
  
  zone_id = var.zone_id
  name    = each.key
  value   = each.value.content
  type    = "CNAME"
  proxied = false
  ttl     = each.value.ttl
  
  tags = ["production", "web3", "dns-only"]
  
  comment = "CNAME DNS only pour ${each.key} - Accès direct requis"
}

# Enregistrements MX (Email)
resource "cloudflare_record" "mx_primary" {
  zone_id  = var.zone_id
  name     = var.domain
  value    = "mx1.forwardemail.net"
  type     = "MX"
  priority = 10
  proxied  = false
  ttl      = local.ttl_long
  
  tags = ["production", "email"]
  
  comment = "MX primaire - ForwardEmail"
}

resource "cloudflare_record" "mx_secondary" {
  zone_id  = var.zone_id
  name     = var.domain
  value    = "mx2.forwardemail.net"
  type     = "MX"
  priority = 20
  proxied  = false
  ttl      = local.ttl_long
  
  tags = ["production", "email"]
  
  comment = "MX secondaire - ForwardEmail"
}

# Enregistrements TXT (Sécurité Email)
resource "cloudflare_record" "spf" {
  zone_id = var.zone_id
  name    = var.domain
  value   = "v=spf1 include:_spf.forwardemail.net -all"
  type    = "TXT"
  proxied = false
  ttl     = local.ttl_long
  
  tags = ["production", "email", "security"]
  
  comment = "SPF Record - Sécurité email"
}

resource "cloudflare_record" "dmarc" {
  zone_id = var.zone_id
  name    = "_dmarc"
  value   = "v=DMARC1; p=reject; rua=mailto:dmarc@fixie.run"
  type    = "TXT"
  proxied = false
  ttl     = local.ttl_long
  
  tags = ["production", "email", "security"]
  
  comment = "DMARC Record - Protection anti-spoofing"
}

# Enregistrements CAA (Certificate Authority Authorization)
resource "cloudflare_record" "caa_issue" {
  zone_id = var.zone_id
  name    = var.domain
  type    = "CAA"
  
  data {
    flags = 0
    tag   = "issue"
    value = "letsencrypt.org"
  }
  
  proxied = false
  ttl     = local.ttl_long
  
  tags = ["production", "security", "ssl"]
  
  comment = "CAA Record - Autorisation Let's Encrypt"
}

resource "cloudflare_record" "caa_issuewild" {
  zone_id = var.zone_id
  name    = var.domain
  type    = "CAA"
  
  data {
    flags = 0
    tag   = "issuewild"
    value = "letsencrypt.org"
  }
  
  proxied = false
  ttl     = local.ttl_long
  
  tags = ["production", "security", "ssl"]
  
  comment = "CAA Record - Autorisation wildcard Let's Encrypt"
}

resource "cloudflare_record" "caa_iodef" {
  zone_id = var.zone_id
  name    = var.domain
  type    = "CAA"
  
  data {
    flags = 0
    tag   = "iodef"
    value = "mailto:security@fixie.run"
  }
  
  proxied = false
  ttl     = local.ttl_long
  
  tags = ["production", "security", "ssl"]
  
  comment = "CAA Record - Notification incidents SSL"
}

# Configuration de la zone (paramètres globaux)
resource "cloudflare_zone_settings_override" "fixie_run_settings" {
  zone_id = var.zone_id
  
  settings {
    # Sécurité
    always_use_https         = "on"
    automatic_https_rewrites = "on"
    ssl                     = "strict"
    min_tls_version         = "1.2"
    tls_1_3                 = "on"
    
    # Performance
    brotli               = "on"
    minify {
      css  = "on"
      html = "on"
      js   = "on"
    }
    
    # Cache
    browser_cache_ttl = 31536000  # 1 an
    
    # Sécurité avancée
    security_level           = "medium"
    challenge_ttl           = 1800
    browser_check           = "on"
    hotlink_protection      = "on"
    
    # Web3/DeFi optimizations
    http2                   = "on"
    http3                   = "on"
    zero_rtt                = "on"
    
    # Email
    email_obfuscation       = "on"
  }
}

# Outputs
output "dns_records_summary" {
  description = "Résumé des enregistrements DNS créés"
  value = {
    proxied_subdomains = keys(local.proxied_subdomains)
    dns_only_subdomains = keys(local.dns_only_subdomains)
    total_records = length(local.proxied_subdomains) + length(local.dns_only_subdomains) + 8  # +8 pour A, MX, TXT, CAA
  }
}

output "next_steps" {
  description = "Prochaines étapes après déploiement"
  value = [
    "1. Activer DNSSEC via le dashboard Cloudflare",
    "2. Vérifier la propagation DNS (24-48h)",
    "3. Tester les certificats SSL sur tous les sous-domaines",
    "4. Configurer les alertes de monitoring",
    "5. Valider les endpoints applicatifs",
    "6. Effectuer les tests de performance"
  ]
}

output "monitoring_endpoints" {
  description = "Endpoints à surveiller"
  value = {
    main_site    = "https://${var.domain}"
    api          = "https://api.${var.domain}/health"
    app          = "https://app.${var.domain}"
    health_check = "https://health.${var.domain}"
  }
}