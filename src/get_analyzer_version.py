import subprocess
from pathlib import Path

def get_analyzer_version(analyzer_path):
    cmd = [f"{analyzer_path}", "-V"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout


def remove_json_reports():
    reports_dir = Path("reports")
    if not reports_dir.exists():
        return
    else:
        for file in reports_dir.glob("*.json"):
            file.unlink()
