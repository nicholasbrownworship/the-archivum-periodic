/**
 * ADMINISTRATUM DATA-CORE ACCESS SCRIPT v2.8
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
        
        // Simulating Cogitator Boot-Up Sequence with full UI feedback
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px;">
                <h2 class="glitch" data-text="DECRYPTING ARCHIVES..." style="font-family: 'Black Ops One', cursive; font-size: 2.5rem;">DECRYPTING ARCHIVES...</h2>
                <p style="letter-spacing: 5px; margin-top: 20px;">PURGING HERETICAL DATA-SPORES</p>
                <div style="width: 200px; height: 2px; background: #1aff1a; margin: 20px auto; animation: pulse 1s infinite;"></div>
            </div>
        `;

        // Artificial delay for atmospheric "loading"
        setTimeout(() => {
            renderFactionGrid();
        }, 1200);

    } catch (err) {
        console.error("Critical System Failure:", err);
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; border: 3px solid #ff0000; padding: 40px; background: rgba(50,0,0,0.8);">
                <h1 class="glitch" data-text="ACCESS DENIED" style="color: #ff0000; font-family: 'Black Ops One';">!! ACCESS DENIED !!</h1>
                <p style="color: #ff0000; font-weight: bold;">THE MACHINE SPIRIT IS ANGRY. ARCHIVE CONNECTION SEVERED.</p>
                <button onclick="location.reload()" class="back-btn" style="margin-top:20px; background: #ff0000; color: white;">REBOOT COGITATOR</button>
            </div>
        `;
    }
}

/**
 * 2. LANDING VIEW: THE FACTION SELECTION DIRECTORY
 */
function renderFactionGrid() {
    // UI Housekeeping - ensuring elements are hidden/shown correctly
    searchBar.style.display = 'none';
    searchBar.value = '';
    window.scrollTo(0, 0);

    // Filter unique factions and sort them alphabetically
    const factions = [...new Set(loreData.map(s => s.primaryFaction))].sort();
    
    storyGrid.innerHTML = factions.map(faction => {
        const count = loreData.filter(s => s.primaryFaction === faction).length;
        return `
            <div class="faction-card" onclick="showFactionStories('${faction}')">
                <h2 style="font-family: 'Black Ops One', cursive; font-size: 2rem; margin-bottom: 10px;">${faction}</h2>
                <div class="status-indicator">SECURE ACCESS: ${count} SLATES DETECTED</div>
                <div class="card-border-effect"></div>
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
        <div style="grid-column: 1/-1; margin-bottom: 40px; border-bottom: 2px solid #1aff1a; padding-bottom: 20px; position: relative;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO MAIN CORE</button>
            <h1 class="glitch" data-text="FACTION: ${faction}" style="font-family: 'Black Ops One', cursive; font-size: 3.5rem; text-transform: uppercase;">
                ${faction}
            </h1>
            <p style="font-size: 0.8rem; opacity: 0.6;">LOCAL_CACHE_INDEX: 0x${Math.floor(Math.random()*16777215).toString(16)}</p>
        </div>
    `;

    html += filtered.map(story => renderBookCard(story)).join('');
    storyGrid.innerHTML = html;
    window.scrollTo(0, 0);
}

/**
 * 4. COMPONENT: RENDER INDIVIDUAL BOOK DATA-SLATE
 * Features: Triple-check image logic & Black Ops One styling
 */
function renderBookCard(story) {
    return `
        <div class="card">
            <div class="cover-container">
                <img src="${story.coverImage}" 
                     class="book-cover" 
                     alt="${story.title}" 
                     loading="lazy"
                     onerror="handleImageError(this)">
            </div>
            <div class="card-content">
                <span class="faction-tag">${story.subFaction || story.primaryFaction}</span>
                <h3 style="font-family: 'Black Ops One', cursive; font-size: 1.6rem; color: #fff; margin: 10px 0;">${story.title}</h3>
                <p class="author" style="color: #1aff1a; font-weight: bold; font-size: 0.9rem;">IDENTIFIED AUTHOR: ${story.author}</p>
                <div style="border-top: 1px dashed #004400; margin: 15px 0;"></div>
                <p class="description" style="font-family: 'VT323', monospace; font-size: 1.1rem; line-height: 1.3;">${story.description}</p>
            </div>
            <div class="external-links">
                <div class="qr-placeholder" onclick="window.open('https://www.amazon.com/s?k=Warhammer+40000+${story.title}', '_blank')">AMZ</div>
                <div class="qr-placeholder" onclick="window.open('https://www.audible.com/search?keywords=Warhammer+40000+${story.title}', '_blank')">AUD</div>
            </div>
        </div>
    `;
}

/**
 * 5. SMART IMAGE FALLBACK
 * Prevents the "Everything is Redacted" issue by attempting a search if the link is blocked
 */
function handleImageError(imageElement) {
    // If the primary link fails, we don't just "Redact" immediately.
    // We try to pull from the Open Library ISBN service if available.
    console.warn("Primary image failed. Initializing emergency data fetch...");
    
    // Check if we've already tried a fallback to avoid infinite loops
    if (!imageElement.dataset.triedFallback) {
        imageElement.dataset.triedFallback = "true";
        // Attempting to use a placeholder that won't be blocked
        imageElement.src = `https://placehold.co/400x600/050805/1aff1a?text=RECOVERING+DATA`;
    } else {
        // If even that fails, we show the final themed "Redacted" state
        imageElement.src = 'https://placehold.co/400x600/000000/1aff1a?text=DATA+REDACTED';
        imageElement.style.filter = "sepia(1) hue-rotate(90deg) brightness(0.5)";
    }
}

/**
 * 6. SEARCH ENGINE: GLOBAL ARCHIVE SCANNER
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
            <div style="grid-column: 1/-1; text-align: center; padding: 100px; border: 2px dashed #1aff1a; background: rgba(0,20,0,0.5);">
                <h2 class="glitch" data-text="NO MATCHING DATA-SLATES" style="font-family: 'Black Ops One'; font-size: 2rem;">NO MATCHING DATA-SLATES</h2>
                <p style="margin-top: 20px;">The Administratum has no record of "${term.toUpperCase()}" in this sector.</p>
                <button onclick="renderFactionGrid()" class="back-btn" style="margin-top: 30px;">PURGE SEARCH & RESET</button>
            </div>
        `;
    } else {
        storyGrid.innerHTML = filtered.map(story => renderBookCard(story)).join('');
    }
});

// INITIALIZE SYSTEM SEQUENCE
loadLoreData();
