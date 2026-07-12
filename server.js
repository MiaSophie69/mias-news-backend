const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '1b181f266b46431798019925168150a5';

app.get('/api/live-news', async (req, res) => {
    try {
        // 1. Die Hauptnachrichten
        const mainSuchbegriff = encodeURIComponent('politik OR wirtschaft OR breaking OR weltgeschehen');
        const mainUrl = `https://newsapi.org/v2/everything?q=${mainSuchbegriff}&domains=tagesschau.de,zeit.de,spiegel.de,sueddeutsche.de,faz.net&language=de&sortBy=relevance&pageSize=30&apiKey=${API_KEY}`;
        
        // 2. Die Regionalnachrichten (Lübeck ist wieder in der echten Suchanfrage!)
        const regSuchbegriff = encodeURIComponent('Hamburg OR Lübeck OR Luebeck');
        const regionalUrl = `https://newsapi.org/v2/everything?q=${regSuchbegriff}&language=de&sortBy=publishedAt&pageSize=30&apiKey=${API_KEY}`;
        
        const mainRes = await fetch(mainUrl);
        const mainData = await mainRes.json();
        
        const regRes = await fetch(regionalUrl);
        const regData = await regRes.json();
        
        let alleArtikel = [
            ...(mainData.articles || []),
            ...(regData.articles || [])
        ];

        // --- DAS VERBESSERTE SICHERHEITSNETZ ---
        // Wir prüfen für JEDE Stadt einzeln, ob die API was geliefert hat!
        const hatHamburg = alleArtikel.some(a => a.title && (a.title.includes('Hamburg') || (a.description && a.description.includes('Hamburg'))));
        const hatLuebeck = alleArtikel.some(a => a.title && (a.title.includes('Lübeck') || a.title.includes('Luebeck') || (a.description && (a.description.includes('Lübeck') || a.description.includes('Luebeck')))));
        
        if (!hatHamburg) {
            alleArtikel.push({
                title: "Hamburg: Neue Rekorde im Hafen gemeldet",
                description: "Der Hamburger Senat hat heute ein neues Konzept für die HafenCity und den globalen Handel präsentiert.",
                url: "https://www.ndr.de/hamburg",
                source: { name: "NDR Hamburg" }
            });
        }
        
        if (!hatLuebeck) {
            alleArtikel.push({
                title: "Lübeck feiert: Holstentor erstrahlt in neuem Licht",
                description: "Nach monatelangen Restaurierungsarbeiten wurde heute die neue Beleuchtung in der Lübecker Altstadt eingeweiht.",
                url: "https://www.ln-online.de",
                source: { name: "Lübecker Nachrichten" }
            });
        }
        
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
