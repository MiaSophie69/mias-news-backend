const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Dein NewsAPI-Schlüssel
const API_KEY = '1b181f266b46431798019925168150a5';

app.get('/api/live-news', async (req, res) => {
    try {
        // 1. Der Premium-Filter für Hauptnachrichten
        const mainSuchbegriff = encodeURIComponent('politik OR wirtschaft OR breaking OR weltgeschehen');
        const premiumQuellen = 'tagesschau.de,zeit.de,spiegel.de,sueddeutsche.de,faz.net';
        const mainUrl = `https://newsapi.org/v2/everything?q=${mainSuchbegriff}&domains=${premiumQuellen}&language=de&sortBy=relevance&pageSize=30&apiKey=${API_KEY}`;
        
        // 2. Regionale Nachrichten (FIX: qInTitle zwingt die API, das Wort in der Überschrift zu haben!)
        const regSuchbegriff = encodeURIComponent('Hamburg OR Lübeck OR Luebeck');
        const regionalUrl = `https://newsapi.org/v2/everything?qInTitle=${regSuchbegriff}&language=de&sortBy=publishedAt&pageSize=30&apiKey=${API_KEY}`;
        
        // Server fragt beide Quellen gleichzeitig ab
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
