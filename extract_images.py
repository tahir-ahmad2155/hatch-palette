import fitz
from PIL import Image, ImageOps
import numpy as np

doc = fitz.open(r'assets/HP_Logo Mark_2026.pdf')

# ============================================
# Page 2: White logo on pure black - cleanest source
# ============================================
page2 = doc[2]
mat = fitz.Matrix(4, 4)  # 4x zoom for high resolution
pix = page2.get_pixmap(matrix=mat)
pix.save('assets/_temp_p2.png')

img = Image.open('assets/_temp_p2.png').convert('RGBA')
w, h = img.size
print(f'Page 2 rendered: {w}x{h}')

data = np.array(img)

# The logo pixels are white (>200 per channel) on a pure black (0,0,0) background
# Use a moderate threshold to catch anti-aliased edges
luminance = data[:,:,0].astype(float) * 0.299 + data[:,:,1].astype(float) * 0.587 + data[:,:,2].astype(float) * 0.114

# Create alpha from luminance (white=opaque, black=transparent)
alpha = np.clip(luminance, 0, 255).astype(np.uint8)

# Make the logo pure white
result_data = np.zeros_like(data)
result_data[:,:,0] = 255  # R
result_data[:,:,1] = 255  # G  
result_data[:,:,2] = 255  # B
result_data[:,:,3] = alpha  # Alpha from luminance

result_white = Image.fromarray(result_data)
bbox = result_white.getbbox()
print(f'White logo bbox: {bbox}')

if bbox:
    logo_white = result_white.crop(bbox)
    pad = 40
    padded_white = Image.new('RGBA', (logo_white.width + pad*2, logo_white.height + pad*2), (0,0,0,0))
    padded_white.paste(logo_white, (pad, pad))
    padded_white.save('assets/hp_logo_white_transparent.png')
    print(f'White logo saved: {padded_white.size}')

    # Now create the dark version by inverting: make logo black with same alpha
    dark_data = np.array(padded_white)
    # Set RGB to black, keep alpha
    dark_data[:,:,0] = 0
    dark_data[:,:,1] = 0
    dark_data[:,:,2] = 0
    # Alpha stays the same
    padded_dark = Image.fromarray(dark_data)
    padded_dark.save('assets/hp_logo_dark_transparent.png')
    print(f'Dark logo saved: {padded_dark.size}')

    # Extract just the icon (owl/heart mark) from the dark version
    # The icon is approximately the first 22% of the logo width
    icon_right = int(logo_white.width * 0.22)
    icon_white = logo_white.crop((0, 0, icon_right, logo_white.height))
    icon_bbox = icon_white.getbbox()
    if icon_bbox:
        icon_clean = icon_white.crop(icon_bbox)
        # Make it dark
        icon_data = np.array(icon_clean)
        icon_dark_data = icon_data.copy()
        icon_dark_data[:,:,0] = 0
        icon_dark_data[:,:,1] = 0
        icon_dark_data[:,:,2] = 0
        icon_dark = Image.fromarray(icon_dark_data)
        pad_i = 20
        padded_icon = Image.new('RGBA', (icon_dark.width + pad_i*2, icon_dark.height + pad_i*2), (0,0,0,0))
        padded_icon.paste(icon_dark, (pad_i, pad_i))
        padded_icon.save('assets/hp_icon_dark.png')
        print(f'Dark icon saved: {padded_icon.size}')

        # Also save white icon
        padded_icon_white = Image.new('RGBA', (icon_clean.width + pad_i*2, icon_clean.height + pad_i*2), (0,0,0,0))
        padded_icon_white.paste(icon_clean, (pad_i, pad_i))
        padded_icon_white.save('assets/hp_icon_white.png')
        print(f'White icon saved: {padded_icon_white.size}')

# Clean up temp
import os
for f in ['_temp_p1.png', '_temp_p2.png', '_temp_p4.png', '_temp_p5.png']:
    path = os.path.join('assets', f)
    if os.path.exists(path):
        os.remove(path)

print('All done!')
