#!/usr/bin/env python3
"""Generate constructionCatalog.generated.ts from TC_reference_42.pdf."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pypdf

ROOT = Path(__file__).resolve().parents[3]
PDF_PATH = ROOT / "TC_reference_42.pdf"
OUT_PATH = Path(__file__).resolve().parents[1] / "src/features/task-solving/model/constructionCatalog.generated.ts"

LANGS = {"Pascal": "pascal", "Python": "python", "C++": "cpp", "C#": "csharp", "Java": "java"}
TC_RE = re.compile(r"^\d+\.\s.+\(([a-z_]+)\)\s*$")
DESC_RE = re.compile(r"^Описание:\s*(.*)$")
SKIP_LINE = "TC 42 Pascal Showcase"

CODE_START = re.compile(
    r"^(#include|using |import |from |def |class |program |begin|end\.|var |procedure |function |if |for |while |print|WriteLn|writeln|cout|Console\.|System\.|public |static |int |double |float |string |bool |final |return |namespace |struct |package |std::|\}|\{|//|/\*|for\(|while\(|try |catch |switch |case |break|continue|raise |except |elif |else:|pass|lambda |with |open\(|range\(|len\(|input\(|map\(|filter\(|sorted\(|append\(|push_back|pop\(|new |this\.|super\(|override |abstract |interface |enum |record |type |const |let |void |char |byte |short |long |unsigned )",
    re.I,
)


def looks_like_code(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    if CODE_START.match(stripped):
        return True
    if ":=" in stripped or "::" in stripped or "<<" in stripped or ">>" in stripped or "=>" in stripped:
        return True
    if stripped.endswith((";", "{", "}", ")", ":")) and not stripped.endswith("):"):
        return True
    if re.match(r"^[\w\.]+\(", stripped):
        return True
    if re.match(r"^[a-zA-Z_][\w]*\s*[+\-*/%]?=", stripped):
        return True
    if re.match(r"^[a-zA-Z_][\w]*\s*:\s*\w+", stripped):
        return True
    if stripped.startswith(("    ", "  ", "\t")):
        return True
    if stripped in {"}", "{", "};", "},", "end.", "end;"}:
        return True
    return False


def parse_language_examples(lang_lines: list[str]) -> list[dict[str, str]]:
    examples: list[dict[str, str]] = []
    index = 0
    total = len(lang_lines)

    while index < total:
        while index < total and not lang_lines[index].strip():
            index += 1
        if index >= total:
            break

        title_parts = [lang_lines[index].strip()]
        index += 1
        while index < total and lang_lines[index].strip() and not looks_like_code(lang_lines[index]):
            title_parts.append(lang_lines[index].strip())
            index += 1
        title = " ".join(title_parts)

        code_lines: list[str] = []
        while index < total:
            if not lang_lines[index].strip():
                next_index = index + 1
                while next_index < total and not lang_lines[next_index].strip():
                    next_index += 1
                if next_index < total and not looks_like_code(lang_lines[next_index]) and code_lines:
                    break
                if code_lines:
                    code_lines.append("")
                index += 1
                continue
            if code_lines and not looks_like_code(lang_lines[index]) and lang_lines[index].strip():
                break
            code_lines.append(lang_lines[index].rstrip())
            index += 1

        code = "\n".join(code_lines).strip()
        if title and code:
            examples.append({"title": title, "code": code})

    return examples


def extract_lines() -> list[str]:
    reader = pypdf.PdfReader(str(PDF_PATH))
    lines: list[str] = []
    for page in reader.pages:
        for raw in (page.extract_text() or "").split("\n"):
            line = raw.rstrip()
            if line.strip() == SKIP_LINE:
                continue
            lines.append(line)
    return lines


def parse_catalog(lines: list[str]) -> dict[str, dict]:
    catalog: dict[str, dict] = {}
    current_id: str | None = None
    mode: str | None = None
    current_lang: str | None = None
    lang_buf: list[str] = []

    def flush_lang() -> None:
        nonlocal lang_buf, current_id, current_lang
        if current_id and current_lang and lang_buf:
            examples = parse_language_examples(lang_buf)
            if examples:
                catalog[current_id]["examples"][current_lang] = examples
        lang_buf = []

    for line in lines:
        match = TC_RE.match(line.strip())
        if match:
            flush_lang()
            current_id = match.group(1)
            title = line.strip().split("(")[0].split(".", 1)[1].strip()
            catalog[current_id] = {"title": title, "description": "", "examples": {}}
            mode = "desc"
            current_lang = None
            continue

        if current_id is None:
            continue

        if line.strip() in LANGS:
            flush_lang()
            current_lang = LANGS[line.strip()]
            mode = "lang"
            continue

        if mode == "desc":
            desc_match = DESC_RE.match(line.strip())
            if desc_match:
                catalog[current_id]["description"] = desc_match.group(1).strip()
            elif line.strip() and line.strip() not in LANGS.values():
                if catalog[current_id]["description"]:
                    catalog[current_id]["description"] += " " + line.strip()
                else:
                    catalog[current_id]["description"] = line.strip()
            continue

        if mode == "lang" and current_lang:
            lang_buf.append(line)

    flush_lang()
    return catalog


def render_typescript(catalog: dict[str, dict]) -> str:
    payload = json.dumps(catalog, ensure_ascii=False, indent=2)
    return f"""// Auto-generated from TC_reference_42.pdf — do not edit by hand.
// Regenerate: python3 scripts/generate_construction_catalog.py

import type {{ ConstructionDetail }} from "@/features/task-solving/model/constructionCatalog.types"

const RAW_CATALOG = {payload} as const

export const GENERATED_CONSTRUCTION_CATALOG: Record<string, ConstructionDetail> = Object.fromEntries(
  Object.entries(RAW_CATALOG).map(([id, item]) => [
    id,
    {{
      title: item.title,
      description: item.description,
      examples: item.examples,
    }},
  ]),
)
"""


def main() -> None:
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found: {PDF_PATH}")

    catalog = parse_catalog(extract_lines())
    if len(catalog) != 42:
        raise SystemExit(f"Expected 42 TC entries, got {len(catalog)}")

    OUT_PATH.write_text(render_typescript(catalog), encoding="utf-8")
    total_examples = sum(len(v) for item in catalog.values() for v in item["examples"].values())
    print(f"Wrote {OUT_PATH} ({len(catalog)} TC, {total_examples} examples)")


if __name__ == "__main__":
    main()
