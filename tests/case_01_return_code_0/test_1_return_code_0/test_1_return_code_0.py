#2.2.14 Коды возврата утилиты анализа
#Утилита анализа выдаёт код возврата 0, если она отработал в штатном режиме.

import pytest
import json
from pathlib import Path
from tests_tools import get_test_dirs,assert_return_code, assert_no_stderr

@pytest.mark.parametrize("test_dir",get_test_dirs())
def test_error_code(analyzer, test_dir,report_path, test_name):
    expected_code=0

    report_file=report_path/f"{test_dir.name}_{test_name}_report.json"
    command_line = ["analyze", f"{test_dir}", "-o", f"{report_path}/{test_dir.name}_{test_name}_report.json"]
    stdout, stderr, returncode = analyzer(command_line)

    assert_return_code(returncode, expected_code, stderr)

    assert report_file.exists(), f"Expected report file {report_file} to exist, but it does not."

    with report_file.open("r") as f:
        report_content = json.load(f)

    assert isinstance(report_content, dict), f"Expected report content to be a dictionary, but got {type(report_content)}"

    assert_no_stderr(stderr)

