"""Optional authoring helper. Requires Pillow: python3 -m pip install Pillow.
Put originals in public/imgs, then run npm run media and rebuild.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json
root=Path(__file__).resolve().parents[1]
out=root/'public/media';out.mkdir(parents=True,exist_ok=True)
manifest={}
for path in (root/'public/imgs').iterdir():
    if path.suffix.lower() not in {'.jpg','.jpeg','.png'}: continue
    image=ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    widths=[480,960] if path.stem in {'chinglamchoi','schoenblick','hilaryHahn','goethe','schorle','neckar-flowers','neckar-wide','bouldering','reading-wall','painted-vessels','sculpture-study'} else [320,640,1280]
    for width in widths:
        resized=image.copy()
        resized.thumbnail((width,round(width*image.height/image.width)))
        resized.save(out/f'{path.stem}-{width}.webp',quality=83,method=6)
    manifest[path.stem]={'width':image.width,'height':image.height,'widths':widths}
(root/'src/data/media.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Optimized {len(manifest)} images. Rebuild to use the updated media.')
