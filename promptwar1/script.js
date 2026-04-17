document.addEventListener('DOMContentLoaded', () => {

    // --- Splash Sequence ---
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(() => loader.remove(), 500);
        }
        initDashboard();
        initNavigation();
        initSearch();
        initChatbot();
    }, 1200);

});

// --- UI Features : Top Header ---
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    document.addEventListener('keydown', (e) => {
        if((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if(searchInput) searchInput.focus();
        }
    });

    // Close profile dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const profileMenu = document.querySelector('.profile-menu');
        const profileDropdown = document.getElementById('user-dropdown');
        if(profileMenu && profileDropdown && !profileMenu.contains(e.target)) {
            profileDropdown.classList.remove('open');
        }
    });
}

function toggleProfile() {
    const dropdown = document.getElementById('user-dropdown');
    if(dropdown) dropdown.classList.toggle('open');
}

// --- Deep Map Zooming Controls ---
let mapScale = 1;
function zoomMap(increment) {
    const map = document.getElementById('zoomable-map');
    if(!map) return;
    
    mapScale += increment;
    // Cap boundaries
    if(mapScale < 0.5) mapScale = 0.5;
    if(mapScale > 2.5) mapScale = 2.5;

    map.style.transform = `scale(${mapScale})`;
}

function resetMap() {
    const map = document.getElementById('zoomable-map');
    if(!map) return;
    mapScale = 1;
    map.style.transform = `scale(${mapScale})`;
}


// --- Venue AI Copilot ---
function toggleChat() {
    const chat = document.getElementById('chatbot-window');
    const input = document.getElementById('chat-field');
    if(chat) {
        chat.classList.toggle('open');
        if(chat.classList.contains('open') && input) input.focus();
    }
}

function initChatbot() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-field');
    const history = document.getElementById('chat-history');

    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if(!text) return;

        // User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'msg user';
        userMsg.innerHTML = `<p>${text}</p>`;
        history.appendChild(userMsg);
        
        input.value = '';
        history.scrollTop = history.scrollHeight;

        // Simulate AI Thinking
        const aiTyping = document.createElement('div');
        aiTyping.className = 'msg ai typing-indicator';
        aiTyping.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        history.appendChild(aiTyping);
        history.scrollTop = history.scrollHeight;

        // AI Response Logic
        setTimeout(() => {
            history.removeChild(aiTyping);
            
            const aiMsg = document.createElement('div');
            aiMsg.className = 'msg ai';
            
            // Mock responses
            const responses = [
                "I've logged that request in the operations tracker.",
                "Currently analyzing load distributions for Gate C. Waiting times are up 3%.",
                "Vendor status check initiated. Level 1 Pizza is operating at capacity.",
                "Understood. Rerouting digital signage paths to accommodate."
            ];
            const genericRes = responses[Math.floor(Math.random() * responses.length)];

            aiMsg.innerHTML = `<p>${genericRes}</p>`;
            history.appendChild(aiMsg);
            history.scrollTop = history.scrollHeight;

        }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
    });
}


// --- SPA Navigation ---
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.page-section');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('data-target');
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            const linkText = link.querySelector('span').innerText;
            if(linkText === "Overview") pageTitle.innerText = "Operations Overview";
            if(linkText === "Live Map") pageTitle.innerText = "Stadium Heatmap";
            if(linkText === "Concessions") pageTitle.innerText = "Vendor Status";
            if(linkText === "Crowd Control") pageTitle.innerText = "Security & Access";
            if(linkText === "Personnel") pageTitle.innerText = "Active Personnel Roster";

            if(window.innerWidth <= 1024) toggleSidebar();
        });
    });
}

function initDashboard() {
    initLiveChart();
    initSimulations();
    initCCTV();
    initSeats();
}

