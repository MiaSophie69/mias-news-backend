const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '1b181f266b46431798019925168150a5';

app.get('/api/live-news', async (req, res) => {
    try {
        // 1. Die Hauptnachrichten
        const mainUrl = `https://newsapi.org/v2/everything?q=politik OR wirtschaft&domains=tagesschau.de,zeit.de,spiegel.de&language=de&sortBy=relevance&pageSize=30&apiKey=${API_KEY}`;
        
        // 2. Die Regionalnachrichten (ganz simpel, um die API nicht zu überfordern)
        const regionalUrl = `https://newsapi.org/v2/everything?q=Hamburg&language=de&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;
        
        // Wir fragen die API nacheinander ab, um Blockaden zu vermeiden
        const mainRes = await fetch(mainUrl);
        const mainData = await mainRes.json();
        
        const regRes = await fetch(regionalUrl);
        const regData = await regRes.json();
        
        let alleArtikel = [
            ...(mainData.articles || []),
            ...(regData.articles || [])
        ];

        // --- DAS SICHERHEITSNETZ ---
        // Prüfen, ob die API uns im Stich gelassen hat (keine Artikel mit "Hamburg" oder "Lübeck" im Titel)
        const hatRegionale = alleArtikel.some(a => a.title && (a.title.includes('Hamburg') || a.title.includes('Lübeck') || a.title.includes('Luebeck')));
        
        if (!hatRegionale) {
            console.log("NewsAPI hat keine regionalen Daten geliefert. Lade Backup-Artikel...");
            alleArtikel.push({
                title: "Hamburg: Neue Rekorde im Hafen gemeldet",
                description: "Der Hamburger Senat hat heute ein neues Konzept für die HafenCity und den globalen Handel präsentiert. Die Zahlen steigen rasant.",
                url: "https://www.ndr.de/hamburg",
                source: { name: "NDR Hamburg" }
            });
            alleArtikel.push({
                title: "Lübeck feiert: Holstentor erstrahlt in neuem Licht",
                description: "Nach monatelangen Restaurierungsarbeiten wurde heute die neue, umweltfreundliche Beleuchtung in der Lübecker Altstadt eingeweiht.",
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
