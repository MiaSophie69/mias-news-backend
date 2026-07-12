<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Mias News</title>
    
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Mias News">
    <link rel="apple-touch-icon" href="logo.png?v=2">

    <style>
        :root {
            --bg-main: #f7f7f8;
            --bg-card: #ffffff;
            --text-main: #1a1a1a;
            --text-muted: #8e8e93;
            --text-sub: #555555;
            --border: rgba(0,0,0,0.08);
            --accent: #ff2d55;
            --badge-pop: #fbdce3;
            --badge-welt: #d1e2ef;
            --badge-tech: #d6ede0;
            --badge-reg: #ffeaa7;
            --shadow: 0 4px 12px rgba(0,0,0,0.03);
            --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-main: #121214;
                --bg-card: #1c1c1e;
                --text-main: #f5f5f7;
                --text-muted: #98989d;
                --text-sub: #cccccc;
                --border: rgba(255,255,255,0.1);
                --badge-pop: #3a1e25;
                --badge-welt: #1a2b3c;
                --badge-tech: #132d20;
                --badge-reg: #3c3214;
                --shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-tap-highlight-color: transparent; }
        body { background-color: var(--bg-main); color: var(--text-main); padding: 16px; padding-bottom: 40px; transition: var(--transition); overflow-x: hidden; }
        
        #ptr-indicator { text-align: center; height: 0; overflow: hidden; font-size: 13px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: height 0.2s ease; font-weight: 500; }
        
        header { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; margin-bottom: 15px; }
        h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        
        .heart-btn { background: var(--bg-card); border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; box-shadow: var(--shadow); color: var(--text-muted); transition: var(--transition); border: 1px solid var(--border); }
        .heart-btn.active { color: var(--accent); transform: scale(1.05); }
        .heart-btn:active { transform: scale(0.9); }
        
        .back-btn { width: 100%; background: var(--border); border: none; padding: 12px; border-radius: 14px; font-weight: 600; font-size: 14px; margin-top: 10px; display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-main); }

        .search-container { background: var(--bg-card); border: 1px solid var(--border); padding: 10px 14px; border-radius: 14px; display: flex; align-items: center; gap: 10px; margin-top: 5px; box-shadow: var(--shadow); }
        .search-container input { border: none; width: 100%; font-size: 15px; outline: none; background: transparent; color: var(--text-main); }
        
        .categories { display: flex; gap: 8px; overflow-x: auto; padding: 12px 0 6px 0; white-space: nowrap; -webkit-overflow-scrolling: touch; }
        .categories::-webkit-scrollbar { display: none; }
        .cat-btn { background: var(--border); border: none; padding: 8px 14px; border-radius: 18px; font-size: 13px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: var(--transition); }
        .cat-btn.active { background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); box-shadow: var(--shadow); }
        
        .sub-categories { display: none; gap: 6px; padding: 4px 0 10px 0; overflow-x: auto; }
        .sub-cat-btn { background: transparent; border: 1px solid var(--border); padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; color: var(--text-muted); cursor: pointer; }
        .sub-cat-btn.active { background: var(--accent); color: white; border-color: var(--accent); }

        .news-list { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .card { background: var(--bg-card); border-radius: 16px; padding: 14px 16px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 8px; position: relative; border: 1px solid var(--border); transition: var(--transition); }
        .card.breaking-card { border: 1.5px solid var(--accent); }
        
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .badge { font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--text-main); }
        .breaking-badge { background-color: var(--accent); color: white; }
        
        .popkultur { background-color: var(--badge-pop); }
        .weltgeschehen { background-color: var(--badge-welt); }
        .technologie { background-color: var(--badge-tech); }
        .regionales { background-color: var(--badge-reg); }
        
        .card h2 { font-size: 15px; font-weight: 600; line-height: 1.35; color: var(--text-main); padding-right: 20px; cursor: pointer; }
        .card p { font-size: 13px; color: var(--text-sub); line-height: 1.4; display: none; padding-top: 4px; border-top: 1px dashed var(--border); } 
        .card.open p { display: block; }
        
        .card-footer { display: flex; justify-content: flex-end; align-items: center; gap: 14px; font-size: 12px; margin-top: 2px; }
        
        .action-icon-btn { background: transparent; border: none; font-size: 15px; color: #cbd5e1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s ease; outline: none; }
        .action-icon-btn:active { transform: scale(0.8); }
        .card-heart.active { color: var(--accent); animation: popHeart 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .share-btn { color: var(--text-muted); }

        @keyframes popHeart {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
        }
        
        .skeleton { background: linear-gradient(90deg, var(--border) 25%, var(--bg-main) 50%, var(--border) 75%); background-size: 200% 100%; animation: loadingSkeleton 1.4s infinite; border-radius: 4px; }
        @keyframes loadingSkeleton { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        
        .sk-card { background: var(--bg-card); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 10px; border: 1px solid var(--border); }
        .sk-badge { width: 70px; height: 16px; }
        .sk-line { width: 100%; height: 14px; }
        .sk-line.short { width: 60%; }

        .empty-state { text-align: center; margin-top: 40px; color: var(--text-muted); font-size: 14px; display: flex; flex-direction: column; gap: 10px; align-items: center; }
    </style>
</head>
<body>

    <div id="ptr-indicator">Pull to refresh...</div>

    <header>
        <h1 id="app-title">Mias News</h1>
        <button class="heart-btn" id="main-heart-btn" onclick="toggleFavoritenModus()">❤️</button>
    </header>

    <div id="controls-area">
        <div class="search-container">
            <span>🔍</span>
            <input type="text" id="search-input" placeholder="Nachrichten durchsuchen..." oninput="renderNews()">
        </div>

        <div class="categories">
            <button class="cat-btn active" onclick="filterKategorie('Alle', this)">Alle</button>
            <button class="cat-btn" onclick="filterKategorie('Weltgeschehen', this)">Weltgeschehen</button>
            <button class="cat-btn" onclick="filterKategorie('Regionales', this)">Regionales</button>
            <button class="cat-btn" onclick="filterKategorie('Popkultur', this)">Popkultur</button>
            <button class="cat-btn" onclick="filterKategorie('Technologie', this)">Technologie</button>
        </div>
        
        <div class="sub-categories" id="stadt-filter-bereich">
            <button class="sub-cat-btn active" onclick="filterStadt('beides', this)">Beides</button>
            <button class="sub-cat-btn" onclick="filterStadt('luebeck', this)">Lübeck</button>
            <button class="sub-cat-btn" onclick="filterStadt('hamburg', this)">Hamburg</button>
        </div>
    </div>
    
    <button class="back-btn" id="back-btn" style="display: none;" onclick="toggleFavoritenModus()">
        &larr; Zurück zu allen News
    </button>

    <div class="news-list" id="news-container"></div>

    <script>
        let allNews = [];
        let favoritenSet = new Set(JSON.parse(localStorage.getItem('mias_favoriten') || '[]'));
        let interessenScores = JSON.parse(localStorage.getItem('mias_algorithmus_scores') || '{}');
        let aktuelleKategorie = 'Alle';
        let aktuelleStadt = 'beides';
        let nurFavoritenModus = false;

        function bereinigeText(text) {
            if (!text) return "";
            return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        }

        function zeigeSkeletons() {
            const container = document.getElementById('news-container');
            container.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                container.innerHTML += `
                    <div class="sk-card">
                        <div class="card-top"><div class="skeleton sk-badge"></div></div>
                        <div class="skeleton sk-line"></div>
                        <div class="skeleton sk-line short"></div>
                    </div>
                `;
            }
        }

        async function ladeEchteNews() {
            zeigeSkeletons();
            try {
                const response = await fetch(`https://mias-news-backend.onrender.com/api/live-news`);
                const data = await response.json();
                
                if (data.articles) {
                    const geseheneTitel = new Set();
                    allNews = data.articles
                        .filter(a => a.title && a.description)
                        .filter(a => {
                            if (geseheneTitel.has(a.title)) return false;
                            geseheneTitel.add(a.title);
                            return true;
                        })
                        .map((artikel, index) => {
                            let kat = "Weltgeschehen";
                            let t = artikel.title.toLowerCase();
                            let d = artikel.description.toLowerCase();
                            let q = artikel.source.name.toLowerCase();
                            let u = artikel.url.toLowerCase();
                            
                            const blockierteQuellen = ["kino.de", "ibiza-heute", "ibiza heute"];
                            const blacklistThemen = [
                                "nba", "basketball", "star trek", "star wars", "fußball", "bundesliga", "sport", "spieltag", "transfer", "formel 1",
                                "steuerreform", "haushalt", "gesetzesentwurf", "subventionen", "aktienkurs", "dax", "zinsen", "review", "kritik", "vorschau"
                            ];
                            
                            if (blockierteQuellen.some(qName => q.includes(qName) || u.includes(qName))) return null;
                            
                            const breakingWords = [
                                "breaking", "eilmeldung", "schock", "sensation", "katastrophe", 
                                "ruecktritt", "rücktritt", "erdbeben", "skandal", "rekord", "announcement",
                                "ausnahmezustand", "großalarm", "festnahme", "historisch", "weltrekord", "krieg", "wahl"
                            ];
                            const istBreaking = breakingWords.some(word => t.includes(word));
                            
                            if (blacklistThemen.some(word => t.includes(word) || d.includes(word)) && !istBreaking) return null;
                            
                            const istPolitik = t.includes("politik") || t.includes("bundestag") || t.includes("regierung") || t.includes("gesetz") || t.includes("scholz");
                            if (istPolitik && !istBreaking) return null;

                            // HIER IST DER INTERNATIONALE POPKULTUR-FILTER (DEUTSCH + ENGLISCH ERWEITERT)
                            const popKeywords = [
                                "gaga", "swift", "beyonce", "kardashian", "rihanna", "grande", "bieber", 
                                "lipa", "eilish", "carpenter", "rodrigo", "gomez", "zendaya", "jenner", 
                                "chalamet", "styles", "roan", "charli xcx", "holland", "sweeney", 
                                "ethel cain", "cain", "del rey", "lorde", "boygenius", "bridgers", 
                                "sivan", "rapp", "clairo", "mitski", "hozier", "album", "grammy", 
                                "met gala", "coachella", "billboard", "charts", "welttournee", "tour",
                                "musikvideo", "gossip", "konzert", "promi", "star", "vinyl", "single", "debut",
                                "released", "release", "tracks", "lyrics", "performance", "trending", "interview"
                            ];
                            
                            if (t.includes("hamburg") || d.includes("hamburg") || t.includes("lübeck") || d.includes("lübeck") || t.includes("luebeck") || d.includes("luebeck") || t.includes("beck")) {
                                kat = "Regionales";
                            } else if (popKeywords.some(keyword => t.includes(keyword) || d.includes(keyword))) {
                                kat = "Popkultur";
                            } else if (t.includes("ki") || t.includes("apple") || t.includes("google") || t.includes("tech") || t.includes("smartphone") || t.includes("chatgpt")) {
                                kat = "Technologie";
                            }
                            
                            return {
                                id: 'news_' + index,
                                titel: bereinigeText(artikel.title),
                                beschreibung: bereinigeText(artikel.description),
                                kategorie: kat,
                                quelle: bereinigeText(artikel.source.name),
                                url: artikel.url,
                                breaking: istBreaking
                            };
                        })
                        .filter(Boolean);

                    allNews.forEach(artikel => {
                        let score = 0;
                        if (artikel.breaking) score += 500;
                        let text = (artikel.titel + " " + artikel.beschreibung).toLowerCase();
                        Object.keys(interessenScores).forEach(wort => {
                            if (text.includes(wort)) score += interessenScores[wort] * 10;
                        });
                        artikel.algoScore = score;
                    });

                    allNews.sort((a, b) => b.algoScore - a.algoScore);
                }
            } catch (e) {
                console.error("Fehler beim Laden:", e);
            }
            renderNews();
        }

        function lerneAusLike(titel, beschreibung, istErstellt) {
            let woerter = (titel + " " + beschreibung).toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/);
            const stoppWoerter = ["der", "die", "das", "und", "ist", "in", "ein", "eine", "mit", "für", "von", "auf", "zu", "den", "dem", "am", "im", "the", "a", "an", "and"];
            
            woerter.forEach(wort => {
                if (wort.length > 3 && !stoppWoerter.includes(wort)) {
                    if (!interessenScores[wort]) interessenScores[wort] = 0;
                    interessenScores[wort] += istErstellt ? 1 : -1;
                    if (interessenScores[wort] < 0) delete interessenScores[wort];
                }
            });
            localStorage.setItem('mias_algorithmus_scores', JSON.stringify(interessenScores));
        }

        async function shareArtikel(titel, url, event) {
            event.stopPropagation();
            if (navigator.share) {
                try {
                    await navigator.share({ title: titel, url: url });
                } catch (err) { console.log("Sharing cancelled"); }
            } else {
                navigator.clipboard.writeText(url);
                alert("Link in Zwischenablage kopiert!");
            }
        }

        function renderNews() {
            const container = document.getElementById('news-container');
            const searchWord = document.getElementById('search-input').value.toLowerCase();
            container.innerHTML = '';
            
            let gefiltert = allNews;
            
            if (nurFavoritenModus) {
                gefiltert = gefiltert.filter(n => favoritenSet.has(n.id));
            } else {
                if (aktuelleKategorie !== 'Alle') {
                    gefiltert = gefiltert.filter(n => n.kategorie === aktuelleKategorie || n.breaking);
                }
                if (aktuelleKategorie === 'Regionales' && aktuelleStadt !== 'beides') {
                    gefiltert = gefiltert.filter(n => {
                        let text = (n.titel + " " + n.beschreibung).toLowerCase();
                        if (aktuelleStadt === 'luebeck') return text.includes('lübeck') || text.includes('luebeck') || text.includes('beck');
                        if (aktuelleStadt === 'hamburg') return text.includes('hamburg');
                        return true;
                    });
                }
            }
            
            if (searchWord && !nurFavoritenModus) {
                gefiltert = gefiltert.filter(n => n.titel.toLowerCase().includes(searchWord) || n.beschreibung.toLowerCase().includes(searchWord));
            }
            
            if (gefiltert.length === 0) {
                container.innerHTML = `<div class='empty-state'>Keine Artikel gefunden.</div>`;
                return;
            }
            
            gefiltert.forEach(news => {
                const istFav = favoritenSet.has(news.id);
                const classKat = news.kategorie.toLowerCase();
                const card = document.createElement('div');
                card.className = `card ${news.breaking ? 'breaking-card' : ''}`;
                
                card.innerHTML = `
                    <div class="card-top">
                        <span class="badge ${news.breaking ? 'breaking-badge' : classKat}">
                            ${news.breaking ? '🔥 Eilmeldung' : news.kategorie}
                        </span>
                        <button class="action-icon-btn card-heart ${istFav ? 'active' : ''}" onclick="toggleFavorit('${news.id}', '${news.titel.replace(/'/g, "\\'")}', '${news.beschreibung.replace(/'/g, "\\'")}', event)">${istFav ? '❤️' : '🤍'}</button>
                    </div>
                    <h2 onclick="this.parentElement.classList.toggle('open')">${news.titel}</h2>
                    <p><strong>Zusammenfassung:</strong> ${news.beschreibung}<br><br><strong>Quelle:</strong> ${news.quelle}</p>
                    <div class="card-footer">
                        <button class="action-icon-btn share-btn" onclick="shareArtikel('${news.titel.replace(/'/g, "\\'")}', '${news.url}', event)">📤 Share</button>
                        <a href="${news.url}" target="_blank" style="color: var(--accent); text-decoration: none; font-weight: 600; font-size: 13px;">Original lesen &rarr;</a>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function filterKategorie(kat, btn) {
            aktuelleKategorie = kat;
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('stadt-filter-bereich').style.display = kat === 'Regionales' ? 'flex' : 'none';
            renderNews();
        }

        function filterStadt(stadt, btn) {
            aktuelleStadt = stadt;
            document.querySelectorAll('.sub-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderNews();
        }

        function toggleFavorit(id, titel, beschreibung, event) {
            event.stopPropagation();
            if (favoritenSet.has(id)) {
                favoritenSet.delete(id);
                lerneAusLike(titel, beschreibung, false);
            } else {
                favoritenSet.add(id);
                lerneAusLike(titel, beschreibung, true);
            }
            localStorage.setItem('mias_favoriten', JSON.stringify([...favoritenSet]));
            renderNews();
        }

        function toggleFavoritenModus() {
            nurFavoritenModus = !nurFavoritenModus;
            document.getElementById('app-title').innerText = nurFavoritenModus ? "Deine Favoriten" : "Mias News";
            document.getElementById('controls-area').style.display = nurFavoritenModus ? 'none' : 'block';
            document.getElementById('back-btn').style.display = nurFavoritenModus ? 'flex' : 'none';
            document.getElementById('main-heart-btn').style.display = nurFavoritenModus ? 'none' : 'block';
            renderNews();
        }

        let touchStartStartY = 0;
        window.addEventListener('touchstart', (e) => { touchStartStartY = e.touches[0].clientY; });
        window.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const diff = currentY - touchStartStartY;
            if (window.scrollY === 0 && diff > 0 && diff < 70) {
                document.getElementById('ptr-indicator').style.height = diff + 'px';
            }
        });
        window.addEventListener('touchend', (e) => {
            const indicator = document.getElementById('ptr-indicator');
            if (parseInt(indicator.style.height) > 50) {
                indicator.innerText = "Lade neue News...";
                ladeEchteNews().then(() => {
                    indicator.style.height = '0px';
                    indicator.innerText = "Pull to refresh...";
                });
            } else {
                indicator.style.height = '0px';
            }
        });

        ladeEchteNews();
    </script>
</body>
</html>
