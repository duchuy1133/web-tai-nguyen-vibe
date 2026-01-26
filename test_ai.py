import google.generativeai as genai
import os
import time

# --- 1. CẤU HÌNH (Dán Key của anh vào đây) ---
MY_API_KEY = "AIzaSyCL9ByyB3b-oyzmp_4_2QLgpVDJOM90Dlc"
genai.configure(api_key=MY_API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')

# --- 2. ĐƯỜNG DẪN KHO HÀNG ---
# Dấu chấm (.) nghĩa là thư mục hiện tại. Đảm bảo folder KHO_HANG nằm cùng chỗ file này.
folder_path = "./KHO_HANG" 

print(f"🚀 Bắt đầu quét kho hàng tại: {folder_path}...\n")

# --- 3. VÒNG LẶP QUÉT FILE ---
try:
    files = [f for f in os.listdir(folder_path) if f.endswith('.zip') or f.endswith('.rar')]
    
    if len(files) == 0:
        print("❌ Không thấy file nào trong thư mục KHO_HANG cả! Anh ném file vào chưa?")
    
    for filename in files:
        print("-" * 50)
        print(f"📂 Đang xử lý file: {filename}")
        
        # Tạo prompt xịn xò
        prompt = f"""
        Tôi có file: "{filename}".
        Viết nội dung bán hàng Facebook/Website ngắn gọn (Tiếng Việt).
        Gồm: Tiêu đề giật gân, 3 tính năng, Giá bán (tự định giá hợp lý), Hashtag.
        """
        
        # Gọi AI (Thêm try-catch để lỡ lỗi mạng không bị dừng)
        try:
            response = model.generate_content(prompt)
            print("✅ AI Đã viết xong:")
            print(response.text)
        except Exception as e:
            print(f"⚠️ Lỗi khi gọi AI: {e}")
            
        print("💤 Nghỉ 2 giây để Google không mắng...")
        time.sleep(2) # Nghỉ tí cho đỡ bị khóa

except FileNotFoundError:
    print("❌ Lỗi: Anh chưa tạo thư mục tên là 'KHO_HANG' kìa!")

print("\n🏁 ĐÃ XỬ LÝ XONG TOÀN BỘ!")