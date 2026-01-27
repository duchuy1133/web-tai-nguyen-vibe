import tkinter as tk
from tkinter import scrolledtext, messagebox
import threading
import sys
import time
import json
import uuid
from datetime import datetime
import re
import requests
from openai import OpenAI
from supabase import create_client, Client

# --- 1. CẤU HÌNH HỆ THỐNG (GIỮ NGUYÊN) ---
FB_PAGE_ACCESS_TOKEN = "EAANNbe4rjMIBQjSzRvsOHz2tSkX1dVVLenfJTF1SWOAzNIvZC0fWfZCIOfPuHKDNQp3SZA5FrRhppVaZBRowJIky3CrrSMrA10Rg8WgBriDXjvcAktNzZBFaCwH4Boawo2PmiqMwwZBZAaNRhu0Jdz0Mg12tAowNeR6adYmSB2cGgwa2LEkGtzghyQlARubSZBMZArGKJnXFDNcA2i3N3dzNk"
FB_PAGE_ID = "456629970860389"
WEBSITE_DOMAIN = "http://localhost:3000"
DEEPSEEK_API_KEY = "sk-d14761881cdd4d7e9c610485577e6a8d"
SUPABASE_URL = "https://ukkfurbyqajnmmoxftjh.supabase.co".strip()
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVra2Z1cmJ5cWFqbm1tb3hmdGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDIwMjksImV4cCI6MjA4Mzk3ODAyOX0.IHm6gOXkQTKBw3DwTJWr6pEf6GL2ksVf_XiXI-9lbOI".strip()

# --- 2. LOGIC XỬ LÝ (TÁCH BIỆT UI) ---
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

import os

def post_to_facebook(title, excerpt, image_url, slug, log_func):
    """Hàm sửa lại: Tải ảnh về rồi upload file lên Facebook (Fix lỗi 324)"""
    try:
        # 1. Tải ảnh về
        log_func(f"... Đang tải ảnh tạm: {image_url}")
        
        # Thêm header giả lập trình duyệt để tránh bị chặn
        headers = {'User-Agent': 'Mozilla/5.0'}
        response_img = requests.get(image_url, headers=headers)
        
        if response_img.status_code != 200:
             log_func(f"⚠️ Không tải được ảnh. Status: {response_img.status_code}")
             return

        temp_file = "temp_fb_image.jpg"
        
        with open(temp_file, 'wb') as handler:
            handler.write(response_img.content)
            
        # 2. Upload file lên Facebook
        url = f"https://graph.facebook.com/{FB_PAGE_ID}/photos"
        message = f"🔥 {title}\n\n{excerpt}\n\n👉 Tải xuống ngay tại: {WEBSITE_DOMAIN}/blog/{slug}\n\n#VibeDigital #VideoEditing #TaiNguyenMienPhi"
        
        payload = {
            'caption': message,
            'access_token': FB_PAGE_ACCESS_TOKEN
        }
        
        # Mở file để gửi (Multipart Upload)
        with open(temp_file, 'rb') as img_file:
            files = {'source': img_file}
            response = requests.post(url, data=payload, files=files)
        
        # 3. Xóa file tạm
        if os.path.exists(temp_file):
            os.remove(temp_file)
            
        if response.status_code == 200:
            log_func(f"✅ Đã bắn sang Fanpage thành công! (ID: {response.json().get('id', 'Unknown')})")
        else:
            log_func(f"⚠️ Lỗi đăng Face: {response.text}")
            
    except Exception as e:
        log_func(f"⚠️ Không đăng được lên Face: {e}")

