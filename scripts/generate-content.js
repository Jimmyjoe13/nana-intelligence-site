// scripts/generate-content.js
require('dotenv').config({ path: './scripts/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 🔐 Configuration (à modifier si besoin)
const API_URL = 'https://api.mistral.ai/v1/chat/completions';
const API_KEY = process.env.MISTRAL_API_KEY; // ✅ Clé fournie

// 📝 Prompt maître - Accroche homepage (optimisé conversion + SEO)
const PROMPT = `
Tu es un expert en growth hacking et automatisation IA, spécialisé dans la création d'agents IA autonomes pour les startups tech.
Rédige une accroche de page d'accueil (80-120 mots) optimisée SEO pour le mot-clé principal : "agent IA prospection".
Objectif : convertir le visiteur en cliquant sur "Voir la démo".
Tonalité : direct, percutant, orienté résultat. Phrases courtes. Style vendeur mais crédible.
Structure :
1. Accroche forte avec douleur concrète
2. Solution technique (n8n, Make, gpt-oss)
3. Résultat attendu (ex: +100 leads/mois, -20h de travail)
4. CTA clair : "Voir la démo →"
Ne pas utiliser de métaphores vides ou de phrases du type "notre mission est...".
`;

// 🚀 Paramètres d'inférence
const payload = {
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: PROMPT }],
  max_tokens: 200,
  temperature: 0.7,
  top_p: 0.9,
  stop: ["Structure :", "Prompt :", "Utilisateur :"],
};

// 🧠 Fonction principale
async function generateContent() {
  try {
    console.log('🚀 Appel en cours à ton endpoint MistralAI...');

    const response = await axios.post(
      API_URL,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText = response.data.choices[0].message.content.trim();

    // 🔍 Nettoyage : on supprime les parties du prompt si elles réapparaissent
    let cleaned = generatedText;
    if (cleaned.includes('Structure :')) {
      cleaned = cleaned.split('Structure :')[0].trim();
    }

    // 📥 Sauvegarde dans /generated
    const outputPath = path.join(__dirname, '..', 'generated', 'hero-section.txt');
    fs.writeFileSync(outputPath, cleaned, 'utf-8');

    console.log('✅ Succès : contenu généré et sauvegardé dans /generated/hero-section.txt');
    console.log('\n--- CONTENU GÉNÉRÉ ---\n');
    console.log(cleaned);
    console.log('\n------------------------\n');

  } catch (error) {
    if (error.response) {
      console.error('❌ Erreur API:', error.response.status, error.response.data);
      if (error.response.data.error) {
        console.error('Message:', error.response.data.error);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('❌ Timeout : l’endpoint a mis trop de temps à répondre.');
    } else {
      console.error('❌ Erreur réseau ou configuration:', error.message);
    }
  }
}

// Exécution
generateContent();
