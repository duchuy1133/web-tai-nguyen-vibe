from openai import OpenAI
from supabase import create_client, Client
import os
import time
import json
import uuid
from datetime import datetime

# --- 1. CẤU HÌNH (THAY THÔNG TIN CỦA ANH VÀO ĐÂY) ---
DEEPSEEK_API_KEY = "sk-d14761881cdd4d7e9c610485577e6a8d" # Dán Key DeepSeek của anh vào đây
SUPABASE_URL = "https://ukkfurbyqajnmmoxftjh.supabase.co".strip()
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVra2Z1cmJ5cWFqbm1tb3hmdGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDIwMjksImV4cCI6MjA4Mzk3ODAyOX0.IHm6gOXkQTKBw3DwTJWr6pEf6GL2ksVf_XiXI-9lbOI".strip() # Key bắt đầu bằng eyJ...)
# --- 2. KẾT NỐI ---
client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
folder_path = "./KHO_HANG" 

def clean_json(text):
    text = text.replace("```json", "").replace("```", "")
    return text.strip()

print(f"🚀 Bắt đầu quy trình TỰ ĐỘNG HÓA (PHIÊN BẢN PRO) tại: {folder_path}...\n")

try:
    files = [f for f in os.listdir(folder_path) if f.endswith('.zip')]
    
    for filename in files:
        print("-" * 50)
        print(f"📂 Đang xử lý: {filename}")
        
        # --- PROMPT MỚI: YÊU CẦU VIẾT DÀI VÀ FORMAT HTML ---
        prompt = f"""
        Tôi có file tài nguyên: "{filename}".
        Bạn là Copywriter hàng đầu Việt Nam. Hãy viết nội dung bán hàng thật CẢM XÚC, THÔI MIÊN người đọc.
        
        Nhiệm vụ: Trả về 1 chuỗi JSON duy nhất (để nạp vào Database).
        Cấu trúc JSON bắt buộc:
        {{
            "title": "Tên sản phẩm thật kêu, giật tít, chứa từ khóa (Tiếng Việt)",
            "description": "Nội dung HTML chi tiết",
            "price": 99000, 
            "category": "Plugin",
            "thumbnail_url": "https://via.placeholder.com/600x400?text=Premium+Asset", 
            "download_link": "https://drive.google.com/file/d/demo_link_fake"
        }}
        
        YÊU CẦU ĐẶC BIỆT CHO TRƯỜNG 'description':
        1. Phải viết dài (trên 300 chữ), chia thành các phần: Vấn đề, Giải pháp, Tính năng, Lợi ích.
        2. BẮT BUỘC dùng thẻ HTML để định dạng cho đẹp:
           - Dùng <h3> cho tiêu đề phụ.
           - Dùng <ul> và <li> cho danh sách tính năng.
           - Dùng <p> cho đoạn văn.
           - Dùng <strong> hoặc <b> để bôi đậm từ khóa.
        3. Văn phong: Hào hứng, dùng nhiều icon (🔥, ✅, 🚀), thúc giục mua hàng.
        
        YÊU CẦU VỀ GIÁ ('price'):
        - Hãy định giá ngẫu nhiên từ 69000 đến 199000 (VND). Đừng để giá quá cao.
        
        Lưu ý: Chỉ trả về JSON thuần, không giải thích gì thêm.
        """
        
        try:
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": prompt}],
                stream=False
            )
            
            product_data = json.loads(clean_json(response.choices[0].message.content))
            
            # Bổ sung dữ liệu hệ thống
            product_data['id'] = str(uuid.uuid4())
            product_data['created_at'] = datetime.utcnow().isoformat()
            product_data['updated_at'] = datetime.utcnow().isoformat()
            
            # CHỐT CHẶN: Ép kiểu Category thành in hoa để chiều lòng Database
            if 'category' in product_data:
                product_data['category'] = product_data['category'].upper()
            
            # Upload
            data = supabase.table("products").insert(product_data).execute()
            print(f"✅ Đã lên hàng: {product_data['title']} - Giá: {product_data['price']}đ")
            
        except Exception as e:
            print(f"⚠️ Lỗi: {e}")
            
        print("💤 Nghỉ 2 giây...")
        time.sleep(2)

except FileNotFoundError:
    print("❌ Lỗi: Không thấy thư mục KHO_HANG")

print("\n🏁 DONE! F5 WEB ĐỂ XEM HÀNG XỊN!")