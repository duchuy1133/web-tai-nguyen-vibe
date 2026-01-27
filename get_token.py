import requests

print("🛠️  CÔNG CỤ LẤY TOKEN FACEBOOK VĨNH VIỄN")
print("-" * 50)

# 1. NHẬP THÔNG TIN (Anh điền vào lúc chạy hoặc sửa cứng vào đây cũng được)
APP_ID = input("👉 Nhập App ID: ").strip()
APP_SECRET = input("👉 Nhập App Secret: ").strip()
SHORT_TOKEN = input("👉 Nhập Token ngắn hạn (vừa lấy ở bước 2): ").strip()

print("\n⏳ Đang phù phép biến hình...")

# 2. ĐỔI TOKEN NGẮN -> TOKEN DÀI (Của User, sống 60 ngày)
url_long_lived = f"https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_TOKEN}"

try:
    resp = requests.get(url_long_lived)
    data = resp.json()
    
    if 'access_token' not in data:
        print("❌ Lỗi đổi token dài: ", data)
        exit()
        
    long_user_token = data['access_token']
    print("✅ Đã có Token User dài hạn (60 ngày). Đang lấy Token Page vĩnh viễn...")
    
    # 3. DÙNG TOKEN DÀI ĐỂ LẤY TOKEN PAGE (VĨNH VIỄN)
    url_get_pages = f"https://graph.facebook.com/me/accounts?access_token={long_user_token}"
    resp_page = requests.get(url_get_pages)
    data_page = resp_page.json()
    
    print("-" * 50)
    print("🎉 DANH SÁCH CÁC PAGE CỦA ANH & TOKEN VĨNH VIỄN:")
    
    found = False
    for page in data_page.get('data', []):
        print(f"\n📄 Page: {page['name']}")
        print(f"🆔 ID: {page['id']}")
        print(f"🔑 TOKEN VĨNH VIỄN: {page['access_token']}")
        print("(Copy dòng Token này dán vào auto_blog.py nhé!)")
        found = True
        
    if not found:
        print("⚠️ Không tìm thấy Page nào. Anh đã cấp quyền 'pages_manage_posts' chưa?")

except Exception as e:
    print(f"❌ Lỗi kết nối: {e}")

input("\nBấm Enter để thoát...")