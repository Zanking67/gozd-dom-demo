#!/usr/bin/env python3
"""One-time import of existing Pexels images used on this demo website."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlencode
import re, time

root=Path(__file__).resolve().parent.parent
dest=root/"images"
dest.mkdir(exist_ok=True)
photos={
"30155541":("hero-drva.jpg",1400),
"7897009":("bukova-drva.jpg",900),
"13373024":("hrastova-drva.jpg",900),
"12371116":("mesana-drva.jpg",900),
"6835308":("priprava-drv.jpg",1400),
"8747653":("gozd.jpg",1400),
"1724228":("kamin.jpg",1300),
"6530823":("dostava-drv.jpg",1200),
"3933911":("zlozena-polena.jpg",1300)
}
for photo_id,(name,width) in photos.items():
    url=("https://images.pexels.com/photos/"+photo_id+"/pexels-photo-"+photo_id+".jpeg?"+
         urlencode({"auto":"compress","cs":"tinysrgb","w":width}))
    for attempt in range(3):
        try:
            req=Request(url,headers={"User-Agent":"Mozilla/5.0 (compatible; GozdDomDemo/1.0)"})
            with urlopen(req,timeout=20) as response:
                kind=response.headers.get("Content-Type","")
                data=response.read(4_000_001)
            if not kind.lower().startswith("image/") or len(data)<4000 or len(data)>4_000_000 or not data.startswith(bytes.fromhex("ffd8ff")):
                raise ValueError("Invalid JPEG from "+url)
            (dest/name).write_bytes(data)
            print(name,len(data),"bytes")
            break
        except Exception as exc:
            if attempt==2: raise
            print("Retry",photo_id,str(exc))
            time.sleep(2)
pattern=re.compile(r"https://images\.pexels\.com/photos/(\d+)/pexels-photo-\1\.jpeg\?auto=compress(?:&amp;|&)cs=tinysrgb(?:&amp;|&)w=\d+")
count=0
for path in root.glob("*.html"):
    original=path.read_text(encoding="utf8")
    def sub(match):
        key=match.group(1)
        if key not in photos: raise ValueError("Unknown image ID "+key)
        return "images/"+photos[key][0]
    updated, n=pattern.subn(sub,original)
    if n:
        path.write_text(updated,encoding="utf8")
        count+=n
        print(path.name,n,"references replaced")
if count<9: raise ValueError("Only "+str(count)+" image references replaced; expected 9 or more.")
notes="# Photographs from Pexels\n\nThese photographs belong to a demo website, and are not evidence of the exact firewood species or inventory.\n\nLicense: https://www.pexels.com/legal-pages/license/\n\n"
for key,(name,width) in photos.items():
    notes+="- "+name+": https://images.pexels.com/photos/"+key+"/pexels-photo-"+key+".jpeg\n"
(dest/"README.md").write_text(notes,encoding="utf8")
readme=root/"README.md"
if readme.exists():
    text=readme.read_text(encoding="utf8")
    old="**niso shranjene v tem repozitoriju** in se nalagajo z zunanjega strežnika"
    new="**so zdaj shranjene v mapi images/** in se nalagajo s spletne strani"
    text=text.replace(old,new)
    text+="\n## Fotografije shranjene lokalno\nFotografije Pexels so v mapi images. Izvorne povezave in licenca so zapisane v images/README.md.\n"
    readme.write_text(text,encoding="utf8")
print("Success: 9 JPEG files; replaced",count,"HTML references")
