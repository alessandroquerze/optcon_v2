from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

from jsonschema import Draft202012Validator
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[1]
SCHEMAS = ROOT / "schemas"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    """Atomic replacement; no partially written JSON becomes a committed artifact."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def checked_path(root: Path, relative: str) -> Path:
    """Artifact references must stay inside their declared root."""
    root = root.resolve()
    path = (root / relative).resolve()
    if not path.is_relative_to(root) or Path(relative).is_absolute():
        raise ValueError(f"Percorso esterno alla radice: {relative}")
    return path


def validate_schema(value, name: str) -> None:
    # PDF APIs return tuples for boxes; validate their actual JSON representation.
    value = json.loads(json.dumps(value, ensure_ascii=False, allow_nan=False))
    schema = read_json(SCHEMAS / name)
    Draft202012Validator.check_schema(schema)
    local_schemas = [read_json(path) for path in SCHEMAS.glob("*.schema.json")]
    registry = Registry().with_resources((item["$id"], Resource.from_contents(item)) for item in local_schemas)
    errors = sorted(Draft202012Validator(schema, registry=registry).iter_errors(value), key=lambda e: str(list(e.path)))
    if errors:
        messages = [f"{'/'.join(map(str, error.path)) or '$'}: {error.message}" for error in errors[:12]]
        raise ValueError(f"Schema {name}: " + "; ".join(messages))

