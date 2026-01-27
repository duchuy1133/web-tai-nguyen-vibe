from openai import OpenAI
from supabase import create_client, Client
import os
import time
import json
import uuid
from datetime import datetime
import re
import sys
import requests # Thư viện mới để gọi Facebook

# --- 1. CẤU HÌNH HỆ THỐNG ---

# Token Face & ID Page (Của anh vừa gửi)
FB_PAGE_ACCESS_TOKEN = "EAANNbe4rjMIBQjSzRvsOHz2tSkX1dVVLenfJTF1SWOAzNIvZC0fWfZCIOfPuHKDNQp3SZA5FrRhppVaZBRowJIky3CrrSMrA10Rg8WgBriDXjvcAktNzZBFaCwH4Boawo2PmiqMwwZBZAaNRhu0Jdz0Mg12tAowNeR6adYmSB2cGgwa2LEkGtzghyQlARubSZBMZArGKJnXFDNcA2i3N3dzNk"
FB_PAGE_ID = "456629970860389"

# Cấu hình Website & AI
WEBSITE_DOMAIN = "http://localhost:3000"  # Sau này có tên miền thật (vd: vibedigital.vn) thì sửa ở đây
DEEPSEEK_API_KEY = "sk-d14761881cdd4d7e9c610485577e6a8d" 

# Cấu hình Database (Em đã thay lại KEY SERVICE ROLE xịn để có quyền ghi dữ liệu)
SUPABASE_URL = "https://ukkfurbyqajnmmoxftjh.supabase.co".strip()
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVra2Z1cmJ5cWFqbm1tb3hmdGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDIwMjksImV4cCI6MjA4Mzk3ODAyOX0.IHm6gOXkQTKBw3DwTJWr6pEf6GL2ksVf_XiXI-9lbOI".strip() # Key bắt đầu bằng eyJ...)

# --- 2. KẾT NỐI ---
try:
    client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"❌ LỖI KẾT NỐI HỆ THỐNG: {e}")
    input("Bấm Enter để thoát...")
    sys.exit()

def clean_json(text):
    text = text.replace("```json", "").replace("```", "")
    return text.strip()

def create_slug(title):
    slug = title.lower()
    slug = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', slug)
    slug = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', slug)
    slug = re.sub(r'[oòóọỏõôồốộổỗơờớợởỡ]', 'o', slug)
    slug = re.sub(r'[uùúụủũưừứựửữ]', 'u', slug)
    slug = re.sub(r'[iìíịỉĩ]', 'i', slug)
    slug = re.sub(r'[yỳýỵỷỹ]', 'y', slug)
    slug = re.sub(r'[đ]', 'd', slug)
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug + "-" + str(int(time.time()))

def post_to_facebook(title, excerpt, image_url, slug):
    """Hàm đăng bài lên Fanpage"""
    try:
        url = f"https://graph.facebook.com/{FB_PAGE_ID}/photos"
        
        # Nội dung bài đăng trên Face
        message = f"🔥 {title}\n\n{excerpt}\n\n👉 Tải xuống ngay tại: {WEBSITE_DOMAIN}/blog/{slug}\n\n#VibeDigital #VideoEditing #TaiNguyenMienPhi"
        
        payload = {
            'url': image_url, # Facebook tự tải ảnh từ Link này
            'caption': message,
            'access_token': FB_PAGE_ACCESS_TOKEN
        }
        
        response = requests.post(url, data=payload)
        
        if response.status_code == 200:
            print("✅ Đã bắn sang Fanpage thành công!")
        else:
            print(f"⚠️ Lỗi đăng Face: {response.text}")
            
    except Exception as e:
        print(f"⚠️ Không đăng được lên Face: {e}")

# --- CHƯƠNG TRÌNH CHÍNH ---
print("\n" + "="*50)
print("🤖  AUTO BLOGGER V3 - WEB + FACEBOOK (FULL FIX)")
print("="*50)

# 1. Đọc file topics.txt
try:
    with open('topics.txt', 'r', encoding='utf-8') as f:
        topics = [line.strip() for line in f if line.strip()]
except FileNotFoundError:
    print("❌ Lỗi: Không tìm thấy file 'topics.txt'!")
    input("Bấm Enter để thoát...")
    sys.exit()

if not topics:
    print("⚠️ File 'topics.txt' đang trống!")
    input("Bấm Enter để thoát...")
    sys.exit()

print(f"📋 Tìm thấy {len(topics)} chủ đề.")
print("🚀 Bắt đầu chiến dịch phủ sóng mạng xã hội...\n")

success_count = 0

for index, topic in enumerate(topics, 1):
    print("-" * 50)
    print(f"Process [{index}/{len(topics)}]: {topic}")
    
    try:
        # --- A. VIẾT BÀI ---
        prompt = f"""
        Bạn là Chuyên gia Content Marketing cho VibeDigital.
        Chủ đề: "{topic}".
        
        QUY TẮC LINK NỘI BỘ:
        Chèn ít nhất 3 thẻ <a> trỏ về các category (plugin, template, luts, sound).
        
        Trả về JSON:
        {{
            "title": "Tiêu đề hấp dẫn (Tiếng Việt)",
            "excerpt": "Sapo 2 câu kịch tính.",
            "content": "Nội dung HTML chi tiết.",
            "image_prompt": "Mô tả ảnh tiếng Anh ngắn gọn"
        }}
        """
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            stream=False
        )
        
        blog_data = json.loads(clean_json(response.choices[0].message.content))
        
        # --- B. VẼ ẢNH ---
        img_prompt = blog_data['image_prompt'].replace(" ", "%20")
        fake_image_url = f"https://image.pollinations.ai/prompt/{img_prompt}?width=800&height=500&nologo=true"
        
        # --- C. UPLOAD WEB ---
        final_data = {
            "id": str(uuid.uuid4()),
            "title": blog_data['title'],
            "slug": create_slug(blog_data['title']),
            "excerpt": blog_data['excerpt'],
            "content": blog_data['content'],
            "thumbnail": fake_image_url,
            "created_at": datetime.utcnow().isoformat()
        }
        
        supabase.table("posts").insert(final_data).execute()
        print(f"✅ XONG WEB: {final_data['title']}")
        success_count += 1
        
        # --- D. ĐĂNG FACEBOOK ---
        print("⏳ Đang gửi sang Fanpage...")
        post_to_facebook(
            title=final_data['title'],
            excerpt=final_data['excerpt'],
            image_url=final_data['thumbnail'],
            slug=final_data['slug']
        )
        
    except Exception as e:
        print(f"❌ LỖI: {e}")

    # --- E. NGHỈ NGƠI ---
    if index < len(topics):
        print("💤 Nghỉ 30 giây (Tránh Facebook chặn spam)...")
        time.sleep(30)

print("\n" + "="*50)
print(f"🎉 HOÀN TẤT CHIẾN DỊCH! {success_count}/{len(topics)} bài.")
input("Bấm Enter để đóng cửa sổ...")