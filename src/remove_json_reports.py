from pathlib import Path
def remove_json_reports():
    reports_dir = Path("reports")
    if not reports_dir.exists():
        return
    else:
        for file in reports_dir.glob("*.json"):
            file.unlink()

    reports_dir = Path("tests/test_3_cli_output_no_flag/examples_ts_js/test_example_1")
    if not reports_dir.exists():
        return
    else:
        for file in reports_dir.glob("*.json"):
            file.unlink()
    
    reports_dir = Path("tests/test_3_cli_output_no_flag/examples_ts_js/test_example_2")
    if not reports_dir.exists():
        return
    else:
        for file in reports_dir.glob("*.json"):
            file.unlink()