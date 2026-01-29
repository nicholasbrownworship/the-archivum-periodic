/**
 * ADMINISTRATUM DATA-CORE ACCESS SCRIPT v2.6
 * Font Profile: BLACK OPS ONE
 * Security Clearance: INQUISITORIAL
 */

let loreData = [];
const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

/**
 * 1. INITIALIZATION: DATA-VAULT CONNECTION
 */
async function loadLoreData() {
    try {
        // Fetching the Master JSON
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('DATA_VAULT_REACH_FAILURE');
        
        loreData = await response.json();
        
        // Simulating Cogitator Boot-Up Sequence
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px;">
                <h2 class="glitch" style="font-family: 'Black Ops One', cursive;">DECRYPTING ARCHIVES...</h2>
                <p>PURGING HERETICAL DATA-SPORES</p>
            </div>
        `;

        setTimeout(() => {
            renderFactionGrid();
        }, 800);

    } catch (err) {
        console.error("Critical System Failure:", err);
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; border: 3px solid #ff0000; padding: 40px; background: rgba(50,0,0,0.8);">
                <h1 class="glitch" style="color: #ff0000; font-family: 'Black Ops One';">!! ACCESS DENIED !!</h1>
                <p style="color: #ff0000;">THE MACHINE SPIRIT IS ANGRY. ARCHIVE CONNECTION SEVERED.</p>
                <button onclick="location.reload()" class="back-btn" style="margin-top:20px; background: #ff0000;">REBOOT COGITATOR</button>
            </div>
        `;
    }
}

/**
 * 2. LANDING VIEW: THE FACTION SELECTION DIRECTORY
 */
function renderFactionGrid() {
    searchBar.style.display = 'none';
    searchBar.value = '';
    window.scrollTo(0, 0);

    // Filter unique factions and sort them alphabetically
    const factions = [...new Set(loreData.map(s => s.primaryFaction))].sort();
    
    storyGrid.innerHTML = factions.map(faction => {
        const count = loreData.filter(s => s.primaryFaction === faction).length;
        return `
            <div class="faction-card" onclick="showFactionStories('${faction}')">
                <h2 style="font-family: 'Black Ops One', cursive; font-size: 2rem;">${faction}</h2>
                <div class="status-indicator">SECURE ACCESS: ${count} SLATES DETECTED</div>
            </div>
        `;
    }).join('');
}

/**
 * 3. FILTERED VIEW: DISPLAY BOOKS BY FACTION
 */
function showFactionStories(faction) {
    searchBar.style.display = 'block';
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    
    let html = `
        <div style="grid-column: 1/-1; margin-bottom: 30px; border-bottom: 2px solid #1aff1a; padding-bottom: 15px;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO MAIN CORE</button>
            <h1 class="glitch" style="font-family: 'Black Ops One', cursive; font-size: 3rem; text-transform: uppercase;">
                ${faction} DATA-FEED
            </h1>
        </div>
    `;

    html += filtered.map(story => renderBookCard(story)).join('');
    storyGrid.innerHTML = html;
    window.scrollTo(0, 0);
}

/**
 * 4. COMPONENT: RENDER INDIVIDUAL BOOK DATA-SLATE
 * Includes the hard-coded "Redacted" fallback for broken images
 */
function renderBookCard(story) {
    return `
        <div class="card">
            <div class="cover-container">
                <img src="${story.coverImage}" 
                     class="book-cover" 
                     alt="${story.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://placehold.co/400x600/000000/1aff1a?text=DATA+REDACTED';">
            </div>
            <div class="card-content">
                <span class="faction-tag">${story.subFaction || story.primaryFaction}</span>
                <h3 style="font-family: 'Black Ops One', cursive; font-size: 1.4rem; color: #fff;">${story.title}</h3>
                <p class="author" style="font-weight: bold;">AUTHOR: ${story.author}</p>
                <div style="border-top: 1px solid #004400; margin: 12px 0;"></div>
                <p class="description">${story.description}</p>
            </div>
            <div class="external-links">
                <div class="qr-placeholder" onclick="window.open('https://www.amazon.com/s?k=Warhammer+40k+${story.title}', '_blank')">AMZ</div>
                <div class="qr-placeholder" onclick="window.open('https://www.audible.com/search?keywords=${story.title}', '_blank')">AUD</div>
            </div>
        </div>
    `;
}

/**
 * 5. SEARCH ENGINE: GLOBAL ARCHIVE SCANNER
 */
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    if (term.length === 0) return; // Wait for input

    const filtered = loreData.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.primaryFaction.toLowerCase().includes(term) ||
        s.author.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
    
    if (filtered.length === 0) {
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px; border: 1px dashed #1aff1a;">
                <h2 class="glitch" style="font-family: 'Black Ops One';">NO MATCHING DATA-SLATES</h2>
                <p>The Inquisition has no record of "${term.toUpperCase()}".</p>
                <button onclick="renderFactionGrid()" class="back-btn" style="margin-top: 20px;">RESET SEARCH</button>
            </div>
        `;
    } else {
        storyGrid.innerHTML = filtered.map(story => renderBookCard(story)).join('');
    }
});

// INITIALIZE COGITATOR
loadLoreData();
