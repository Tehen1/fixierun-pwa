# Configuration DNS Terraform pour fixie.run

## 🎯 Vue d'ensemble

Infrastructure as Code (IaC) pour la configuration DNS optimale de fixie.run utilisant Terraform et le provider Cloudflare.

## 📋 Prérequis

### Outils requis
```bash
# Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# Vérification
terraform --version
```

### Credentials Cloudflare

1. **Token API Cloudflare**
   - Aller sur: https://dash.cloudflare.com/profile/api-tokens
   - Créer un token personnalisé avec les permissions:
     - Zone: `Zone:Read`
     - DNS: `DNS:Edit`
   - Ressources: `Include - Zone - fixie.run`

2. **Zone ID**
   - Aller sur: https://dash.cloudflare.com
   - Sélectionner le domaine `fixie.run`
   - Copier le Zone ID dans la sidebar droite

## 🚀 Déploiement

### 1. Configuration initiale
```bash
# Cloner la configuration
cd cloudflare-terraform

# Copier et configurer les variables
cp terraform.tfvars.example terraform.tfvars
# Éditer terraform.tfvars avec vos credentials
```

### 2. Initialisation Terraform
```bash
# Initialiser Terraform
terraform init

# Vérifier la configuration
terraform validate

# Planifier les changements
terraform plan
```

### 3. Déploiement
```bash
# Appliquer la configuration
terraform apply

# Confirmer avec 'yes' quand demandé
```

## 📊 Configuration déployée

### Enregistrements créés

#### 🔒 Proxifiés (Cloudflare CDN + WAF)
- `www.fixie.run` → Performance et sécurité
- `mobile.fixie.run` → Applications mobiles
- `app.fixie.run` → Application principale
- `admin.fixie.run` → Interface d'administration
- `docs.fixie.run` → Documentation
- `api.fixie.run` → API backend
- `ws.fixie.run` → WebSocket temps réel
- `contracts.fixie.run` → Smart contracts (protection MEV)
- `health.fixie.run` → Monitoring
- `cdn.fixie.run` → Assets statiques

#### 🌐 DNS Only (Accès direct)
- `login.fixie.run` → Auth0 (requis)
- `ipfs.fixie.run` → Gateway IPFS direct
- `analytics.fixie.run` → Métriques blockchain

#### 📧 Email & Sécurité
- Enregistrements MX (ForwardEmail)
- SPF, DMARC (protection anti-spoofing)
- CAA Records (autorisation SSL Let's Encrypt)

### Paramètres de zone optimisés
- SSL/TLS: Strict
- TLS minimum: 1.2
- HTTP/2 et HTTP/3 activés
- Compression Brotli
- Minification automatique
- Cache optimisé pour Web3

## 🔧 Gestion

### Mise à jour de la configuration
```bash
# Modifier main.tf selon les besoins
# Planifier les changements
terraform plan

# Appliquer les modifications
terraform apply
```

### Suppression (⚠️ Attention)
```bash
# Supprimer toute la configuration DNS
terraform destroy
```

### État Terraform
```bash
# Voir l'état actuel
terraform show

# Lister les ressources
terraform state list

# Importer une ressource existante
terraform import cloudflare_record.example <zone_id>/<record_id>
```

## 📈 Monitoring

### Validation post-déploiement
```bash
# Utiliser le script de validation
../dns-validation-tests.sh all

# Tests spécifiques
../dns-validation-tests.sh dns
../dns-validation-tests.sh ssl
../dns-validation-tests.sh security
```

### Endpoints à surveiller
- **Site principal**: https://fixie.run
- **API Health**: https://api.fixie.run/health
- **Application**: https://app.fixie.run
- **Monitoring**: https://health.fixie.run

## 🛡️ Sécurité

### Actions manuelles requises
1. **Activer DNSSEC**
   - Dashboard Cloudflare → DNS → DNSSEC → Enable
   - Ajouter l'enregistrement DS chez le registraire

2. **Vérifier les certificats SSL**
   - Tester sur: https://www.ssllabs.com/ssltest/

3. **Configurer les alertes**
   - Temps de réponse DNS
   - Disponibilité des endpoints
   - Expiration des certificats

### Bonnes pratiques
- ✅ Token API avec permissions minimales
- ✅ Fichier `terraform.tfvars` dans `.gitignore`
- ✅ État Terraform sécurisé (remote backend recommandé)
- ✅ Backup régulier de la configuration

## 🔍 Troubleshooting

### Erreurs communes

#### Token API invalide
```
Error: Invalid request headers (6003)
```
**Solution**: Vérifier le token API et ses permissions

#### Zone ID incorrect
```
Error: Zone not found (1001)
```
**Solution**: Vérifier le Zone ID dans terraform.tfvars

#### Enregistrement existant
```
Error: Record already exists (81057)
```
**Solution**: Importer l'enregistrement existant ou le supprimer manuellement

### Debug
```bash
# Logs détaillés
export TF_LOG=DEBUG
terraform apply

# Vérifier la configuration Cloudflare
curl -X GET "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/dns_records" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## 📚 Ressources

- [Documentation Terraform Cloudflare](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [API Cloudflare](https://api.cloudflare.com/)
- [Meilleures pratiques DNS](https://developers.cloudflare.com/dns/manage-dns-records/best-practices/)
- [Guide DNSSEC](https://developers.cloudflare.com/dns/dnssec/)

---

**Configuration optimisée pour une architecture Web3/DeFi moderne et sécurisée**