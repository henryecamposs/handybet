import json
from pathlib import Path
from graphify.extract import merge_graphs

def load_json(p):
    return json.loads(Path(p).read_text(encoding='utf-8'))

ast = load_json('graphify-out/.graphify_ast.json')
sem = load_json('graphify-out/.graphify_semantic.json')
merged = merge_graphs(ast, sem)
Path('graphify-out/graph.json').write_text(json.dumps(merged, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"Merged graph: {len(merged['nodes'])} nodes, {len(merged['edges'])} edges")
