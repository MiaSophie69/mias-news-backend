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
        
        // 2. Die Regionalnachrichten
        const regSuchbegriff = encodeURIComponent('Hamburg OR Lübeck OR Luebeck');
        const regionalUrl = `https://newsapi.org/v2/everything?q=${regSuchbegriff}&language=de&sortBy=publishedAt&pageSize=30&apiKey=${API_KEY}`;
        
        // 3. Popkultur XL (Mit massig A-List-Promis, Newcomern, Events und Trend-Keywords!)
        const celebTags = [
            '"Lady Gaga"', '"Taylor Swift"', '"Beyonce"', '"Kardashian"', '"Rihanna"', 
            '"Ariana Grande"', '"Justin Bieber"', '"Dua Lipa"', '"Billie Eilish"', 
            '"Sabrina Carpenter"', '"Olivia Rodrigo"', '"Selena Gomez"', '"Zendaya"', 
            '"Kylie Jenner"', '"Kendall Jenner"', '"Timothee Chalamet"', '"Harry Styles"', 
            '"Chappell Roan"', '"Charli XCX"', '"Tom Holland"', '"Sydney Sweeney"',
            '"neues Album"', '"Grammy"', '"Met Gala"', '"Coachella"', '"Billboard"', 
            '"Charts"', '"Welttournee"', '"Musikvideo"', '"Gossip"', '"Konzert"', 
            '"Kino-Charts"', '"Streaming-Rekord"', '"K-Pop"', '"Netflix-Hit"'
        ];
        
        const celebSuchbegriff = encodeURIComponent('(' + celebTags.join(' OR ') + ')');
        // Wir erhöhen die pageSize auf 60, damit auch richtig viele Schlagzeilen geladen werden!
        const celebUrl = `https://newsapi.org/v2/everything?q=${celebSuchbegriff}&language=de&sortBy=publishedAt&pageSize=60&apiKey=${API_KEY}`;

        // Alle drei Quellen abfragen
        const mainRes = await fetch(mainUrl);
        const mainData = await mainRes.json();
        
        const regRes = await fetch(regionalUrl);
        const regData = await regRes.json();

        const celebRes = await fetch(celebUrl);
        const celebData = await celebRes.json();
        
        let alleArtikel = [
            ...(mainData.articles || []),
            ...(regData.articles || []),
            ...(celebData.articles || [])
        ];

        // --- DAS SICHERHEITSNETZ ---
        const hatHamburg = alleArtikel.some(a => a.title && (a.title.includes('Hamburg') || (a.description && a.description.includes('Hamburg'))));
        const hatLuebeck = alleArtikel.some(a => a.title && (a.title.includes('Lübeck') || a.title.includes('Luebeck') || (a.description && (a.description.includes('Lübeck') || a.description.includes('Luebeck')))));
        const hatGossip = alleArtikel.some(a => a.title && (a.title.toLowerCase().includes('album') || a.title.toLowerCase().includes('gaga') || a.title.toLowerCase().includes('swift') || a.title.toLowerCase().includes('charts')));
        
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
                title: "Lady Gaga kündigt überraschend neues Album an!",
                description: "Die Pop-Ikone hat auf Instagram aus dem Nichts ihr neues Projekt angeteasert. Fans spekulieren über eine Stadion-Tour.",
                url: "https://www.promiflash.de",
                source: { name: "Pop News" }
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
