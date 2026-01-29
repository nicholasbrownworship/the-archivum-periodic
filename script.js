let loreData = []; // Start with an empty array

const storyGrid = document.getElementById('storyGrid');
const searchBar = document.getElementById('searchBar');

// 1. Fetch the data from your local file
async function loadLoreData() {
    try {
        const response = await fetch('data/stories.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        loreData = await response.json();
        displayStories(loreData); // Initial render
    } catch (error) {
        console.error('Error loading the Administratum files:', error);
        storyGrid.innerHTML = `<p style="color: red;">DATA CORRUPTION DETECTED: Unable to load stories.</p>`;
    }
}

// 2. The Display Logic (remains mostly the same)
function displayStories(stories) {
    if (stories.length === 0) {
        storyGrid.innerHTML = `<p>No records found in the Archivum.</p>`;
        return;
    }
    
    storyGrid.innerHTML = stories.map(story => `
        <div class="card">
            <span class="faction-tag">${story.primaryFaction}</span>
            <h3>${story.title}</h3>
            <p><strong>Author:</strong> ${story.author}</p>
            <p class="sub-faction"><em>Sub-faction: ${story.subFaction}</em></p>
            <p class="description">${story.description}</p>
        </div>
    `).join('');
}

// 3. The Search Logic
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredStories = loreData.filter(story => {
        return (
            story.title.toLowerCase().includes(searchString) ||
            story.primaryFaction.toLowerCase().includes(searchString) ||
            story.author.toLowerCase().includes(searchString)
        );
    });
    displayStories(filteredStories);
});

// Initialize the app
loadLoreData();
