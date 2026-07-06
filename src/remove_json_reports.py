from pathlib import Path
def remove_json_reports():
    reports_dir = Path("reports")
    if not reports_dir.exists():
        return
    else:
        for file in reports_dir.glob("*.json"):
            file.unlink()
