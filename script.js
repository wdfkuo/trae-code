const searchInput = document.getElementById('search1');
const suggestionsDiv = document.getElementById('suggestions1');
const phonesContainer = document.getElementById('phones-container');
const popularPhonesGrid = document.getElementById('popular-phones-grid');
const searchStatus = document.getElementById('search-status');
const dataSource = document.getElementById('data-source');

let selectedPhones = [];
let allPhones = [];

async function searchPhones(query) {
    try {
        if (searchStatus) {
            searchStatus.textContent = '正在网络搜索中...';
            searchStatus.classList.add('active');
        }
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (searchStatus) {
            searchStatus.textContent = '';
            searchStatus.classList.remove('active');
        }
        
        if (dataSource && data.source) {
            dataSource.textContent = `数据源: ${data.source}`;
        }
        
        allPhones = data.phones;
        return data.phones;
    } catch (error) {
        console.error('搜索失败:', error);
        if (searchStatus) {
            searchStatus.textContent = '网络搜索失败，使用本地数据';
            setTimeout(() => {
                searchStatus.classList.remove('active');
            }, 3000);
        }
        return [];
    }
}

async function loadAllPhones() {
    try {
        const response = await fetch('/api/phones');
        const data = await response.json();
        allPhones = data.phones;
        renderPopularPhones();
    } catch (error) {
        console.error('加载手机数据失败:', error);
    }
}

searchInput.addEventListener('input', async function() {
    const query = this.value.toLowerCase().trim();
    
    if (query.length > 0) {
        const phones = await searchPhones(query);
        
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.add('active');
        
        if (phones.length === 0) {
            const div = document.createElement('div');
            div.textContent = '未找到相关手机';
            div.style.cursor = 'default';
            suggestionsDiv.appendChild(div);
        } else {
            phones.forEach(phone => {
                const div = document.createElement('div');
                div.textContent = `${phone.brand} ${phone.model} - ${phone.price}`;
                div.addEventListener('click', function() {
                    addPhone(phone);
                    searchInput.value = '';
                    suggestionsDiv.classList.remove('active');
                });
                suggestionsDiv.appendChild(div);
            });
        }
    } else {
        suggestionsDiv.classList.remove('active');
    }
});

document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.classList.remove('active');
    }
});

function addPhone(phone) {
    if (selectedPhones.length >= 2) {
        alert('最多只能比较两款手机');
        return;
    }
    
    if (selectedPhones.find(p => p.id === phone.id)) {
        alert('该手机已被选中');
        return;
    }
    
    selectedPhones.push(phone);
    updatePhoneCards();
    updateCompareResults();
}

function removePhone(index) {
    selectedPhones.splice(index, 1);
    updatePhoneCards();
    updateCompareResults();
}

function updatePhoneCards() {
    const phone1Card = document.getElementById('phone1');
    const phone2Card = document.getElementById('phone2');
    
    if (selectedPhones[0]) {
        phone1Card.querySelector('.phone-image img').src = selectedPhones[0].image;
        phone1Card.querySelector('.phone-info h3').textContent = `${selectedPhones[0].brand} ${selectedPhones[0].model}`;
        phone1Card.querySelector('.phone-info p').textContent = selectedPhones[0].price;
    } else {
        phone1Card.querySelector('.phone-image img').src = 'https://picsum.photos/200/300';
        phone1Card.querySelector('.phone-info h3').textContent = '选择手机';
        phone1Card.querySelector('.phone-info p').textContent = '点击上方搜索框添加手机';
    }
    
    if (selectedPhones[1]) {
        phone2Card.querySelector('.phone-image img').src = selectedPhones[1].image;
        phone2Card.querySelector('.phone-info h3').textContent = `${selectedPhones[1].brand} ${selectedPhones[1].model}`;
        phone2Card.querySelector('.phone-info p').textContent = selectedPhones[1].price;
    } else {
        phone2Card.querySelector('.phone-image img').src = 'https://picsum.photos/200/300';
        phone2Card.querySelector('.phone-info h3').textContent = '选择手机';
        phone2Card.querySelector('.phone-info p').textContent = '点击上方搜索框添加手机';
    }
}

function updateCompareResults() {
    const fields = ['brand', 'model', 'releaseDate', 'screenSize', 'resolution', 'processor', 'ram', 'storage', 'camera', 'battery', 'os', 'price'];
    
    fields.forEach(field => {
        for (let i = 0; i < 2; i++) {
            const cell = document.getElementById(field + (i + 1));
            const phone = selectedPhones[i];
            cell.textContent = phone ? phone[field] : '-';
        }
    });
    
    for (let i = 0; i < 2; i++) {
        const colHeader = document.getElementById('col' + (i + 1));
        const phone = selectedPhones[i];
        colHeader.textContent = phone ? `${phone.brand} ${phone.model}` : `手机 ${i + 1}`;
    }
    
    for (let i = 0; i < 2; i++) {
        const ratingCard = document.getElementById('rating' + (i + 1));
        if (ratingCard) {
            const score = selectedPhones[i] ? selectedPhones[i].score : 0;
            ratingCard.querySelector('.score').textContent = score;
        }
    }
}

function renderPopularPhones() {
    popularPhonesGrid.innerHTML = '';
    
    allPhones.slice(0, 12).forEach(phone => {
        const card = document.createElement('div');
        card.className = 'popular-phone-card';
        card.innerHTML = `
            <img src="${phone.image}" alt="${phone.brand} ${phone.model}">
            <h4>${phone.brand} ${phone.model}</h4>
            <p>${phone.price}</p>
            <div class="phone-score">评分: ${phone.score}</div>
        `;
        card.addEventListener('click', function() {
            addPhone(phone);
        });
        popularPhonesGrid.appendChild(card);
    });
}

document.getElementById('phone1').querySelector('.remove-btn').addEventListener('click', function() {
    removePhone(0);
});

document.getElementById('phone2').querySelector('.remove-btn').addEventListener('click', function() {
    removePhone(1);
});

loadAllPhones();