# --- 3. GUI APP ---
class AutoBlogApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Auto Blogger V3 - GUI Pro")
        self.root.geometry("600x700")
        self.root.configure(bg="#1e1e1e")

        # Styles
        self.text_font = ("Consolas", 10)
        self.label_font = ("Arial", 12, "bold")
        self.bg_color = "#1e1e1e"
        self.fg_color = "#ffffff"
        self.input_bg = "#2d2d2d"

        self.setup_ui()
        self.init_services()

    def init_services(self):
        try:
            self.client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")
            self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
            self.log("✅ Kết nối DeepSeek & Supabase thành công.")
        except Exception as e:
            self.log(f"❌ LỖI KẾT NỐI HỆ THỐNG: {e}")
            messagebox.showerror("Lỗi", "Không thể kết nối API. Kiểm tra lại cấu hình!")

    def setup_ui(self):
        # Header
        header = tk.Label(self.root, text="ROBOT BIÊN TẬP VIÊN AI (V3)", bg=self.bg_color, fg="#00ff88", font=("Arial", 16, "bold"))
        header.pack(pady=10)

        # Input Label
        lbl_input = tk.Label(self.root, text="Danh sách chủ đề (Mỗi dòng 1 chủ đề):", bg=self.bg_color, fg=self.fg_color, font=self.label_font)
        lbl_input.pack(anchor="w", padx=20)

        # Input Text Area
        self.txt_topics = scrolledtext.ScrolledText(self.root, height=10, bg=self.input_bg, fg=self.fg_color, font=self.text_font, insertbackground="white")
        self.txt_topics.pack(padx=20, pady=5, fill="x")

        # Start Button
        self.btn_start = tk.Button(self.root, text="START AUTO BLOG", bg="#ff5722", fg="white", font=("Arial", 12, "bold"), command=self.start_thread)
        self.btn_start.pack(pady=15, ipadx=20, ipady=5)

        # Log Label
        lbl_log = tk.Label(self.root, text="Nhật ký hoạt động:", bg=self.bg_color, fg=self.fg_color, font=self.label_font)
        lbl_log.pack(anchor="w", padx=20)

        # Log Text Area
        self.txt_log = scrolledtext.ScrolledText(self.root, height=15, bg="black", fg="#00ff00", font=self.text_font, state='disabled')
        self.txt_log.pack(padx=20, pady=5, fill="both", expand=True)

    def log(self, message):
        """Hàm ghi log vào GUI"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        final_msg = f"[{timestamp}] {message}\n"
        
        self.txt_log.config(state='normal')
        self.txt_log.insert(tk.END, final_msg)
        self.txt_log.see(tk.END)
        self.txt_log.config(state='disabled')
        
    def start_thread(self):
        raw_topics = self.txt_topics.get("1.0", tk.END).strip()
        if not raw_topics:
            messagebox.showwarning("Cảnh báo", "Vui lòng nhập ít nhất 1 chủ đề!")
            return

        self.topics = [line.strip() for line in raw_topics.split('\n') if line.strip()]
        
        self.btn_start.config(state='disabled', text="ĐANG CHẠY...", bg="#555555")
        
        # Chạy trong luồng riêng để không đơ GUI
        thread = threading.Thread(target=self.run_campaign)
        thread.daemon = True
        thread.start()

    def run_campaign(self):
        success_count = 0
        total = len(self.topics)
        
        self.log(f"🚀 Bắt đầu chiến dịch với {total} chủ đề...")
        
        for index, topic in enumerate(self.topics, 1):
            self.log("-" * 40)
            self.log(f"Process [{index}/{total}]: {topic}")
            
            try:
                # --- A. VIẾT BÀI ---
                self.log("... Đang nhờ DeepSeek viết bài")
                prompt = f"""
                Bạn là Chuyên gia Content Marketing cho VibeDigital.
                Chủ đề: "{topic}".
                QUY TẮC LINK NỘI BỘ: Chèn ít nhất 3 thẻ <a> trỏ về các category (plugin, template, luts, sound).
                Trả về JSON:
                {{
                    "title": "Tiêu đề hấp dẫn (Tiếng Việt)",
                    "excerpt": "Sapo 2 câu kịch tính.",
                    "content": "Nội dung HTML chi tiết.",
                    "image_prompt": "Mô tả ảnh tiếng Anh ngắn gọn"
                }}
                """
                response = self.client.chat.completions.create(
                    model="deepseek-chat",
                    messages=[{"role": "user", "content": prompt}],
                    stream=False
                )
                blog_data = json.loads(clean_json(response.choices[0].message.content))
                
                # --- B. VẼ ẢNH ---
                self.log("... Đang vẽ ảnh (Pollinations)")
                img_prompt = blog_data['image_prompt'].replace(" ", "%20")
                fake_image_url = f"https://image.pollinations.ai/prompt/{img_prompt}?width=800&height=500&nologo=true"
                
                # --- C. UPLOAD WEB ---
                self.log("... Đang lưu vào Database")
                final_data = {
                    "id": str(uuid.uuid4()),
                    "title": blog_data['title'],
                    "slug": create_slug(blog_data['title']),
                    "excerpt": blog_data['excerpt'],
                    "content": blog_data['content'],
                    "thumbnail": fake_image_url,
                    "created_at": datetime.utcnow().isoformat()
                }
                self.supabase.table("posts").insert(final_data).execute()
                self.log(f"✅ XONG WEB: {final_data['title']}")
                success_count += 1
                
                # --- D. ĐĂNG FACEBOOK ---
                self.log("... Đang gửi sang Fanpage")
                post_to_facebook(
                    title=final_data['title'],
                    excerpt=final_data['excerpt'],
                    image_url=final_data['thumbnail'],
                    slug=final_data['slug'],
                    log_func=self.log
                )

            except Exception as e:
                self.log(f"❌ LỖI: {e}")
            
            # --- E. NGHỈ NGƠI ---
            if index < total:
                self.log("💤 Nghỉ 30s để tránh spam...")
                time.sleep(30)

        self.log("=" * 40)
        self.log(f"🎉 HOÀN TẤT CHIẾN DỊCH! {success_count}/{total} bài.")
        self.root.after(0, lambda: self.btn_start.config(state='normal', text="START AUTO BLOG", bg="#ff5722"))
        messagebox.showinfo("Thông báo", "Đã chạy xong chiến dịch!")

if __name__ == "__main__":
    if sys.platform == 'win32':
        # Fix mờ font trên màn hình HiDPI Windows
        try:
            from ctypes import windll
            windll.shcore.SetProcessDpiAwareness(1)
        except:
            pass

    root = tk.Tk()
    app = AutoBlogApp(root)
    root.mainloop()