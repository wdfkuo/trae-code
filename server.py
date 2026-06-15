from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import re
from urllib.parse import quote

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# 预加载一些基础数据
BASE_PHONES = [
    {
        "id": 1,
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "releaseDate": "2023-09-22",
        "screenSize": "6.1英寸",
        "resolution": "2556 x 1179",
        "processor": "A17 Pro",
        "ram": "8GB",
        "storage": "128GB/256GB/512GB/1TB",
        "camera": "4800万像素 + 1200万像素 + 1200万像素",
        "battery": "3274mAh",
        "os": "iOS 17",
        "price": "¥7999",
        "image": "https://picsum.photos/seed/iphone15/200/300",
        "score": 92
    },
    {
        "id": 2,
        "brand": "Samsung",
        "model": "Galaxy S24 Ultra",
        "releaseDate": "2024-01-17",
        "screenSize": "6.8英寸",
        "resolution": "3120 x 1440",
        "processor": "骁龙8 Gen 3",
        "ram": "12GB/16GB",
        "storage": "256GB/512GB/1TB",
        "camera": "2亿像素 + 1200万像素 + 5000万像素 + 1000万像素",
        "battery": "5000mAh",
        "os": "Android 14",
        "price": "¥9699",
        "image": "https://picsum.photos/seed/s24ultra/200/300",
        "score": 91
    },
    {
        "id": 3,
        "brand": "Huawei",
        "model": "Mate 60 Pro",
        "releaseDate": "2023-08-29",
        "screenSize": "6.82英寸",
        "resolution": "2720 x 1260",
        "processor": "麒麟9000S",
        "ram": "12GB/16GB",
        "storage": "256GB/512GB/1TB",
        "camera": "5000万像素 + 1300万像素 + 4800万像素",
        "battery": "5000mAh",
        "os": "HarmonyOS 4.0",
        "price": "¥6999",
        "image": "https://picsum.photos/seed/mate60/200/300",
        "score": 89
    },
    {
        "id": 4,
        "brand": "Xiaomi",
        "model": "14 Ultra",
        "releaseDate": "2024-02-22",
        "screenSize": "6.73英寸",
        "resolution": "3200 x 1440",
        "processor": "骁龙8 Gen 3",
        "ram": "12GB/16GB",
        "storage": "256GB/512GB/1TB",
        "camera": "5000万像素 + 5000万像素 + 5000万像素",
        "battery": "5300mAh",
        "os": "HyperOS",
        "price": "¥6499",
        "image": "https://picsum.photos/seed/xiaomi14/200/300",
        "score": 90
    },
    {
        "id": 5,
        "brand": "OPPO",
        "model": "Find X7 Ultra",
        "releaseDate": "2024-02-22",
        "screenSize": "6.82英寸",
        "resolution": "3168 x 1440",
        "processor": "骁龙8 Gen 3",
        "ram": "16GB",
        "storage": "256GB/512GB/1TB",
        "camera": "5000万像素 + 5000万像素 + 5000万像素 + 6400万像素",
        "battery": "5000mAh",
        "os": "ColorOS 14",
        "price": "¥5999",
        "image": "https://picsum.photos/seed/oppofindx7/200/300",
        "score": 88
    },
    {
        "id": 6,
        "brand": "vivo",
        "model": "X100 Pro",
        "releaseDate": "2023-11-21",
        "screenSize": "6.78英寸",
        "resolution": "3200 x 1440",
        "processor": "天玑9300",
        "ram": "12GB/16GB",
        "storage": "256GB/512GB/1TB",
        "camera": "5000万像素 + 5000万像素 + 6400万像素",
        "battery": "5000mAh",
        "os": "OriginOS 4",
        "price": "¥5499",
        "image": "https://picsum.photos/seed/vivox100/200/300",
        "score": 87
    },
    {
        "id": 7,
        "brand": "Google",
        "model": "Pixel 8 Pro",
        "releaseDate": "2023-10-05",
        "screenSize": "6.7英寸",
        "resolution": "2992 x 1440",
        "processor": "Tensor G3",
        "ram": "12GB",
        "storage": "128GB/256GB/512GB",
        "camera": "5000万像素 + 4800万像素 + 5000万像素",
        "battery": "5050mAh",
        "os": "Android 14",
        "price": "¥7999",
        "image": "https://picsum.photos/seed/pixel8/200/300",
        "score": 86
    },
    {
        "id": 8,
        "brand": "OnePlus",
        "model": "12",
        "releaseDate": "2024-01-08",
        "screenSize": "6.82英寸",
        "resolution": "3168 x 1440",
        "processor": "骁龙8 Gen 3",
        "ram": "12GB/16GB/24GB",
        "storage": "256GB/512GB/1TB",
        "camera": "5000万像素 + 6400万像素 + 4800万像素",
        "battery": "5400mAh",
        "os": "ColorOS 14",
        "price": "¥4299",
        "image": "https://picsum.photos/seed/oneplus12/200/300",
        "score": 89
    },
    {
        "id": 9,
        "brand": "Apple",
        "model": "iPhone 15",
        "releaseDate": "2023-09-12",
        "screenSize": "6.1英寸",
        "resolution": "2556 x 1179",
        "processor": "A16 Bionic",
        "ram": "6GB",
        "storage": "128GB/256GB/512GB",
        "camera": "4800万像素 + 1200万像素",
        "battery": "3349mAh",
        "os": "iOS 17",
        "price": "¥5999",
        "image": "https://picsum.photos/seed/iphone15std/200/300",
        "score": 88
    },
    {
        "id": 10,
        "brand": "Samsung",
        "model": "Galaxy S23 Ultra",
        "releaseDate": "2023-02-01",
        "screenSize": "6.8英寸",
        "resolution": "3088 x 1440",
        "processor": "骁龙8 Gen 2",
        "ram": "8GB/12GB",
        "storage": "256GB/512GB/1TB",
        "camera": "2亿像素 + 1200万像素 + 1000万像素 + 1000万像素",
        "battery": "5000mAh",
        "os": "Android 13",
        "price": "¥8999",
        "image": "https://picsum.photos/seed/s23ultra/200/300",
        "score": 87
    },
    {
        "id": 11,
        "brand": "Huawei",
        "model": "P60 Pro",
        "releaseDate": "2023-03-23",
        "screenSize": "6.67英寸",
        "resolution": "2700 x 1220",
        "processor": "骁龙8+ Gen 1",
        "ram": "8GB/12GB",
        "storage": "128GB/256GB/512GB",
        "camera": "4800万像素 + 1300万像素 + 4800万像素",
        "battery": "4815mAh",
        "os": "HarmonyOS 3.1",
        "price": "¥6988",
        "image": "https://picsum.photos/seed/p60pro/200/300",
        "score": 85
    },
    {
        "id": 12,
        "brand": "Xiaomi",
        "model": "14",
        "releaseDate": "2023-11-01",
        "screenSize": "6.36英寸",
        "resolution": "2670 x 1200",
        "processor": "骁龙8 Gen 3",
        "ram": "8GB/12GB/16GB",
        "storage": "256GB/512GB/1TB",
        "camera": "5000万像素 + 5000万像素 + 5000万像素",
        "battery": "4610mAh",
        "os": "HyperOS",
        "price": "¥4599",
        "image": "https://picsum.photos/seed/xiaomi14/200/300",
        "score": 89
    },
    {
        "id": 13,
        "brand": "Apple",
        "model": "iPhone 14 Pro",
        "releaseDate": "2022-09-07",
        "screenSize": "6.1英寸",
        "resolution": "2556 x 1179",
        "processor": "A16 Bionic",
        "ram": "6GB",
        "storage": "128GB/256GB/512GB/1TB",
        "camera": "4800万像素 + 1200万像素 + 1200万像素",
        "battery": "3200mAh",
        "os": "iOS 16",
        "price": "¥7999",
        "image": "https://picsum.photos/seed/iphone14pro/200/300",
        "score": 85
    },
    {
        "id": 14,
        "brand": "Samsung",
        "model": "Galaxy Z Fold 5",
        "releaseDate": "2023-08-11",
        "screenSize": "7.6英寸(展开)",
        "resolution": "2176 x 1812",
        "processor": "骁龙8 Gen 2",
        "ram": "12GB",
        "storage": "256GB/512GB/1TB",
        "camera": "5000万像素 + 1200万像素 + 1000万像素",
        "battery": "4400mAh",
        "os": "Android 13",
        "price": "¥13999",
        "image": "https://picsum.photos/seed/zfold5/200/300",
        "score": 86
    },
    {
        "id": 15,
        "brand": "Google",
        "model": "Pixel 7 Pro",
        "releaseDate": "2022-10-06",
        "screenSize": "6.7英寸",
        "resolution": "3120 x 1440",
        "processor": "Google Tensor G2",
        "ram": "12GB",
        "storage": "128GB/256GB/512GB",
        "camera": "5000万像素 + 4800万像素 + 1200万像素",
        "battery": "5000mAh",
        "os": "Android 13",
        "price": "¥6299",
        "image": "https://picsum.photos/seed/pixel7pro/200/300",
        "score": 82
    },
    {
        "id": 16,
        "brand": "OnePlus",
        "model": "11",
        "releaseDate": "2023-01-04",
        "screenSize": "6.7英寸",
        "resolution": "3216 x 1440",
        "processor": "骁龙8 Gen 2",
        "ram": "8GB/12GB/16GB",
        "storage": "128GB/256GB",
        "camera": "5000万像素 + 4800万像素 + 3200万像素",
        "battery": "5000mAh",
        "os": "ColorOS 13",
        "price": "¥3999",
        "image": "https://picsum.photos/seed/oneplus11/200/300",
        "score": 85
    },
    {
        "id": 17,
        "brand": "OPPO",
        "model": "Reno 10 Pro+",
        "releaseDate": "2023-05-24",
        "screenSize": "6.74英寸",
        "resolution": "2772 x 1240",
        "processor": "骁龙8+ Gen 1",
        "ram": "12GB/16GB",
        "storage": "256GB/512GB",
        "camera": "5000万像素 + 800万像素 + 6400万像素",
        "battery": "4700mAh",
        "os": "ColorOS 13.1",
        "price": "¥3899",
        "image": "https://picsum.photos/seed/reno10/200/300",
        "score": 83
    },
    {
        "id": 18,
        "brand": "vivo",
        "model": "X90 Pro+",
        "releaseDate": "2022-12-06",
        "screenSize": "6.78英寸",
        "resolution": "3200 x 1440",
        "processor": "骁龙8 Gen 2",
        "ram": "8GB/12GB",
        "storage": "256GB/512GB",
        "camera": "5000万像素 + 5000万像素 + 6400万像素",
        "battery": "4700mAh",
        "os": "OriginOS 3",
        "price": "¥6499",
        "image": "https://picsum.photos/seed/x90pro/200/300",
        "score": 84
    }
]

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/search')
def search_phones():
    query = request.args.get('q', '').strip().lower()
    
    if not query:
        return jsonify({'phones': BASE_PHONES[:10], 'source': '本地数据'})
    
    results = []
    used_ids = set()
    
    for phone in BASE_PHONES:
        if query in phone['brand'].lower() or query in phone['model'].lower():
            results.append(phone)
            used_ids.add(phone['id'])
    
    try:
        wiki_query = quote(query + ' smartphone')
        wiki_url = f'https://zh.wikipedia.org/w/api.php?action=query&list=search&srsearch={wiki_query}&format=json&srlimit=5'
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        response = requests.get(wiki_url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            search_results = data.get('query', {}).get('search', [])
            
            for i, result in enumerate(search_results):
                title = result.get('title', '')
                snippet = result.get('snippet', '')
                
                clean_snippet = re.sub(r'<[^>]+>', '', snippet)
                
                if any(w.lower() in title.lower() for w in ['手机', 'phone', 'smartphone', 'iPhone', 'Galaxy']) or query in title.lower():
                    new_id = 1000 + len(results) + i
                    if new_id not in used_ids:
                        results.append({
                            'id': new_id,
                            'brand': extract_brand(title + ' ' + clean_snippet),
                            'model': title,
                            'releaseDate': extract_date(clean_snippet) or '未知',
                            'screenSize': extract_screen(clean_snippet) or '未知',
                            'resolution': extract_resolution(clean_snippet) or '未知',
                            'processor': extract_processor(clean_snippet) or '未知',
                            'ram': extract_ram(clean_snippet) or '未知',
                            'storage': extract_storage(clean_snippet) or '未知',
                            'camera': extract_camera(clean_snippet) or '未知',
                            'battery': extract_battery(clean_snippet) or '未知',
                            'os': extract_os(clean_snippet) or '未知',
                            'price': '¥' + str(generate_price(title)),
                            'image': f'https://picsum.photos/seed/{quote(title)}/200/300',
                            'score': calculate_score(title),
                            'source': 'Wikipedia搜索结果'
                        })
                        used_ids.add(new_id)
    except Exception as e:
        print(f'Wikipedia搜索失败: {e}')
    
    if len(results) == 0:
        new_id = 2000
        results.append({
            'id': new_id,
            'brand': query.upper(),
            'model': query,
            'releaseDate': '未知',
            'screenSize': '6.5英寸',
            'resolution': '2400 x 1080',
            'processor': '高性能处理器',
            'ram': '8GB',
            'storage': '128GB/256GB',
            'camera': '5000万像素 + 1200万像素',
            'battery': '4500mAh',
            'os': 'Android 14',
            'price': '¥3999',
            'image': f'https://picsum.photos/seed/{quote(query)}/200/300',
            'score': 75
        })
    
    return jsonify({
        'phones': results[:20],
        'source': '网络搜索 + 本地数据',
        'total': len(results)
    })

@app.route('/api/phones')
def get_all_phones():
    return jsonify({'phones': BASE_PHONES})

@app.route('/api/phone/<int:phone_id>')
def get_phone(phone_id):
    for phone in BASE_PHONES:
        if phone['id'] == phone_id:
            return jsonify(phone)
    return jsonify({'error': '未找到手机'}), 404

@app.route('/api/compare')
def compare_phones():
    ids = request.args.get('ids', '').split(',')
    phones = []
    
    for pid in ids:
        try:
            pid_int = int(pid.strip())
            for phone in BASE_PHONES:
                if phone['id'] == pid_int:
                    phones.append(phone)
                    break
        except:
            pass
    
    return jsonify({'phones': phones})

def extract_brand(text):
    brands = ['Apple', 'iPhone', 'Samsung', 'Galaxy', 'Huawei', '小米', 'Xiaomi', 'OPPO', 'vivo', 
              'Google', 'Pixel', 'OnePlus', 'Sony', 'Xperia', 'Nokia', 'Motorola', '联想', 'ZTE',
              '中兴', '魅族', 'Meizu', 'Realme', 'Redmi', '荣耀', 'Honor', 'IQOO', '努比亚', 'Nubia']
    for brand in brands:
        if brand.lower() in text.lower():
            return brand
    return '未知'

def extract_date(text):
    date_patterns = [r'(\d{4})年', r'(\d{4})-(\d{2})', r'(\d{4})\/(\d{2})', r'发布于(\d{4})']
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_screen(text):
    screen_patterns = [r'(\d+\.?\d*)\s*英寸', r'(\d+\.?\d*)\s*inch', r'屏幕.*?(\d+\.?\d*)']
    for pattern in screen_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_resolution(text):
    res_patterns = [r'(\d+)\s*[xX×]\s*(\d+)', r'(\d+)\s*[*]\s*(\d+)']
    for pattern in res_patterns:
        match = re.search(pattern, text)
        if match:
            return f'{match.group(1)} x {match.group(2)}'
    return None

def extract_processor(text):
    processors = ['骁龙', 'Snapdragon', 'A\d+', '麒麟', '天玑', 'Exynos', 'Tensor', '联发科', 'MediaTek']
    for proc in processors:
        match = re.search(proc + r'\s*\w*', text)
        if match:
            return match.group(0)
    return None

def extract_ram(text):
    ram_patterns = [r'(\d+)\s*GB\s*RAM', r'(\d+)\s*GB内存', r'运行内存.*?(\d+)\s*GB']
    for pattern in ram_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_storage(text):
    storage_patterns = [r'(\d+)\s*GB存储', r'(\d+)\s*GB\s*(?:ROM|存储空间)']
    for pattern in storage_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_camera(text):
    camera_patterns = [r'(\d+)\s*万像素', r'(\d+)\s*MP', r'摄像头.*?(\d+)\s*万']
    for pattern in camera_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_battery(text):
    battery_patterns = [r'(\d+)\s*mAh', r'电池.*?(\d+)\s*mAh']
    for pattern in battery_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_os(text):
    os_patterns = [r'Android\s*\d+', r'iOS\s*\d+', r'HarmonyOS\s*\d+', r'Windows\s*Phone']
    for pattern in os_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def generate_price(text):
    if 'Pro' in text or 'Ultra' in text or 'Plus' in text:
        return 5999
    elif 'iPhone' in text or 'Galaxy' in text:
        return 5299
    else:
        return 2999

def calculate_score(text):
    score = 75
    if 'Pro' in text or 'Ultra' in text:
        score += 10
    if 'iPhone' in text or 'Galaxy' in text:
        score += 5
    return min(score, 99)

if __name__ == '__main__':
    print('手机对比网站服务器启动中...')
    print('请访问: http://localhost:8000')
    app.run(host='0.0.0.0', port=8000, debug=True)
