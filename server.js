const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '1b181f266b46431798019925168150a5';

app.get('/api/live-news', async (req, res) => {
    try {
        // 1. Wichtige Hauptnachrichten (nach Relevanz sortiert für höhere Qualität)
        const mainUrl = `https://newsapi.org/v2/everything?q=(politik OR wirtschaft OR weltgeschehen OR breaking)&language=de&sortBy=relevance&pageSize=40&apiKey=${API_KEY}`;
        
        // 2. Regionale Nachrichten für Hamburg und Lübeck
        const regionalUrl = `https://newsapi.org/v2/everything?q=(Hamburg OR L&uuml;beck)&language=de&sortBy=publishedAt&pageSize=40&apiKey=${API_KEY}`;
        
        // Beide Anfragen gleichzeitig starten
        const [mainRes, regRes] = await Promise.all([fetch(mainUrl), fetch(regionalUrl)]);
        const mainData = await mainRes.json();
        const regData = await regRes.json();
        
        // Ergebnisse zusammenführen
        const alleArtikel = [
            ...(mainData.articles || []),
            ...(regData.articles || [])
        ];
        
        res.json({ articles: alleArtikel });
    } catch (fehler) {
        console.error("Es gab ein Problem:", fehler);
        res.status(500).json({ fehler: "Nachrichten konnten nicht geladen werden." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Mias News-Backend laeuft auf Port ${PORT}!`);
});