// --- AI CCTV Tracker Simulation ---
function initCCTV() {
    const aiBoxes = document.querySelectorAll('.ai-box');
    
    setInterval(() => {
        // Only run if Crowd Control page is active to save resources
        if(!document.getElementById('page-crowd').classList.contains('active')) return;

        aiBoxes.forEach(box => {
            // Jitter the boxes to simulate tracking
            const currentTop = parseFloat(box.style.top);
            const currentLeft = parseFloat(box.style.left);
            
            const dx = (Math.random() - 0.5) * 5; 
            const dy = (Math.random() - 0.5) * 5; 
            
            // Constrain
            let newTop = currentTop + dy;
            let newLeft = currentLeft + dx;
            
            if(newTop < 10) newTop = 10;
            if(newTop > 80) newTop = 80;
            if(newLeft < 10) newLeft = 10;
            if(newLeft > 80) newLeft = 80;

            box.style.top = `${newTop}%`;
            box.style.left = `${newLeft}%`;
            
            // Occasionally drop "Probability" metric
            const probSpan = box.querySelector('span');
            if(probSpan && Math.random() > 0.5) {
               probSpan.innerText = `P: ${(0.85 + Math.random() * 0.14).toFixed(2)}`;
            }
        });

    }, 300);
}

function initSeats() {
    const sectors = [
        { id: 'sector-N-lg', count: 180, color: 'var(--accent-orange)' },
        { id: 'sector-S-lg', count: 45, color: 'rgba(255,255,255,0.4)' },
        { id: 'sector-E-lg', count: 280, color: 'var(--accent-red)' }, // Congested
        { id: 'sector-W-lg', count: 120, color: 'var(--accent-orange)' }
    ];

    sectors.forEach(sec => {
        const zone = document.getElementById(sec.id);
        if(!zone) return;

        const oldSeats = zone.querySelectorAll('.seat-dot');
        oldSeats.forEach(s => s.remove());

        for(let i=0; i<sec.count; i++) {
            const dot = document.createElement('div');
            dot.className = 'seat-dot';
            
            // Randomly scatter within the stand borders
            const top = 12 + Math.random() * 76;
            const left = 12 + Math.random() * 76;
            
            dot.style.top = `${top}%`;
            dot.style.left = `${left}%`;
            dot.style.color = Math.random() > 0.8 ? '#fff' : sec.color; 
            dot.style.backgroundColor = dot.style.color;
            dot.style.animationDelay = `${Math.random() * 1.5}s`;
            dot.style.transform = `translateZ(${Math.random() * 5 + 3}px)`;

            zone.appendChild(dot);
        }
    });

    // Make seats randomly blink to simulate live crowd density flow
    setInterval(() => {
        if(!document.getElementById('page-map').classList.contains('active')) return;
        const allDots = document.querySelectorAll('.seat-dot');
        if(allDots.length === 0) return;
        
        for(let i=0; i<25; i++) {
            const randDot = allDots[Math.floor(Math.random() * allDots.length)];
            randDot.style.opacity = '0.1';
            setTimeout(() => randDot.style.opacity = '0.8', 400 + Math.random() * 600);
        }
    }, 1500);
}

function initLiveChart() {
    const chartContainer = document.getElementById('flow-chart');
    if(!chartContainer) return;

    const bars = 28; 
    for(let i=0; i<bars; i++) {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const height = Math.floor(Math.random() * 60) + 10;
        bar.style.height = `${height}%`;
        
        if(height > 50) bar.classList.add('filled');
        else bar.style.opacity = height / 100 + 0.3;

        chartContainer.appendChild(bar);
    }

    setInterval(() => {
        if(!document.getElementById('page-overview').classList.contains('active')) return;

        const children = chartContainer.children;
        chartContainer.removeChild(children[0]);

        const newBar = document.createElement('div');
        newBar.className = 'chart-bar';
        
        const isSpike = Math.random() > 0.7;
        const height = isSpike ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 50) + 10;
        
        newBar.style.height = '0%';
        if(height > 50) newBar.classList.add('filled');
        else newBar.style.opacity = height / 100 + 0.3;
        
        chartContainer.appendChild(newBar);

        setTimeout(() => { newBar.style.height = `${height}%`; }, 50);
    }, 2000);
}

