# Nikolay Semin
# Digital Diploma — Project Draft
# 20/02/2026

## 1) Nom du projet
**dDp - Digital Diploma — Vérification décentralisée des diplômes via Blockchain**

---

## 2) Contexte et problème

La vérification des diplômes reste lente, manuelle et vulnérable à la fraude (PDF modifiés, faux certificats, délais administratifs).

### Problèmes concrets
- falsification documentaire;
- vérification inter-établissements trop lente;
- dépendance aux horaires/équipes administratives;
- absence de standard de preuve technique, vérifiable rapidement.

### Impact métier
- perte de confiance (recruteur, école, candidat);
- coûts administratifs élevés;
- délais de recrutement et de mobilité internationale.

---

## 3) Objectif du projet

### Objectif principal
Créer un **MVP (Minimum Viable Product)** qui permet:
1. d’émettre un diplôme numérique sous forme de **NFT** (support du diplôme on-chain),
2. de vérifier son authenticité en quelques secondes,
3. de tracer la preuve sur blockchain (testnet).

### Utilisateur cible (MVP)
- **RH / recruteur** qui vérifie un diplôme en moins de 30 secondes.

### Proposition de valeur
Passer d’une validation « confiance + email + attente » à une validation « preuve technique + immédiate ».

### Extension usage (automatisation)
À moyen terme, le projet peut évoluer vers une **API de vérification automatique** (Diploma Verification API) pour intégrer le contrôle des diplômes directement dans les systèmes RH/ATS/ERP.

---

## 4) Livrable du jour

Un document projet structuré + un état d’avancement concret:

- scope du projet;
- architecture claire;
- statut du MVP;
- plan d’action court terme;
- critères de validation (Definition of Done).

---

## 5) Architecture (version MVP)

### A. Business logic
- émission d’un diplôme sous forme de NFT (Issue);
- vérification de validité (Verify);
- contrôle du rôle émetteur (issuer).

### B. Infrastructure
- frontend web (JS);
- smart contract (Solidity);
- réseau testnet EVM-compatible;
- wallet Web3 pour signer les transactions.

### C. Data
- tokenId NFT (identifiant on-chain du diplôme);
- identifiant diplôme;
- hash du diplôme (preuve);
- métadonnées minimales (émetteur, date, statut);
- Stockage hors chaîne (IPFS) prévu en phase 2 pour conserver les documents lourds, avec ancrage on-chain via hash/CID.

### D. Tests
- tests fonctionnels Issue;
- tests fonctionnels Verify;
- tests d’accès (issuer/non-issuer);
- tests de cohérence des données.

### E. Documentation
- README (installation + run + test);
- guide utilisateur (Issue/Verify);
- captures d’écran du MVP;
- limitations connues + next steps.

---

## 6) Sécurité (minimum viable security)

Checklist sécurité à appliquer:
- contrôle d’accès strict sur le mint;
- validation des entrées (format, champs obligatoires);
- événements on-chain pour traçabilité;
- gestion d’erreur explicite;
- stratégie de gel/pause (si ajoutée en v2).

---

## 7) État actuel (Status report)

### Présentation du programme
Ce programme est une application Web3 de vérification de diplômes numériques.  
Elle est développée en **Next.js/TypeScript** (frontend) avec un **smart contract Solidity** sur réseau EVM-compatible.  
Le fonctionnement est simple : un établissement autorisé émet un diplôme sous forme de **NFT**, puis un recruteur (ou un tiers autorisé) peut vérifier son authenticité via l’interface **Verify** (lecture des données on-chain et comparaison des preuves/hash).  
L’objectif est de réduire la fraude documentaire, accélérer les contrôles et automatiser la vérification des diplômes.

### Done
- page Home prête;
- nouveau smart contract **DiplomaNFT** créé (issue / verify / revoke / RBAC issuer);
- module de déploiement Ignition ajouté (`ignition/modules/DiplomaNFT.ts`);
- flux **Issue** connecté au contrat (wallet, validation, tx hash, tokenId, hash document);
- flux **Verify** connecté au contrat (statuts: valid / not found / invalid / error);
- README frontend mis à jour (setup, env, déploiement, démo);
- migration Node.js effectuée sur la machine (**Node 22.22.0 / npm 10.9.4**), compatible Hardhat 3;
- Hardhat relancé avec succès (compilation OK + déploiement Ignition local de `DiplomaNFT`);
- avertissement Next.js sur le root workspace corrigé (`turbopack.root` ajouté dans `next.config.ts`);
- lint + build frontend validés;
- `npm run dev` opérationnel (app prête sur `http://localhost:3000`).

### In progress
- déploiement effectif du contrat sur testnet cible;
- configuration `.env.local` avec l’adresse réellement déployée;
- tests manuels E2E sur 3 scénarios DoD (issue→verify, not found, hash mismatch);
- captures d’écran finales pour soutenance.

### Blockers
- pas de blocker technique critique côté environnement local (Node/Hardhat/UI OK);
- dépendance externe restante: disposer d’un déploiement testnet final et d’une adresse contrat stable pour la démo.

### Next immediate actions (48h)
1. déployer `DiplomaNFT` sur le testnet cible (ex: Sepolia) avec le wallet projet;
2. renseigner l’adresse déployée dans `.env.local` du frontend (`NEXT_PUBLIC_DIPLOMA_CONTRACT_ADDRESS`);
3. exécuter et documenter 3 scénarios de test (happy path, not found, hash mismatch);
4. finaliser captures + script de démo 3 minutes.

