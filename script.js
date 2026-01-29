/**
 * ADMINISTRATUM DATA-CORE ACCESS SCRIPT
 * Version: 2.0.1
 * Status: ACTIVE
 */

let loreData = [];
const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

/**
 * Initialization: Fetch the Master Data Vault
 */
async function loadLoreData() {
    try {
        // Replace with the path to your JSON file
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('DATA_ACCESS_DENIED');
        
        loreData = await response.json();
        
        // Default View: The Faction Selection Grid
        renderFactionGrid();
    } catch (err) {
        console.error("Critical System Failure:", err);
        storyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; border: 2px solid red; padding: 20px;">
                <h2 style="color: red;">CRITICAL ERROR: DATA-VAULT OFFLINE</h2>
                <p>The Administratum records are currently unavailable. Consult with your local Tech-Priest.</p>
            </div>
        `;
    }
}

/**
 * View 1: Render the high-level Faction Directory
 */
function renderFactionGrid() {
    // Clear and Hide Search for the main menu
    searchBar.style.display = 'none';
    window.scrollTo(0, 0);

    // Extract unique factions from the data and sort alphabetically
    const factions = [...new Set(loreData.map(s => s.primaryFaction))].sort();
    
    storyGrid.innerHTML = factions.map(faction => {
        const count = loreData.filter(s => s.primaryFaction === faction).length;
        return `
            <div class="faction-card" onclick="showFactionStories('${faction}')">
                <h2>${faction}</h2>
                <div class="status-indicator">SECURE ACCESS: ${count} DATA-SLATES FOUND</div>
            </div>
        `;
    }).join('');
}

/**
 * View 2: Render the specific books for a chosen Faction
 * @param {string} faction 
 */
function showFactionStories(faction) {
    searchBar.style.display = 'block';
    searchBar.value = ''; // Reset search on new view
    
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    
    let html = `
        <div style="grid-column: 1/-1; margin-bottom: 20px;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO MAIN DIRECTORY</button>
            <h1 class="glitch" style="text-transform: uppercase;">DECRYPTING: ${faction}</h1>
        </div>
    `;

    html += filtered.map(story => renderBookCard(story)).join('');
    storyGrid.innerHTML = html;
    window.scrollTo(0, 0);
}

/**
 * Component: Individual Book Card Generator
 * @param {Object} story 
 */
function renderBookCard(story) {
    return `
        <div class="card">
            <div class="cover-container">
                <img src="${story.coverImage}" 
                     class="book-cover" 
                     alt="${story.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://placehold.co/400x600/000000/1aff1a?text=REDACTED+IMAGE';">
            </div>
            <div class="card-content">
                <span class="faction-tag">${story.subFaction || story.primaryFaction}</span>
                <h3>${story.title}</h3>
                <p class="author">By ${story.author}</p>
                <p class="description">${story.description}</p>
            </div>
            <div class="external-links">
                <span class="link-label">DATA-LINKS:</span>
                <div class="qr-placeholder">AMZ</div>
                <div class="qr-placeholder">AUD</div>
            </div>
        </div>
    `;
}

/**
 * Global Search Logic
 * Filters through the entire database across all factions
 */
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    if (term.length === 0) {
        // If they clear the search, it's safer to return to the faction grid
        return; 
    }

    const filtered = loreData.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.primaryFaction.toLowerCase().includes(term) ||
        s.author.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
    
    if (filtered.length === 0) {
        storyGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">NO MATCHING DATA-SLATES FOUND IN ARCHIVE.</p>`;
    } else {
        storyGrid.innerHTML = filtered.map(story => renderBookCard(story)).join('');
    }
});

// Start the sequence
loadLoreData();