function showSectorInfo(name, capacity, status) {
    let tooltip;
    let mapContainer;
    
    if(document.getElementById('page-map').classList.contains('active')) {
        tooltip = document.querySelector('#page-map #map-tooltip');
        mapContainer = document.querySelector('#page-map .minimal-map');
        document.querySelectorAll('#page-map .sector-zone').forEach(el => el.classList.remove('active-zone'));
        const activeZone = document.getElementById(`sector-${name.charAt(0)}-lg`);
        if(activeZone) activeZone.classList.add('active-zone');
    } else {
        tooltip = document.querySelector('#page-overview #map-tooltip');
        mapContainer = document.querySelector('#page-overview .minimal-map');
        document.querySelectorAll('#page-overview .sector-zone').forEach(el => el.classList.remove('active-zone'));
        const activeZone = document.getElementById(`sector-${name.charAt(0)}`);
        if(activeZone) activeZone.classList.add('active-zone');
    }
    
    if(!tooltip) return;

    tooltip.querySelector('#tt-name').innerText = `${name} Sector`;
    tooltip.querySelector('#tt-cap').innerText = capacity;
    tooltip.querySelector('#tt-stat').innerText = status;
    
    const statEl = tooltip.querySelector('#tt-stat');
    if(status === 'Congested') statEl.className = 'text-red';
    else if(status === 'Fluid') statEl.className = 'text-orange';
    else statEl.className = 'text-green';

    let activeDiv = document.getElementById(`sector-${name.charAt(0)}${document.getElementById('page-map').classList.contains('active') ? '-lg' : ''}`);
    
    if(activeDiv) {
        const rect = activeDiv.getBoundingClientRect();
        const mapRect = mapContainer.getBoundingClientRect();
        
        // Adjust tooltip position factoring in potential map zoom
        const dx = (rect.left - mapRect.left) + (rect.width / 2) - 75;
        const dy = (rect.top - mapRect.top) - 80;
        
        tooltip.style.left = `${dx}px`; 
        tooltip.style.top = `${dy}px`; 
    }

    tooltip.classList.add('visible');

    setTimeout(() => {
        tooltip.classList.remove('visible');
        if(activeDiv) activeDiv.classList.remove('active-zone');
    }, 4000);
}

let tasksRemaining = 3;

function completeTask(taskId) {
    const taskEl = document.getElementById(taskId);
    if(!taskEl) return;

    const btn = taskEl.querySelector('.btn-check');
    btn.style.background = 'var(--accent-green)';
    btn.style.color = 'white';
    btn.style.borderColor = 'var(--accent-green)';

    setTimeout(() => {
        taskEl.classList.add('done');
        
        setTimeout(() => {
            taskEl.style.display = 'none';
            tasksRemaining--;
            
            const badge = document.getElementById('inbox-badge');
            const alertCount = document.getElementById('alert-count');
            
            if(badge) badge.innerText = tasksRemaining;
            if(alertCount) alertCount.innerText = tasksRemaining;
            
            if(tasksRemaining === 0) {
                document.getElementById('inbox').style.display = 'none';
                if(badge) badge.style.display = 'none';
                document.getElementById('empty-inbox').style.display = 'flex';
                
                const alertCard = document.querySelector('.alert-border');
                if(alertCard) {
                    alertCard.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                    alertCard.querySelector('.pulse').classList.remove('text-red', 'pulse');
                    alertCard.querySelector('i.fa-bell').classList.add('text-green');
                    alertCard.querySelector('.trend').innerText = "All Clear";
                    alertCard.querySelector('.alert-pills').style.display = 'none';
                }
            }
        }, 300);
    }, 400); 
}

function initSimulations() {
    setInterval(() => {
        const waitSpan = document.getElementById('avg-wait');
        if(!waitSpan) return;
        
        let currentWait = parseInt(waitSpan.innerText);
        let newWait = currentWait + (Math.random() > 0.5 ? 1 : -1);
        newWait = Math.max(2, Math.min(newWait, 10));
        
        waitSpan.innerText = newWait;
        waitSpan.style.color = "var(--accent-orange)";
        
        setTimeout(() => { waitSpan.style.color = "inherit"; }, 500);
    }, 5000);
}

function triggerEvacuation() {
    const btn = document.querySelector('.btn-primary');
    if(btn.innerHTML.includes('Protocol')) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> System Optimized';
            btn.style.background = 'var(--accent-green)';
            btn.style.color = '#000';
            btn.style.boxShadow = '0 0 20px rgba(16,185,129,0.4)';
        }, 1500);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('open');
}
