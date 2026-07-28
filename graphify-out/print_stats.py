import json
from pathlib import Path
d = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-16' if Path('graphify-out/.graphify_detect.json').read_bytes().startswith(b'\xff\xfe') else 'utf-8-sig'))
print(f"Corpus: {d.get('total_files', 0)} files · ~{d.get('total_words', 0):,} words")
for k, v in d.get('files', {}).items():
    if len(v) > 0:
        print(f"  {k}: {len(v)} files")
