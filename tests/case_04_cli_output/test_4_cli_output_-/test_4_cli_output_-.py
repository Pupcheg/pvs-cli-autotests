#2.2.2	Конфигурирование работы утилиты анализа через аргументы командной строки
#Для функционирования утилиты анализа во всех сценариях она ДОЛЖНА поддерживать следующий интерфейс командной строки:
#Режим analyze:
#[Single] -o, --output=/path/to/output — путь до результирующего отчёта анализатора. Если флаг опущен, 
#то результирующий отчёт формируется во входной директории или в родительской директории входного файла с именем PVS-Studio.json. 
#Если необходимо выдать результат в stdout, пользователь может передать символ - как аргумент флага.

#Если необходимо выдать результат в stdout, пользователь может передать символ - как аргумент флага.

import pytest
import json
from tests_tools import get_test_dirs,assert_return_code, assert_no_stderr,asserts_json

@pytest.mark.parametrize("test_dir",get_test_dirs())
def test_error_code(analyzer, test_dir):
    expected_code=0

    command_line = ["analyze", f"{test_dir}", "-o -"]
    stdout, stderr, returncode, time = analyzer(command_line)

    assert_return_code(returncode, expected_code, stderr)

    assert_no_stderr(stderr)

    assert stdout.strip() !="", "stdout is empty"
    
    try:
        report_content=json.loads(stdout)
    except json.JSONDecodeError as e:
        assert False,  f"stdout is not valid JSON: {e}"

    asserts_json(report_content)
