from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

from .analysis import export_requests, import_result
from .ingest import ingest
from .validate import audit


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Pipeline PDF locale: estrazione, rendering e preparazione analisi. Nessuna companion.")
    commands = parser.add_subparsers(dest="command", required=True)
    extract = commands.add_parser("ingest", help="Estrai ogni pagina e crea il manifest")
    extract.add_argument("--source", type=Path, default=Path("."))
    extract.add_argument("--output", type=Path, default=Path("Data"))
    extract.add_argument("--dpi", type=int, default=144)
    for name, help_text in [("verify", "Controlla sorgenti, hash, schema e copertura"),
                            ("export-analysis", "Prepara una richiesta multimodale per pagina senza chiamare AI"),
                            ("import-analysis", "Valida e registra un risultato di analisi della pagina")]:
        command = commands.add_parser(name, help=help_text)
        command.add_argument("--output", type=Path, default=Path("Data"))
        if name == "import-analysis":
            command.add_argument("--result", type=Path, required=True)
    args = parser.parse_args()
    try:
        output = args.output.resolve()
        if args.command == "ingest":
            catalog = ingest(args.source, output, args.dpi)
            print(f"Catalogo: {catalog['document_count']} PDF, {catalog['page_count']} pagine")
        report = audit(output, include_requests=args.command == "verify")
        if not report["ok"]:
            print(json.dumps(report, ensure_ascii=False, indent=2))
            return 1
        if args.command in {"ingest", "export-analysis"}:
            print(f"Richieste AI predisposte: {export_requests(output)} (nessuna chiamata a modelli)")
            report = audit(output)
        elif args.command == "import-analysis":
            print(f"Analisi registrata: {import_result(output, args.result)}")
            report = audit(output)
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0 if report["ok"] else 1
    except (ValueError, OSError, KeyError, TypeError) as error:
        print(f"ERRORE: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
