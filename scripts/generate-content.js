// scripts/generate-content.js
require('dotenv').config({ path: './scripts/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 🔐 Configuration (à modifier si besoin)
const API_URL = 'https://api.mistral.ai/v1/chat/completions';
const API_KEY = process.env.MISTRAL_API_KEY; // ✅ Clé fournie

// 📝 Prompt maître - Article de blog (optimisé conversion + SEO)
const BLOG_PROMPT = `
Tu es un expert en growth hacking et automatisation IA.
Rédige un article de blog de 600-800 mots, optimisé SEO, pour le mot-clé : "n8n workflow prospection".
Structure :
- Titre accrocheur
- Introduction avec douleur concrète
- Problème : pourquoi la prospection manuelle échoue
- Solution : comment un agent IA (n8n + Make + gpt-oss) peut automatiser tout le funnel
- Étapes de mise en place (workflow simple)
- Résultats attendus (leads, temps gagné, taux de réponse)
- Conclusion + CTA : "Voir la démo d’un agent IA en action"
Tonalité : direct, technique mais accessible. Phrases courtes. Style vendeur.
Ne pas utiliser de "notre mission", "nous sommes", "dans cet article".
`;

// 🚀 Paramètres d'inférence
const payload = {
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: BLOG_PROMPT }],
  max_tokens: 1000,
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
    const outputPath = path.join(__dirname, '..', 'generated', 'blog-2-n8n workflow prospection.txt');
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
