/**
 * ADMINISTRATUM DATA-CORE ACCESS SCRIPT v2.5
 * Font Profile: BLACK OPS ONE
 */

let loreData = [];
const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

/**
 * 1. INITIALIZATION
 * Fetches data and handles the initial "Loading" sequence.
 */
async function loadLoreData() {
    try {
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('DATA_VAULT_REACH_FAILURE');
        
        loreData = await response.json();
        
        // Brief timeout to simulate "Data Decryption"
        setTimeout(() => {
            renderFactionGrid();
        }, 500);

    } catch (err) {
        console.error("Critical System Failure:", err);
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; border: 2px solid #1aff1a; padding: 40px; background: rgba(255,0,0,0.1);">
                <h2 class="glitch" style="color: #ff0000;">!! CRITICAL ERROR: DATA-VAULT OFFLINE !!</h2>
                <p>THE EMPEROR PROTECTS, BUT THE SERVER DOES NOT.</p>
                <button onclick="location.reload()" class="back-btn" style="margin-top:20px;">RETRY CONNECTION</button>
            </div>
        `;
    }
}

/**
 * 2. LANDING VIEW: FACTION DIRECTORY
 */
function renderFactionGrid() {
    // UI Housekeeping
    searchBar.style.display = 'none';
    searchBar.value = '';
    window.scrollTo(0, 0);

    // Filter unique factions and sort
    const factions = [...new Set(loreData.map(s => s.primaryFaction))].sort();
    
    storyGrid.innerHTML = factions.map(faction => {
        const count = loreData.filter(s => s.primaryFaction === faction).length;
        return `
            <div class="faction-card" onclick="showFactionStories('${faction}')">
                <h2 style="font-family: 'Black Ops One', cursive;">${faction}</h2>
                <div class="status-indicator">SECURE ACCESS: ${count} SLATES</div>
            </div>
        `;
    }).join('');
}

/**
 * 3. FILTERED VIEW: BOOKS BY FACTION
 */
function showFactionStories(faction) {
    searchBar.style.display = 'block';
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    
    let html = `
        <div style="grid-column: 1/-1; margin-bottom: 30px; border-bottom: 1px solid #1aff1a; padding-bottom: 10px;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO DIRECTORY</button>
            <h1 class="glitch" style="font-family: 'Black Ops One', cursive; font-size: 2.5rem;">${faction} ARCHIVES</h1>
        </div>
    `;

    html += filtered.map(story => renderBookCard(story)).join('');
    storyGrid.innerHTML = html;
    window.scrollTo(0, 0);
}

/**
 * 4. COMPONENT: INDIVIDUAL DATA CARD
 */
function renderBookCard(story) {
    return `
        <div class="card">
            <div class="cover-container" style="background: #000; height: 380px; overflow: hidden;">
                <img src="${story.coverImage}" 
                     class="book-cover" 
                     alt="${story.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://placehold.co/400x600/050805/1aff1a?text=REDACTED+BY+INQUISITION';">
            </div>
            <div class="card-content">
                <span class="faction-tag">${story.subFaction || story.primaryFaction}</span>
                <h3 style="font-family: 'Black Ops One', cursive; color: #fff; letter-spacing: 1px;">${story.title}</h3>
                <p class="author">BY: ${story.author}</p>
                <hr style="border: 0; border-top: 1px solid #004400; margin: 10px 0;">
                <p class="description">${story.description}</p>
            </div>
            <div class="external-links">
                <div class="qr-placeholder" onclick="alert('Searching Amazon for: ${story.title}')">AMZ</div>
                <div class="qr-placeholder" onclick="alert('Searching Audible for: ${story.title}')">AUD</div>
            </div>
        </div>
    `;
}

/**
 * 5. SEARCH ENGINE
 * Real-time filtering across Title, Author, and Description.
 */
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    if (term.length === 0) {
        // Option: Show empty state or all? Let's stay in the current faction view if empty
        return; 
    }

    const filtered = loreData.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.author.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
    
    if (filtered.length === 0) {
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <p class="glitch" style="font-size: 1.5rem;">NO DATA-SLATES MATCHING "${term.toUpperCase()}"</p>
            </div>
        `;
    } else {
        storyGrid.innerHTML = filtered.map(story => renderBookCard(story)).join('');
    }
});

// INITIALIZE SYSTEM
loadLoreData();
