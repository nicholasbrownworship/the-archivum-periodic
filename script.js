let loreData = [];
const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

// Initialize
async function loadLoreData() {
    try {
        const response = await fetch('data/stories.json');
        loreData = await response.json();
        renderFactionGrid();
    } catch (err) {
        storyGrid.innerHTML = "<p>ADMINISTRATUM ERROR: FILES NOT FOUND</p>";
    }
}

// 1. Show the Faction Selection Grid
function renderFactionGrid() {
    // Hide search bar on main menu for cleanliness
    searchBar.style.display = 'none';
    
    const factions = [...new Set(loreData.map(s => s.primaryFaction))];
    
    storyGrid.innerHTML = factions.map(faction => `
        <div class="faction-card" onclick="showFactionStories('${faction}')">
            <h2>${faction}</h2>
            <p>ACCESS DATA-SLATE</p>
        </div>
    `).join('');
}

// 2. Show the Books for a Specific Faction
function showFactionStories(faction) {
    searchBar.style.display = 'block';
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    
    let html = `
        <div style="grid-column: 1/-1;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO MAIN DIRECTORY</button>
            <h2 style="text-transform: uppercase;">FACTION: ${faction}</h2>
        </div>
    `;

    html += filtered.map(story => renderBookCard(story)).join('');
    storyGrid.innerHTML = html;
}

// 3. Helper to create the Book Card HTML
function renderBookCard(story) {
    return `
        <div class="card">
            <img src="${story.coverImage}" class="book-cover" alt="Book Cover">
            <div class="card-content">
                <span class="faction-tag">${story.primaryFaction}</span>
                <h3>${story.title}</h3>
                <p><strong>Author:</strong> ${story.author}</p>
                <p class="description">${story.description}</p>
            </div>
            <div class="external-links">
                <div class="qr-placeholder">AMZ</div>
                <div class="qr-placeholder">AUD</div>
            </div>
        </div>
    `;
}

// 4. Search Filter Logic (If they use the bar while in a faction view)
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = loreData.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.primaryFaction.toLowerCase().includes(term)
    );
    
    // If searching, we clear the 'faction' context and just show results
    storyGrid.innerHTML = filtered.map(story => renderBookCard(story)).join('');
});

loadLoreData();
