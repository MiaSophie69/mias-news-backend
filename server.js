const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '1b181f266b46431798019925168150a5';

app.get('/api/live-news', async (req, res) => {
    try {
        const url = `https://newsapi.org/v2/everything?q=nachrichten&language=de&sortBy=publishedAt&apiKey=${API_KEY}`;
        const apiAntwort = await fetch(url);
        const daten = await apiAntwort.json();
        res.json(daten);
    } catch (fehler) {
        console.error("Es gab ein Problem:", fehler);
        res.status(500).json({ fehler: "Nachrichten konnten nicht geladen werden." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Mias News-Backend laeuft auf Port ${PORT}!`);
});
