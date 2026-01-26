import google.generativeai as genai

# --- DÁN KEY CỦA ANH VÀO ĐÂY ---
MY_API_KEY = "AIzaSyCL9ByyB3b-oyzmp_4_2QLgpVDJOM90Dlc"
genai.configure(api_key=MY_API_KEY)

print("🔍 Đang quét danh sách Model khả dụng cho Key của bạn...")
print("="*40)

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Tên chuẩn: {m.name}")
            
    print("="*40)
    print("👉 Anh Huy hãy copy một trong các dòng 'models/...' ở trên thay vào file test_ai.py nhé!")
except Exception as e:
    print(f"❌ Lỗi rồi: {e}")
    print("Có thể Key bị sai hoặc chưa kích hoạt.")