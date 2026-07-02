#from src.get_test_files_js_ts import get_test_files_js_ts
import sys
import pytest
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

#test_files = get_test_files_js_ts(Path(__file__).parent)

TESTS = [
    p for p in Path(__file__).parent.iterdir()
    if p.is_dir() and p.name.startswith("test_")
]

@pytest.mark.parametrize("test_dir", TESTS)
def test_error_code(analyzer, test_dir):
    stdout, stderr, returncode, report_file = analyzer(str(test_dir))
    assert returncode == 0, f"Expected return code 0, but got {returncode}. Stderr: {stderr}"
    assert report_file.exists(), f"Expected report file {report_file} to exist, but it does not."
    with report_file.open("r") as f:
        report_content = json.load(f)
    assert isinstance(report_content, dict), f"Expected report content to be a dictionary, but got {type(report_content)}"
    assert stderr == "", f"Expected no stderr output, but got: {stderr}"
    

