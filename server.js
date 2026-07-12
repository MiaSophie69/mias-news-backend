const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '1b181f266b46431798019925168150a5';

app.get('/api/live-news', async (req, res) => {
    try {
        // 1. Wichtige Hauptnachrichten (sauber übersetzt)
        const mainSuchbegriff = encodeURIComponent('politik OR wirtschaft OR weltgeschehen OR breaking');
        const mainUrl = `https://newsapi.org/v2/everything?q=${mainSuchbegriff}&language=de&sortBy=relevance&pageSize=40&apiKey=${API_KEY}`;
        
        // 2. Regionale Nachrichten (jetzt versteht die API auch Lübeck!)
        const regSuchbegriff = encodeURIComponent('Hamburg OR Lübeck');
        const regionalUrl = `https://newsapi.org/v2/everything?q=${regSuchbegriff}&language=de&sortBy=publishedAt&pageSize=40&apiKey=${API_KEY}`;
        
        const [mainRes, regRes] = await Promise.all([fetch(mainUrl), fetch(regionalUrl)]);
        const mainData = await mainRes.json();
        const regData = await regRes.json();
        
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
