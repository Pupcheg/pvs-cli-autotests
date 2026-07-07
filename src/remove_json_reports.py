from pathlib import Path
def remove_json_reports():
    root_dir=Path(__file__).parent.parent
    json_files = list(root_dir.rglob("*.json"))

    if not json_files:
        return
    else:
        for file in json_files:
            file.unlink()
