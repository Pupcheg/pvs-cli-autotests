#2.2.2	Конфигурирование работы утилиты анализа через аргументы командной строки
#Для функционирования утилиты анализа во всех сценариях она ДОЛЖНА поддерживать следующий интерфейс командной строки:
#Вывод справочной информации:
#	[Single] --version — выводит версию ядра анализатора в формате major.minor.rev.build в stdout;
import re
from tests_tools import assert_return_code, assert_no_stderr

def test_error_code(analyzer):
    expected_code=0

    command_line = [ "--version"]
    stdout, stderr, returncode, time = analyzer( command_line)

    assert_return_code(returncode, expected_code, stderr)

    assert_no_stderr(stderr)

    version_pattern = r"\d+\.\d+\.\d+\.\d+"
    assert re.search(version_pattern, stdout), f"Version format mismatch: {stdout}"
