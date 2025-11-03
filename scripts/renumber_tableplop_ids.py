#!/usr/bin/env python3
import json
import sys
from collections import defaultdict, deque

TAB_BASE = {
    "Character": 10000000,
    "Inventory": 30000000,
    "Feats": 50000000,
    "Spells": 70000000,
    "Background": 90000000,
}

def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save(obj, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)

def index_props(props):
    by_id = {}
    children = defaultdict(list)
    for p in props:
        by_id[p.get("id")] = p
    for p in props:
        children[p.get("parentId")].append(p)
    return by_id, children

def sort_siblings(items):
    return sorted(items, key=lambda x: (x.get("rank", 0), x.get("id", 0)))

def walk_tree(tab_root, children):
    order = []
    stack = [tab_root]
    while stack:
        node = stack.pop()
        order.append(node)
        kids = sort_siblings(children.get(node.get("id"), []))
        for k in reversed(kids):
            stack.append(k)
    return order

def main(inp, outp):
    data = load(inp)
    props = data.get("properties", [])
    by_id, children = index_props(props)

    tab_roots = [p for p in props if p.get("type") == "tab-section" and p.get("parentId") is None]
    idmap = {}

    for tab in tab_roots:
        tab_name = tab.get("value") or ""
        base = TAB_BASE.get(tab_name)
        if base is None:
            continue
        seq = base
        order = walk_tree(tab, children)
        for node in order:
            old_id = node.get("id")
            if old_id in idmap: 
                continue
            seq += 1
            idmap[old_id] = seq

    new_props = []
    for node in props:
        old_id = node.get("id")
        new_node = dict(node)
        if old_id in idmap:
            new_node["id"] = idmap[old_id]
        parent = node.get("parentId")
        new_node["parentId"] = None if parent is None else idmap.get(parent, parent)
        new_node["characterId"] = None
        new_props.append(new_node)

    # Optional: reorder output for readability
    out_props = []
    seen = set()
    def append_subtree(root):
        stack = [root]
        while stack:
            cur = stack.pop()
            oid = cur.get("id")
            if oid in seen: 
                continue
            seen.add(oid)
            nid = idmap.get(oid, oid)
            rewritten = next((p for p in new_props if p["id"] == nid), None)
            if rewritten:
                out_props.append(rewritten)
            for kid in sort_siblings(children.get(oid, []))[::-1]:
                stack.append(kid)

    for tab in sort_siblings(tab_roots):
        append_subtree(tab)

    # Add any non-tab or stray nodes not hit above
    kept = {p["id"] for p in out_props}
    for p in new_props:
        if p["id"] not in kept:
            out_props.append(p)

    data["properties"] = out_props
    save(data, outp)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: renumber_tableplop_ids.py input.json output.json")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])