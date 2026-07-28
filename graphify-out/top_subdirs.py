import json
from pathlib import Path
from collections import Counter

d = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-16' if Path('graphify-out/.graphify_detect.json').read_bytes().startswith(b'\xff\xfe') else 'utf-8-sig'))
scan_root = d.get('scan_root', '.')

all_files = []
for k, v in d.get('files', {}).items():
    all_files.extend(v)

subdirs = []
for f in all_files:
    f_path = Path(f)
    try:
        rel = f_path.relative_to(Path(scan_root))
    except ValueError:
        rel = f_path

    parts = rel.parts
    if len(parts) > 0:
        first = parts[0]
        if first != 'graphify-out':
            if len(parts) == 1:
                subdirs.append('(root)')
            else:
                subdirs.append(first)

counts = Counter(subdirs)
print("Top 5 subdirectories by file count:")
for subdir, count in counts.most_common(5):
    print(f"  {subdir}: {count} files")
