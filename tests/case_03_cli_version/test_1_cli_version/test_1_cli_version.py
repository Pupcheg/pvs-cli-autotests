#2.2.2	Конфигурирование работы утилиты анализа через аргументы командной строки
#Для функционирования утилиты анализа во всех сценариях она ДОЛЖНА поддерживать следующий интерфейс командной строки:
#Вывод справочной информации:
#	[Single] --version — выводит версию ядра анализатора в формате major.minor.rev.build в stdout;
import re
from pathlib import Path

test_dir=Path(__file__).parent.parent.parent / "examples_ts_js"


def test_error_code(analyzer):
    command_line = [ "--version"]

    stdout, stderr, returncode, report_file = analyzer(test_dir, command_line, expected_code=0)
    assert returncode == 0, f"Expected return code 0, but got {returncode}. Stderr: {stderr}"
    assert stderr == "", f"Expected no stderr output, but got: {stderr}"

    version_pattern = r"\d+\.\d+\.\d+\.\d+"
    assert re.search(version_pattern, stdout), f"Version format mismatch: {stdout}"
