import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "ezgif-451c41a8d7fd685b-png-split")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "frames")

os.makedirs(OUT_DIR, exist_ok=True)

TARGET_WIDTH = 1920
TARGET_HEIGHT = 1080
QUALITY = 82
TOTAL_FRAMES = 300

def process_frame(i):
    src_filename = f"1 ({i}).png"
    src_path = os.path.join(SRC_DIR, src_filename)
    dest_filename = f"frame_{i:03d}.webp"
    dest_path = os.path.join(OUT_DIR, dest_filename)

    if not os.path.exists(src_path):
        print(f"Warning: {src_path} not found!")
        return 0

    try:
        with Image.open(src_path) as img:
            # Resize with high quality Lanczos filter
            resized = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            resized.save(dest_path, "WEBP", quality=QUALITY, method=4)
        
        # Also create a small placeholder from frame 1
        if i == 1:
            placeholder_path = os.path.join(OUT_DIR, "frame_placeholder.webp")
            with Image.open(src_path) as img:
                small = img.resize((640, 360), Image.Resampling.BILINEAR)
                small.save(placeholder_path, "WEBP", quality=60)

        return os.path.getsize(dest_path)
    except Exception as e:
        print(f"Error processing frame {i}: {e}")
        return 0

def main():
    print(f"Starting multi-threaded conversion of {TOTAL_FRAMES} frames...")
    start_time = time.time()
    
    total_bytes = 0
    workers = min(12, os.cpu_count() or 4)
    print(f"Using {workers} concurrent workers...")

    with ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(executor.map(process_frame, range(1, TOTAL_FRAMES + 1)))

    total_bytes = sum(results)
    elapsed = time.time() - start_time

    print(f"\n--- Conversion Complete ---")
    print(f"Processed: {len(results)} frames")
    print(f"Total Output Size: {total_bytes / (1024 * 1024):.2f} MB")
    print(f"Average Frame Size: {total_bytes / (len(results) * 1024):.1f} KB")
    print(f"Elapsed Time: {elapsed:.2f} seconds")

if __name__ == "__main__":
    main()
