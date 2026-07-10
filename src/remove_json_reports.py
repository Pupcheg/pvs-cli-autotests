from pathlib import Path

def remove_json_reports():
    tests_dir = Path("tests")
    if not tests_dir.exists():
        return
    
    for json_file in tests_dir.rglob("*.json"):
        json_file.unlink()
