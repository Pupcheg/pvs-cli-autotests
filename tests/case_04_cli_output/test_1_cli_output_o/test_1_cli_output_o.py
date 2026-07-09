#2.2.2	Конфигурирование работы утилиты анализа через аргументы командной строки
#Для функционирования утилиты анализа во всех сценариях она ДОЛЖНА поддерживать следующий интерфейс командной строки:
#Режим analyze:
#[Single] -o, --output=/path/to/output — путь до результирующего отчёта анализатора. Если флаг опущен, 
#то результирующий отчёт формируется во входной директории или в родительской директории входного файла с именем PVS-Studio.json. 
#Если необходимо выдать результат в stdout, пользователь может передать символ - как аргумент флага.

#-o — путь до результирующего отчёта анализатора.

import pytest
import json
from tests_tools import get_test_dirs,assert_return_code, assert_no_stderr,asserts_json

@pytest.mark.parametrize("test_dir",get_test_dirs())
def test_error_code(analyzer, test_dir,report_path, test_name):
    expected_code=0

    report_file=report_path/f"{test_dir.name}_{test_name}_report.json"
    command_line = ["analyze", f"{test_dir}", "-o", report_file]
    stdout, stderr, returncode, time = analyzer(command_line)

    assert_return_code(returncode, expected_code, stderr)

    assert report_file.exists(), f"Expected report file {report_file} to exist, but it does not."

    with report_file.open("r") as f:
        report_content = json.load(f)

    assert_no_stderr(stderr)

    asserts_json(report_content)

