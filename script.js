let loreData = [];
const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

async function loadLoreData() {
    try {
        const response = await fetch('data/stories.json');
        loreData = await response.json();
        renderFactionGrid();
    } catch (err) {
        storyGrid.innerHTML = "<h2>ADMINISTRATUM ERROR: DATA VAULT BREACHED</h2>";
    }
}

function renderFactionGrid() {
    searchBar.style.display = 'none';
    const factions = [...new Set(loreData.map(s => s.primaryFaction))].sort();
    
    storyGrid.innerHTML = factions.map(faction => `
        <div class="faction-card" onclick="showFactionStories('${faction}')">
            <h2>${faction}</h2>
            <p>DATA SECURE: ${loreData.filter(s => s.primaryFaction === faction).length} ENTRIES</p>
        </div>
    `).join('');
}

function showFactionStories(faction) {
    searchBar.style.display = 'block';
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    
    let html = `
        <div style="grid-column: 1/-1;">
            <button onclick="renderFactionGrid()" class="back-btn">← RETURN TO CORE</button>
            <h1 class="glitch" data-text="${faction}">${faction} DATA-FILES</h1>
        </div>
    `;

    html += filtered.map(story => `
        <div class="card">
            <img src="${story.coverImage}" class="book-cover" alt="Cover" onerror="this.src='https://placehold.co/400x600/000000/1aff1a?text=NO+IMAGE'">
            <div class="card-content">
                <span class="faction-tag">${story.subFaction}</span>
                <h3>${story.title}</h3>
                <p><strong>By ${story.author}</strong></p>
                <p>${story.description}</p>
            </div>
        </div>
    `).join('');
    
    storyGrid.innerHTML = html;
}

loadLoreData();
