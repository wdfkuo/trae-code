const FIELDS = ['brand', 'model', 'releaseDate', 'screenSize', 'resolution', 'processor', 'ram', 'storage', 'camera', 'battery', 'os', 'price'];

let selectedPhones = [];

async function searchPhones(query) {
    const statusEl = document.getElementById('search-status');
    const sourceEl = document.getElementById('data-source');
    
    if (statusEl) {
        statusEl.textContent = '🔍 搜索中...';
        statusEl.classList.add('active');
    }
    
    try {
        const response = await fetch('/api/search?q=' + encodeURIComponent(query));
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();
        
        if (statusEl) {
            statusEl.textContent = '';
            statusEl.classList.remove('active');
        }
        
        if (sourceEl && data.source) {
            sourceEl.textContent = '📡 数据源: ' + data.source;
        }
        
        return data.phones || [];
    } catch (error) {
        console.error('搜索失败:', error);
        if (statusEl) {
            statusEl.textContent = '⚠️ 网络搜索失败，请重试';
            setTimeout(() => { statusEl.classList.remove('active'); }, 3000);
        }
        return [];
    }
}

async function loadAllPhones() {
    const grid = document.getElementById('popular-phones-grid');
    if (!grid) return;
    
    try {
        const response = await fetch('/api/phones');
        if (!response.ok) throw new Error('加载失败');
        const data = await response.json();
        
        renderPopularPhones(data.phones || []);
    } catch (error) {
        console.error('加载手机数据失败:', error);
        if (grid) {
            grid.innerHTML = '<div class="loading">加载失败，请刷新页面</div>';
        }
    }
}

function renderPopularPhones(phones) {
    const grid = document.getElementById('popular-phones-grid');
    if (!grid) return;
    
    if (!phones || phones.length === 0) {
        grid.innerHTML = '<div class="loading">暂无数据</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    phones.slice(0, 12).forEach(phone => {
        const card = document.createElement('div');
        card.className = 'popular-phone-card';
        card.innerHTML = `
            <img src="${phone.image}" alt="${phone.brand} ${phone.model}" onerror="this.src='https://picsum.photos/200/300'">
            <h4>${phone.brand} ${phone.model}</h4>
            <p class="price">${phone.price}</p>
            <div class="phone-score">⭐ ${phone.score}分</div>
        `;
        card.addEventListener('click', () => addPhone(phone));
        grid.appendChild(card);
    });
}

function addPhone(phone) {
    if (selectedPhones.length >= 2) {
        alert('最多只能比较两款手机！请先移除一款。');
        return;
    }
    
    if (selectedPhones.find(p => p.id === phone.id)) {
        alert('该手机已在对比列表中！');
        return;
    }
    
    selectedPhones.push(phone);
    updatePhoneCards();
    updateCompareResults();
    
    // 滚动到对比区域
    const compareSection = document.getElementById('compare');
    if (compareSection) {
        compareSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function removePhone(index) {
    selectedPhones.splice(index, 1);
    updatePhoneCards();
    updateCompareResults();
}

function updatePhoneCards() {
    for (let i = 0; i < 2; i++) {
        const card = document.getElementById('phone' + (i + 1));
        if (!card) continue;
        
        const phone = selectedPhones[i];
        const img = card.querySelector('img');
        const title = card.querySelector('h3');
        const desc = card.querySelector('p');
        
        if (phone) {
            img.src = phone.image;
            img.onerror = function() { this.src = 'https://picsum.photos/200/300'; };
            title.textContent = phone.brand + ' ' + phone.model;
            desc.textContent = phone.price;
        } else {
            img.src = 'https://picsum.photos/200/300';
            title.textContent = '选择手机';
            desc.textContent = '在上方搜索框搜索并点击添加';
        }
    }
}

function updateCompareResults() {
    // 更新表格标题
    for (let i = 0; i < 2; i++) {
        const col = document.getElementById('col' + (i + 1));
        const phone = selectedPhones[i];
        if (col) {
            col.textContent = phone ? (phone.brand + ' ' + phone.model) : ('手机 ' + (i + 1));
        }
    }
    
    // 更新表格内容
    FIELDS.forEach(field => {
        for (let i = 0; i < 2; i++) {
            const cell = document.getElementById(field + (i + 1));
            if (cell) {
                const phone = selectedPhones[i];
                cell.textContent = phone ? phone[field] : '-';
            }
        }
    });
    
    // 更新评分
    for (let i = 0; i < 2; i++) {
        const scoreEl = document.querySelector('#rating' + (i + 1) + ' .score');
        const nameEl = document.getElementById('rating-name-' + (i + 1));
        const phone = selectedPhones[i];
        
        if (scoreEl) {
            scoreEl.textContent = phone ? phone.score : 0;
        }
        if (nameEl) {
            nameEl.textContent = phone ? (phone.brand + ' ' + phone.model) : '未选择';
        }
    }
}

// 搜索功能
const searchInput = document.getElementById('search1');
const suggestionsDiv = document.getElementById('suggestions1');

if (searchInput && suggestionsDiv) {
    let searchTimeout = null;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        clearTimeout(searchTimeout);
        
        if (query.length === 0) {
            suggestionsDiv.classList.remove('active');
            suggestionsDiv.innerHTML = '';
            return;
        }
        
        // 延迟搜索，避免频繁请求
        searchTimeout = setTimeout(async () => {
            const phones = await searchPhones(query);
            
            suggestionsDiv.innerHTML = '';
            
            if (phones.length === 0) {
                const div = document.createElement('div');
                div.textContent = '未找到相关手机，试试其他关键词';
                div.style.cursor = 'default';
                div.style.opacity = '0.6';
                suggestionsDiv.appendChild(div);
                suggestionsDiv.classList.add('active');
                return;
            }
            
            phones.slice(0, 8).forEach(phone => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${phone.brand} ${phone.model}</strong>
                    <span style="color: #667eea; margin-left: 10px;">${phone.price}</span>
                    <span style="color: #28a745; margin-left: 10px;">⭐ ${phone.score}分</span>
                `;
                div.addEventListener('click', () => {
                    addPhone(phone);
                    searchInput.value = '';
                    suggestionsDiv.classList.remove('active');
                });
                suggestionsDiv.appendChild(div);
            });
            
            suggestionsDiv.classList.add('active');
        }, 300);
    });
    
    // 点击页面其他地方关闭建议
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.remove('active');
        }
    });
    
    // 回车键快速添加第一个结果
    searchInput.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim().toLowerCase();
            if (query.length > 0) {
                const phones = await searchPhones(query);
                if (phones.length > 0) {
                    addPhone(phones[0]);
                    this.value = '';
                    suggestionsDiv.classList.remove('active');
                }
            }
        }
    });
}

// 页面加载完成后加载热门手机
document.addEventListener('DOMContentLoaded', loadAllPhones);
