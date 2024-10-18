async function fetchGitHubStats(repoName, cardId) {
    const apiUrl = `https://api.github.com/repos/aaronmcleancs/${repoName}/languages`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const totalLines = Object.values(data).reduce((a, b) => a + b, 0);
        
        document.querySelector(`#card${cardId} .line-count span`).textContent = totalLines.toLocaleString();
        
        const langBar = document.querySelector(`#langBar${cardId}`);
        langBar.innerHTML = '';
        
        for (const [lang, lines] of Object.entries(data)) {
            const percentage = (lines / totalLines) * 100;
            const langSegment = document.createElement('div');
            langSegment.className = 'lang-segment';
            langSegment.style.width = `${percentage}%`;
            langSegment.style.backgroundColor = getColorForLanguage(lang);
            langSegment.title = `${lang}: ${percentage.toFixed(1)}%`;
            langSegment.textContent = lang;
            langBar.appendChild(langSegment);
        }
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

function getColorForLanguage(lang) {
    const colors = {
        JavaScript: '#1C1C1C',     
        Python: '#191919',         
        HTML: '#161616',           
        CSS: '#040404',            
        Swift: '#141414',          
        'Objective-C': '#141414',  
        'C++': '#0F0F0F',          
        Java: '#222222',           
        C: '#353535',   
        Mermaid: '#000000'           
    };
    return colors[lang] || '#858585';
}
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats('CVV_15M_SARS-CoV-2', 1);
    fetchGitHubStats('RepBook-DemoServer', 2);
    fetchGitHubStats('ParticleBox', 3);
    fetchGitHubStats('SiteDeck', 4);
});

