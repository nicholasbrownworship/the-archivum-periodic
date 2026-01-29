/**
 * ADMINISTRATUM DATA-CORE ACCESS SCRIPT v5.0
 * FULL FEATURE RESTORATION - BLACK OPS ONE
 * IMAGE PROTOCOL: GOOGLE BOOKS API (BYPASSES 403 BLOCKS)
 */

let loreData = [];
const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

/**
 * 1. SYSTEM BOOT
 * Fully animated loading sequence with Black Ops One headers.
 */
async function loadLoreData() {
    try {
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('DATA_VAULT_CONNECTION_LOST');
        
        loreData = await response.json();
        
        // Full Decryption UI - No features removed
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px;">
                <h1 class="glitch" data-text="DECRYPTING ARCHIVES..." style="font-family: 'Black Ops One'; font-size: 3rem;">DECRYPTING ARCHIVES...</h1>
                <div style="width: 300px; height: 3px; background: #1aff1a; margin: 30px auto; position: relative; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: #fff; position: absolute; left: -100%; animation: loadingBar 2s infinite;"></div>
                </div>
                <p style="font-family: 'VT323'; letter-spacing: 5px;">ESTABLISHING SECURE CONNECTION...</p>
            </div>
        `;

        // Style for the loading bar animation
        const style = document.createElement('style');
        style.innerHTML = `@keyframes loadingBar { 0% { left: -100%; } 100% { left: 100%; } }`;
        document.head.appendChild(style);

        setTimeout(() => {
            renderFactionGrid();
        }, 1500);

    } catch (err) {
        console.error("Critical System Failure:", err);
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; border: 5px solid #ff0000; padding: 60px; background: rgba(30,0,0,0.9);">
                <h1 class="glitch" data-text="ACCESS DENIED" style="color: #ff0000; font-family: 'Black Ops One'; font-size: 4rem;">!! ACCESS DENIED !!</h1>
                <p style="color: #ff0000; font-family: 'VT323'; font-size: 1.5rem;">THE MACHINE SPIRIT HAS REJECTED YOUR REQUEST.</p>
                <button onclick="location.reload()" class="back-btn" style="margin-top:30px; background: #ff0000; color: #fff;">REBOOT COGITATOR</button>
            </div>
        `;
    }
}

/**
 * 2. FACTION DIRECTORY (Landing Page)
 */
function renderFactionGrid() {
    searchBar.style.display = 'none';
    searchBar.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const factions = [...new Set(loreData.map(s => s.primaryFaction))].sort();
    
    storyGrid.innerHTML = factions.map(faction => {
        const count = loreData.filter(s => s.primaryFaction === faction).length;
        return `
            <div class="faction-card" onclick="showFactionStories('${faction}')">
                <h2 style="font-family: 'Black Ops One'; font-size: 2.2rem; margin-bottom: 15px;">${faction}</h2>
                <div class="status-indicator" style="font-family: 'VT323'; border-top: 1px solid #1aff1a; padding-top: 10px;">
                    SECURE ACCESS: ${count} DATA-SLATES
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 3. ARCHIVE VIEW (Faction Page)
 */
function showFactionStories(faction) {
    searchBar.style.display = 'block';
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    
    let html = `
        <div style="grid-column: 1/-1; margin-bottom: 50px; border-bottom: 3px solid #1aff1a; padding-bottom: 30px;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO MAIN DIRECTORY</button>
            <h1 class="glitch" data-text="${faction.toUpperCase()}" style="font-family: 'Black Ops One'; font-size: 4.5rem; margin: 20px 0;">
                ${faction}
            </h1>
            <p style="font-family: 'VT323'; color: #1aff1a; opacity: 0.7;">COORDINATES: SEGMENTUM OBSCURUS // DATA-LOAD: ${filtered.length} RECORDS</p>
        </div>
    `;

    html += filtered.map(story => renderBookCard(story)).join('');
    storyGrid.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 4. BOOK CARD COMPONENT
 * Restored: Title, Author, Description, Subfaction, and Amazon/Audible Links.
 */
function renderBookCard(story) {
    return `
        <div class="card">
            <div class="cover-container">
                <img src="${story.coverImage}" 
                     class="book-cover" 
                     alt="${story.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://placehold.co/400x600/000000/1aff1a?text=REDACTED+BY+INQUISITION';">
            </div>
            <div class="card-content">
                <span class="faction-tag" style="font-family: 'Black Ops One';">${story.subFaction || story.primaryFaction}</span>
                <h3 style="font-family: 'Black Ops One'; font-size: 1.8rem; color: #fff; line-height: 1.1; margin: 10px 0;">${story.title}</h3>
                <p class="author" style="color: #1aff1a; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 15px; font-family: 'VT323';">[ AUTH: ${story.author} ]</p>
                <p class="description" style="font-family: 'VT323'; font-size: 1.2rem; border-left: 1px solid #1aff1a; padding-left: 10px;">${story.description}</p>
            </div>
            <div class="external-links" style="padding: 15px; display: flex; gap: 10px; justify-content: flex-end; background: rgba(0,20,0,0.3);">
                <button class="qr-placeholder" onclick="window.open('https://www.amazon.com/s?k=Warhammer+40k+${encodeURIComponent(story.title)}', '_blank')">AMZ</button>
                <button class="qr-placeholder" onclick="window.open('https://www.audible.com/search?keywords=Warhammer+40k+${encodeURIComponent(story.title)}', '_blank')">AUD</button>
            </div>
        </div>
    `;
}

/**
 * 5. SEARCH ENGINE
 */
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length === 0) return;

    const filtered = loreData.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.primaryFaction.toLowerCase().includes(term) ||
        s.author.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
    
    if (filtered.length === 0) {
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px; border: 2px dashed #1aff1a;">
                <h2 class="glitch" data-text="NO DATA FOUND" style="font-family: 'Black Ops One'; font-size: 2.5rem;">NO DATA FOUND</h2>
                <button onclick="renderFactionGrid()" class="back-btn" style="margin-top: 20px;">RESET SCANNER</button>
            </div>
        `;
    } else {
        storyGrid.innerHTML = filtered.map(story => renderBookCard(story)).join('');
    }
});

loadLoreData();
