#2.2.2	Конфигурирование работы утилиты анализа через аргументы командной строки
#Для функционирования утилиты анализа во всех сценариях она ДОЛЖНА поддерживать следующий интерфейс командной строки:
#Вывод справочной информации:
#	[Single] --version — выводит версию ядра анализатора в формате major.minor.rev.build в stdout;
import re
import pytest
from tests_tools import get_test_dirs,assert_return_code, assert_no_stderr

@pytest.mark.parametrize("test_dir",get_test_dirs())
def test_error_code(analyzer, test_dir,report_path, test_name):
    expected_code=0
    command_line = [ "--version", "analyze", f"{test_dir}", "-o", f"{report_path}/{test_dir.name}_{test_name}_report.json"]
    stdout, stderr, returncode, time = analyzer( command_line)

    assert_return_code(returncode, expected_code, stderr)

    assert_no_stderr(stderr)

    version_pattern = r"\d+\.\d+\.\d+\.\d+"
    assert re.search(version_pattern, stdout), f"Version format mismatch: {stdout}"