---

## 8) Definition of Done (MVP)

Le MVP est considéré « prêt » si:
- [ ] Issue mint fonctionne sur testnet;
- [x] Verify retourne un résultat clair (valid / not found / invalid / error);
- [ ] 3 tests minimum passent (happy path + edge cases);
- [x] README permet de relancer le projet sans aide;
- [ ] démo de 3 minutes réalisable sans erreur bloquante.

---

## 9) Roadmap

### Court terme (formation, 1–2 semaines)
- finaliser Verify;
- stabiliser l’intégration Web3;
- livrer MVP démontrable.

### Moyen terme (stage, 1–2 mois)
- ajout IPFS;
- amélioration UX;
- tests automatisés;
- pré-audit sécurité.
- prototype API de vérification automatique.

### Long terme (vision)
- multi-établissements;
- standard de credentials interopérable;
- extension B2B (écoles/recruteurs).

---

## 10) Ce qu’il faut encore penser (fond du projet)

1. **Modèle de confiance** : qui a le droit d’émettre ? comment révoquer ?
2. **Cadre légal** : quelles données laisser on-chain vs off-chain ?
3. **Adoption** : quel acteur paie la solution (école, recruteur, candidat) ?
4. **Scalabilité** : coût transactionnel et volumétrie à grande échelle.
5. **Monétisation API** : modèle SaaS (abonnement / volume d’appels) pour la vérification automatique des diplômes.

### Piste business concrète
- créer une offre **Verification API as a Service**;
- proposer des plans tarifaires (free, pro, enterprise);
- fournir dashboard, logs et score de confiance;
- intégrer webhooks pour automatiser les workflows RH.

---

## 11) Résumé exécutif (5 lignes)

Ce projet propose un MVP de vérification de diplômes via blockchain, orienté usage réel RH.  
L’intérêt est de réduire fraude et délais avec une preuve technique vérifiable rapidement.  
Le frontend est désormais connecté au smart contract pour les flux Issue et Verify.  
Le blocage environnement a été levé (Node 22 + Hardhat + build/dev OK) et le projet est de nouveau exécutable localement.  
La priorité immédiate est désormais le déploiement testnet final puis la validation des 3 tests DoD.  
Le document est aligné avec l’état réel d’avancement et prêt pour une présentation pédagogique.

---

## 12) Security Threat Model & Audit Plan

### Menaces principales
- falsification de diplôme (metadata fraud);
- mint non autorisé (compromission issuer);
- modification/replay d’une preuve;
- vulnérabilités smart contract (access control, validation, logique métier);
- compromission frontend/API.

### Mesures de protection
- RBAC strict (issuer only);
- hash + vérification d’intégrité;
- logs d’événements on-chain;
- validation forte des inputs;
- séparation on-chain/off-chain des données sensibles.

### Plan de test sécurité
- test d’accès non autorisé;
- test de falsification de métadonnées;
- test de cohérence Verify;
- test de robustesse des erreurs;
- test de régression après correctifs.

### Audit du projet
- **Audit interne (pré-MVP)**: checklist sécurité + tests manuels;
- **Audit technique (post-MVP)**: outils (Slither/Mythril) + revue manuelle;
- **Audit final (pré-production)**: rapport de risques (Critical/High/Medium/Low) + plan de remédiation.

### Incident response (mini-plan)
1. détection incident;
2. freeze temporaire des fonctions sensibles;
3. analyse cause racine;
4. patch + test + reprise contrôlée;
5. communication transparente.

---

## 13) AI Integration (Phase 2)

### Pourquoi ajouter l’IA
L’IA ne remplace pas la preuve blockchain, mais elle peut améliorer l’exploitation opérationnelle:
- détection proactive de comportements suspects;
- priorisation des vérifications à risque;
- automatisation d’alertes pour les équipes RH/compliance.

### Cas d’usage IA (concrets)
1. **Risk Scoring de vérification**
   - score de confiance calculé à partir de signaux (fréquence des vérifications, incohérences de métadonnées, patterns anormaux).
2. **Détection d’anomalies**
   - identification de pics inhabituels (replays, vérifications massives sur une même identité, séquences suspectes).
3. **Classification des incidents**
   - catégorisation automatique des événements sécurité pour accélérer l’analyse et la remédiation.

### Architecture cible (IA + Web3)
- **On-chain**: source de vérité (NFT, hash, événements).
- **Off-chain analytics**: pipeline de logs (indexer + base analytique).
- **Service IA**: moteur de scoring/anomaly detection (API interne).
- **Frontend/API**: affichage du score, des alertes et des recommandations d’action.

### Données et conformité
- ne pas stocker de données personnelles sensibles on-chain;
- pseudonymisation/anonymisation côté analytics;
- journalisation des décisions automatiques (auditabilité);
- revue humaine pour les décisions critiques (human-in-the-loop).

### KPI de succès IA
- réduction du temps moyen de tri des vérifications suspectes;
- taux de détection des anomalies pertinentes;
- baisse des faux positifs après itérations modèle;
- amélioration du temps de réponse incident.

### Plan d’implémentation (progressif)
- **Étape 1**: règles heuristiques simples + dashboard alertes;
- **Étape 2**: modèle baseline de détection d’anomalies;
- **Étape 3**: calibration continue + monitoring MLOps léger;
- **Étape 4**: exposition d’un endpoint “trust score” dans la Verification API.
