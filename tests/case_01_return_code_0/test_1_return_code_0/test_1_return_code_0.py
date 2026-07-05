#2.2.14 Коды возврата утилиты анализа
#Утилита анализа выдаёт код возврата 0, если она отработал в штатном режиме.

import pytest
import json
from pathlib import Path

test_dir=Path(__file__).parent.parent.parent / "examples_ts_js" 
report_path=Path(__file__).parent.parent.parent.parent / "reports"
report_path.mkdir(exist_ok=True)
test_dirs=[d for d in test_dir.iterdir() if d.is_dir()]
test_name=Path(__file__).stem


@pytest.mark.parametrize("test_dir",test_dirs)
def test_error_code(analyzer, test_dir):
    command_line = ["analyze", f"{test_dir}", "-o", f"{report_path}/{test_dir.name}_{test_name}_report.json"]
    stdout, stderr, returncode, report_file = analyzer(test_dir,command_line, expected_code=0)
    assert returncode == 0, f"Expected return code 0, but got {returncode}. Stderr: {stderr}"
    assert report_file.exists(), f"Expected report file {report_file} to exist, but it does not."
    with report_file.open("r") as f:
        report_content = json.load(f)
    assert isinstance(report_content, dict), f"Expected report content to be a dictionary, but got {type(report_content)}"
    assert stderr == "", f"Expected no stderr output, but got: {stderr}"