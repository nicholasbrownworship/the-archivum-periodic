let loreData = [];

// Load Data
async function loadLoreData() {
    const response = await fetch('data/stories.json');
    loreData = await response.json();
    renderFactionGrid(); // Show factions first
}

// 1. Render the Grid of Factions
function renderFactionGrid() {
    const factions = [...new Set(loreData.map(s => s.primaryFaction))];
    const grid = document.getElementById('storyGrid');
    
    grid.innerHTML = factions.map(faction => `
        <div class="faction-card" onclick="showFactionStories('${faction}')">
            <h2>${faction}</h2>
            <p>View Data-Files</p>
        </div>
    `).join('');
}

// 2. Filter stories when faction is clicked
function showFactionStories(faction) {
    const filtered = loreData.filter(s => s.primaryFaction === faction);
    const grid = document.getElementById('storyGrid');
    
    // Add a "Back" button
    let html = `<button onclick="renderFactionGrid()" class="back-btn">← Return to Archivum</button>`;
    
    html += filtered.map(story => `
        <div class="card">
            <h3>${story.title}</h3>
            <p><strong>Author:</strong> ${story.author}</p>
            <p>${story.description}</p>
        </div>
    `).join('');
    
    grid.innerHTML = html;
}

loadLoreData();
