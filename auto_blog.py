from openai import OpenAI
from supabase import create_client, Client
import os
import time
import json
import uuid
from datetime import datetime
import re

# --- 1. CẤU HÌNH (THAY THÔNG TIN CỦA ANH VÀO ĐÂY) ---
DEEPSEEK_API_KEY = "sk-d14761881cdd4d7e9c610485577e6a8d" # Dán Key DeepSeek của anh vào đây
SUPABASE_URL = "https://ukkfurbyqajnmmoxftjh.supabase.co".strip()
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVra2Z1cmJ5cWFqbm1tb3hmdGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDIwMjksImV4cCI6MjA4Mzk3ODAyOX0.IHm6gOXkQTKBw3DwTJWr6pEf6GL2ksVf_XiXI-9lbOI".strip() # Key bắt đầu bằng eyJ...)
# --- 2. KẾT NỐI ---
client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_json(text):
    text = text.replace("```json", "").replace("```", "")
    return text.strip()

# Hàm tạo Slug (Đường dẫn thân thiện) từ Tiêu đề
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
    return slug + "-" + str(int(time.time())) # Thêm số đuôi để không bị trùng

print("✍️  CHÀO MỪNG ĐẾN VỚI TÒA SOẠN BÁO AI - VIBE DIGITAL")
print("-" * 50)

while True:
    topic = input("\n👉 Nhập chủ đề anh muốn viết (hoặc gõ 'exit' để thoát): ")
    
    if topic.lower() == 'exit':
        break
        
    print(f"\n⏳ Đang bảo DeepSeek viết bài về: '{topic}'... (Chờ khoảng 20s nhé)")
    
    # 1. Prompt cho DeepSeek
    prompt = f"""
    Viết một bài Blog chuẩn SEO cho Website bán tài nguyên Video Editor.
    Chủ đề: "{topic}"
    
    Yêu cầu trả về JSON duy nhất:
    {{
        "title": "Tiêu đề bài viết hấp dẫn, giật gân (Tiếng Việt)",
        "excerpt": "Mô tả ngắn gọn (Sapo) khoảng 2-3 câu để hiện ở danh sách.",
        "content": "Nội dung bài viết chi tiết dạng HTML.",
        "image_prompt": "Một câu mô tả tiếng Anh ngắn gọn về chủ đề này để AI vẽ ảnh (Ví dụ: cinematic camera lens, neon lighting)"
    }}
    
    Yêu cầu phần 'content' (HTML):
    - Dùng thẻ <h2> cho các mục chính.
    - Dùng <p> cho đoạn văn.
    - Dùng <ul>, <li> cho danh sách.
    - Viết giọng văn chuyên gia, chia sẻ kinh nghiệm thực tế.
    - Độ dài: Khoảng 500-800 từ.
    - Có kêu gọi hành động (Call to Action) ở cuối bài dẫn về trang chủ.
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            stream=False
        )
        
        # 2. Xử lý dữ liệu từ AI
        blog_data = json.loads(clean_json(response.choices[0].message.content))
        
        # 3. Tự động tạo ảnh bìa bằng AI (Pollinations)
        img_prompt = blog_data['image_prompt'].replace(" ", "%20")
        fake_image_url = f"https://image.pollinations.ai/prompt/{img_prompt}?width=800&height=500&nologo=true"
        
        # 4. Chuẩn bị dữ liệu DB (Dùng bảng 'Post' - Chữ hoa P theo schema cũ)
        # Lưu ý: Nếu Database anh dùng tên bảng là 'Post' thì giữ nguyên, nếu lỗi thì sửa thành 'posts'
        final_data = {
            "id": str(uuid.uuid4()),
            "title": blog_data['title'],
            "slug": create_slug(blog_data['title']),
            "excerpt": blog_data['excerpt'],
            "content": blog_data['content'],
            "thumbnail": fake_image_url,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # 5. Upload lên Supabase
        # Bảng 'posts' (viết thường) đã được định nghĩa trong Schema
        supabase.table("posts").insert(final_data).execute()
             
        print(f"✅ ĐÃ ĐĂNG BÀI THÀNH CÔNG!")
        print(f"📄 Tiêu đề: {final_data['title']}")
        print(f"🖼️ Ảnh AI tự vẽ: {final_data['thumbnail']}")
        
    except Exception as e:
        print(f"❌ Lỗi rồi anh ơi: {e}")
        
    print("-" * 50)

print("👋 Bye anh!")