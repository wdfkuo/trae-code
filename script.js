const phonesData = [
    {
        id: 1,
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        releaseDate: '2023-09-22',
        screenSize: '6.1英寸',
        resolution: '2556 x 1179',
        processor: 'A17 Pro',
        ram: '8GB',
        storage: '128GB/256GB/512GB/1TB',
        camera: '4800万像素 + 1200万像素 + 1200万像素',
        battery: '3274mAh',
        os: 'iOS 17',
        price: '¥7999',
        image: 'https://picsum.photos/seed/iphone15/200/300',
        score: 92
    },
    {
        id: 2,
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        releaseDate: '2024-01-17',
        screenSize: '6.8英寸',
        resolution: '3120 x 1440',
        processor: '骁龙8 Gen 3',
        ram: '12GB/16GB',
        storage: '256GB/512GB/1TB',
        camera: '2亿像素 + 1200万像素 + 5000万像素 + 1000万像素',
        battery: '5000mAh',
        os: 'Android 14',
        price: '¥9699',
        image: 'https://picsum.photos/seed/s24ultra/200/300',
        score: 91
    },
    {
        id: 3,
        brand: 'Huawei',
        model: 'Mate 60 Pro',
        releaseDate: '2023-08-29',
        screenSize: '6.82英寸',
        resolution: '2720 x 1260',
        processor: '麒麟9000S',
        ram: '12GB/16GB',
        storage: '256GB/512GB/1TB',
        camera: '5000万像素 + 1300万像素 + 4800万像素',
        battery: '5000mAh',
        os: 'HarmonyOS 4.0',
        price: '¥6999',
        image: 'https://picsum.photos/seed/mate60/200/300',
        score: 89
    },
    {
        id: 4,
        brand: 'Xiaomi',
        model: '14 Ultra',
        releaseDate: '2024-02-22',
        screenSize: '6.73英寸',
        resolution: '3200 x 1440',
        processor: '骁龙8 Gen 3',
        ram: '12GB/16GB',
        storage: '256GB/512GB/1TB',
        camera: '5000万像素 + 5000万像素 + 5000万像素',
        battery: '5300mAh',
        os: 'HyperOS',
        price: '¥6499',
        image: 'https://picsum.photos/seed/xiaomi14/200/300',
        score: 90
    },
    {
        id: 5,
        brand: 'OPPO',
        model: 'Find X7 Ultra',
        releaseDate: '2024-02-22',
        screenSize: '6.82英寸',
        resolution: '3168 x 1440',
        processor: '骁龙8 Gen 3',
        ram: '16GB',
        storage: '256GB/512GB/1TB',
        camera: '5000万像素 + 5000万像素 + 5000万像素 + 6400万像素',
        battery: '5000mAh',
        os: 'ColorOS 14',
        price: '¥5999',
        image: 'https://picsum.photos/seed/oppofindx7/200/300',
        score: 88
    },
    {
        id: 6,
        brand: 'vivo',
        model: 'X100 Pro',
        releaseDate: '2023-11-21',
        screenSize: '6.78英寸',
        resolution: '3200 x 1440',
        processor: '天玑9300',
        ram: '12GB/16GB',
        storage: '256GB/512GB/1TB',
        camera: '5000万像素 + 5000万像素 + 6400万像素',
        battery: '5000mAh',
        os: 'OriginOS 4',
        price: '¥5499',
        image: 'https://picsum.photos/seed/vivox100/200/300',
        score: 87
    },
    {
        id: 7,
        brand: 'Google',
        model: 'Pixel 8 Pro',
        releaseDate: '2023-10-05',
        screenSize: '6.7英寸',
        resolution: '2992 x 1440',
        processor: 'Tensor G3',
        ram: '12GB',
        storage: '128GB/256GB/512GB',
        camera: '5000万像素 + 4800万像素 + 5000万像素',
        battery: '5050mAh',
        os: 'Android 14',
        price: '¥7999',
        image: 'https://picsum.photos/seed/pixel8/200/300',
        score: 86
    },
    {
        id: 8,
        brand: 'OnePlus',
        model: '12',
        releaseDate: '2024-01-08',
        screenSize: '6.82英寸',
        resolution: '3168 x 1440',
        processor: '骁龙8 Gen 3',
        ram: '12GB/16GB/24GB',
        storage: '256GB/512GB/1TB',
        camera: '5000万像素 + 6400万像素 + 4800万像素',
        battery: '5400mAh',
        os: 'ColorOS 14',
        price: '¥4299',
        image: 'https://picsum.photos/seed/oneplus12/200/300',
        score: 89
    }
];

const searchInput = document.getElementById('search1');
const suggestionsDiv = document.getElementById('suggestions1');
const phonesContainer = document.getElementById('phones-container');
const popularPhonesGrid = document.getElementById('popular-phones-grid');

let selectedPhones = [];

searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    if (query.length > 0) {
        const filteredPhones = phonesData.filter(phone => 
            phone.brand.toLowerCase().includes(query) || 
            phone.model.toLowerCase().includes(query)
        );
        
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.add('active');
        
        filteredPhones.forEach(phone => {
            const div = document.createElement('div');
            div.textContent = `${phone.brand} ${phone.model}`;
            div.addEventListener('click', function() {
                addPhone(phone);
                searchInput.value = '';
                suggestionsDiv.classList.remove('active');
            });
            suggestionsDiv.appendChild(div);
        });
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
    const cols = ['col1', 'col2'];
    const fields = ['brand', 'model', 'releaseDate', 'screenSize', 'resolution', 'processor', 'ram', 'storage', 'camera', 'battery', 'os', 'price'];
    
    fields.forEach(field => {
        cols.forEach((col, index) => {
            const cell = document.getElementById(field + (index + 1));
            const phone = selectedPhones[index];
            cell.textContent = phone ? phone[field] : '-';
        });
    });
    
    cols.forEach((col, index) => {
        const colHeader = document.getElementById(col);
        const phone = selectedPhones[index];
        colHeader.textContent = phone ? `${phone.brand} ${phone.model}` : `手机 ${index + 1}`;
    });
    
    document.getElementById('rating1').querySelector('.score').textContent = selectedPhones[0] ? selectedPhones[0].score : 0;
    document.getElementById('rating2').querySelector('.score').textContent = selectedPhones[1] ? selectedPhones[1].score : 0;
}

function renderPopularPhones() {
    popularPhonesGrid.innerHTML = '';
    
    phonesData.forEach(phone => {
        const card = document.createElement('div');
        card.className = 'popular-phone-card';
        card.innerHTML = `
            <img src="${phone.image}" alt="${phone.brand} ${phone.model}">
            <h4>${phone.brand} ${phone.model}</h4>
            <p>${phone.price}</p>
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

renderPopularPhones();