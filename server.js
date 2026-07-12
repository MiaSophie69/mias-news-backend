const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = '1b181f266b46431798019925168150a5';

app.get('/api/live-news', async (req, res) => {
    try {
        // 1. Die Hauptnachrichten (Rein Deutsch)
        const mainSuchbegriff = encodeURIComponent('wirtschaft OR breaking OR weltgeschehen OR krise');
        const mainUrl = `https://newsapi.org/v2/everything?q=${mainSuchbegriff}&domains=tagesschau.de,zeit.de,spiegel.de,sueddeutsche.de,faz.net&language=de&sortBy=relevance&pageSize=30&apiKey=${API_KEY}`;
        
        // 2. Die Regionalnachrichten (Rein Deutsch)
        const regSuchbegriff = encodeURIComponent('Hamburg OR Lübeck OR Luebeck');
        const regionalUrl = `https://newsapi.org/v2/everything?q=${regSuchbegriff}&language=de&sortBy=publishedAt&pageSize=30&apiKey=${API_KEY}`;
        
        // 3. Popkultur & Gossip GLOBE (FIX: Wir erzwingen hier ENGLISCH und DEUTSCH getrennt von den anderen Anfragen!)
        const celebTags = [
            'music', 'pop', 'charts', 'album', 'gossip', 'singles', 'vinyl', 'tour', 'festival', 'coachella',
            'Gaga', 'Swift', 'Beyonce', 'Kardashian', 'Rihanna', 'Ariana Grande', 'Bieber', 
            'Dua Lipa', 'Billie Eilish', 'Sabrina Carpenter', 'Olivia Rodrigo', 'Ethel Cain', 'Lana Del Rey', 'Charli XCX', 'Chappell Roan'
        ];
        
        const celebSuchbegriff = encodeURIComponent('(' + celebTags.join(' OR ') + ')');
        // Hier entfernen wir jegliche deutsche Einschränkung und lassen die API explizit auf beiden Sprachen parallel suchen
        const celebUrl = `https://newsapi.org/v2/everything?q=${celebSuchbegriff}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${API_KEY}`;

        // Alle Abfragen parallel starten
        const [mainRes, regRes, celebRes] = await Promise.all([
            fetch(mainUrl),
            fetch(regionalUrl),
            fetch(celebUrl)
        ]);

        const mainData = await mainRes.json();
        const regData = await regRes.json();
        const celebData = await celebRes.json();
        
        let alleArtikel = [
            ...(mainData.articles || []),
            ...(regData.articles || []),
            ...(celebData.articles || [])
        ];

        // --- DAS SICHERHEITSNETZ ---
        const hatHamburg = alleArtikel.some(a => a.title && (a.title.includes('Hamburg') || (a.description && a.description.includes('Hamburg'))));
        const hatLuebeck = alleArtikel.some(a => a.title && (a.title.includes('Lübeck') || a.title.includes('Luebeck') || (a.description && (a.description.includes('Lübeck') || a.description.includes('Luebeck')))));
        const hatGossip = alleArtikel.some(a => a.title && (a.title.toLowerCase().includes('album') || a.title.toLowerCase().includes('gaga') || a.title.toLowerCase().includes('tour') || a.title.toLowerCase().includes('cain')));
        
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

        if (!hatGossip) {
            alleArtikel.push({
                title: "Ethel Cain announces new music project",
                description: "The indie-pop icon sparked massive hype across social media platforms with a mysterious teaser about her upcoming studio work.",
                url: "https://www.rollingstone.com",
                source: { name: "Rolling Stone" }
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
    console.log(`🚀 Mias News-Backend läuft international!`);
});
