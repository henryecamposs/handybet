import sys, json
from graphify.extract import collect_files, extract
from pathlib import Path

code_files = []
try:
    detect_json_path = Path('graphify-out/.graphify_detect.json')
    content = detect_json_path.read_text(encoding='utf-16' if detect_json_path.read_bytes().startswith(b'\xff\xfe') else 'utf-8-sig')
    detect = json.loads(content)
except Exception as e:
    print(f"Error reading detect json: {e}")
    sys.exit(1)

for f in detect.get('files', {}).get('code', []):
    code_files.extend(collect_files(Path(f)) if Path(f).is_dir() else [Path(f)])

if code_files:
    print(f"Extracting AST for {len(code_files)} code files...")
    result = extract(code_files, cache_root=Path('src'))
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f'AST: {len(result["nodes"])} nodes, {len(result["edges"])} edges')
else:
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps({'nodes':[],'edges':[],'input_tokens':0,'output_tokens':0}, ensure_ascii=False), encoding="utf-8")
    print('No code files - skipping AST extraction')

# Fast path: Empty semantic extraction
Path('graphify-out/.graphify_semantic.json').write_text(json.dumps({'nodes':[],'edges':[],'input_tokens':0,'output_tokens':0}, ensure_ascii=False), encoding="utf-8")
print('Wrote empty semantic extraction (code-only path).')
