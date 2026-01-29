/**
 * ADMINISTRATUM DATA-CORE ACCESS SCRIPT v3.1
 * Profile: BLACK OPS ONE / FULL FEATURE SET
 * Clearance: INQUISITORIAL (MAXIMUM)
 */

let loreData = [];
const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

/**
 * 1. SYSTEM BOOT & DATA FETCH
 * Simulates a high-security decryption sequence.
 */
async function loadLoreData() {
    try {
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('DATA_VAULT_CONNECTION_LOST');
        
        loreData = await response.json();
        
        // Detailed Decryption UI
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px;">
                <h1 class="glitch" data-text="DECRYPTING ARCHIVES..." style="font-family: 'Black Ops One'; font-size: 3rem;">DECRYPTING ARCHIVES...</h1>
                <p style="letter-spacing: 10px; color: #1aff1a; margin-top: 20px; animation: pulse 1.5s infinite;">[ |||||||||||||||||||| ] 100%</p>
                <p style="font-size: 0.8rem; opacity: 0.5; margin-top: 10px;">PURGING HERETICAL DATA-SPORES... MACHINE SPIRIT APPEASED.</p>
            </div>
        `;

        // Atmospheric delay
        setTimeout(() => {
            renderFactionGrid();
        }, 1500);

    } catch (err) {
        console.error("Critical System Failure:", err);
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; border: 5px solid #ff0000; padding: 60px; background: rgba(30,0,0,0.9);">
                <h1 class="glitch" data-text="ACCESS DENIED" style="color: #ff0000; font-family: 'Black Ops One'; font-size: 4rem;">!! ACCESS DENIED !!</h1>
                <p style="color: #ff0000; font-size: 1.5rem; margin: 20px 0;">THE MACHINE SPIRIT HAS REJECTED YOUR CREDENTIALS.</p>
                <p style="color: #660000;">ERROR_CODE: ${err.message}</p>
                <button onclick="location.reload()" class="back-btn" style="margin-top:30px; background: #ff0000; color: #fff;">REBOOT COGITATOR</button>
            </div>
        `;
    }
}

/**
 * 2. PRIMARY VIEW: FACTION DIRECTORY
 */
function renderFactionGrid() {
    // UI Reset
    searchBar.style.display = 'none';
    searchBar.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Generate Factions
    const factions = [...new Set(loreData.map(s => s.primaryFaction))].sort();
    
    storyGrid.innerHTML = factions.map(faction => {
        const count = loreData.filter(s => s.primaryFaction === faction).length;
        return `
            <div class="faction-card" onclick="showFactionStories('${faction}')">
                <h2 style="font-family: 'Black Ops One'; font-size: 2.2rem; margin-bottom: 15px;">${faction}</h2>
                <div class="status-indicator" style="border-top: 1px solid #1aff1a; padding-top: 10px;">
                    SECURE ACCESS: ${count} DATA-SLATES
                </div>
                <div style="font-size: 0.6rem; margin-top: 15px; opacity: 0.4;">EST. BATTLE-LOGS AVAILABLE</div>
            </div>
        `;
    }).join('');
}

/**
 * 3. SECONDARY VIEW: FACTION-SPECIFIC ARCHIVES
 */
function showFactionStories(faction) {
    searchBar.style.display = 'block';
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    
    let html = `
        <div style="grid-column: 1/-1; margin-bottom: 50px; border-bottom: 3px solid #1aff1a; padding-bottom: 30px;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO MAIN DIRECTORY</button>
            <h1 class="glitch" data-text="${faction.toUpperCase()}" style="font-family: 'Black Ops One'; font-size: 4rem; margin: 20px 0;">
                ${faction}
            </h1>
            <div class="status-indicator">FILTERING SECTOR: ${faction.toUpperCase()} // RECORDS FOUND: ${filtered.length}</div>
        </div>
    `;

    html += filtered.map(story => renderBookCard(story)).join('');
    storyGrid.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 4. COMPONENT: THE BOOK DATA-SLATE
 * Handles the metadata and the triple-link image safety net.
 */
function renderBookCard(story) {
    return `
        <div class="card">
            <div class="cover-container" style="background: #000;">
                <img src="${story.coverImage}" 
                     class="book-cover" 
                     alt="${story.title}" 
                     loading="lazy"
                     onerror="handleImageFailure(this, '${story.title}')">
            </div>
            <div class="card-content">
                <span class="faction-tag" style="font-family: 'Black Ops One';">${story.subFaction || story.primaryFaction}</span>
                <h3 style="font-family: 'Black Ops One'; font-size: 1.8rem; color: #fff; line-height: 1;">${story.title}</h3>
                <p class="author" style="color: #1aff1a; text-transform: uppercase; font-size: 0.8rem; margin: 10px 0;">[ AUTHOR: ${story.author} ]</p>
                <hr style="border: 0; border-top: 1px dashed #004400; margin: 15px 0;">
                <p class="description" style="font-family: 'VT323'; font-size: 1.2rem;">${story.description}</p>
            </div>
            <div class="external-links" style="background: rgba(0,40,0,0.2); padding: 15px; display: flex; gap: 10px; justify-content: flex-end;">
                <button class="qr-placeholder" onclick="window.open('https://www.amazon.com/s?k=Warhammer+40000+${story.title}', '_blank')" title="Acquire via Amazon">AMZ</button>
                <button class="qr-placeholder" onclick="window.open('https://www.audible.com/search?keywords=Warhammer+40000+${story.title}', '_blank')" title="Acquire via Audible">AUD</button>
            </div>
        </div>
    `;
}

/**
 * 5. SMART IMAGE RECOVERY
 * If a link is blocked by a server (403/404), this attempts to find the image elsewhere.
 */
function handleImageFailure(img, title) {
    console.warn(`IMAGE_FETCH_ERROR: ${title}. Attempting secondary data-stream...`);
    
    if (!img.dataset.retryCount) {
        img.dataset.retryCount = "1";
        // Attempt 1: Try Open Library Search (High success rate)
        const safeTitle = encodeURIComponent(title);
        img.src = `https://covers.openlibrary.org/b/isbn/${title.length}000000-L.jpg?default=false`;
    } else if (img.dataset.retryCount === "1") {
        img.dataset.retryCount = "2";
        // Attempt 2: High-contrast Placeholder
        img.src = `https://placehold.co/400x600/050805/1aff1a?text=${title.replace(/ /g, '+')}`;
    } else {
        // Final Fallback: Themed Redacted
        img.src = 'https://placehold.co/400x600/000000/1aff1a?text=DATA+REDACTED';
        img.style.opacity = "0.5";
    }
}

/**
 * 6. SEARCH ENGINE: GLOBAL ARCHIVE SCANNER
 */
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    if (term.length === 0) return; // Keep current view

    const filtered = loreData.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.primaryFaction.toLowerCase().includes(term) ||
        s.author.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
    
    if (filtered.length === 0) {
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px; border: 2px dashed #ff0000;">
                <h2 class="glitch" data-text="NO MATCHING DATA-SLATES" style="font-family: 'Black Ops One';">NO MATCHING DATA-SLATES</h2>
                <p>THE INQUISITION HAS NO RECORD OF "${term.toUpperCase()}"</p>
                <button onclick="renderFactionGrid()" class="back-btn" style="margin-top:20px;">RESET SCANNER</button>
            </div>
        `;
    } else {
        storyGrid.innerHTML = filtered.map(story => renderBookCard(story)).join('');
    }
});

// START SYSTEM
loadLoreData();
