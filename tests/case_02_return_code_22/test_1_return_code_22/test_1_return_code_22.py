#2.2.14 Коды возврата утилиты анализа
#коды возврата, которые утилита анализа выдаёт хронологически на разных этапах в режиме analyze:
#Проверка лицензии:
#Утилита анализа выдаёт код возврата 22, если лицензия отсутствует
import pytest
from pathlib import Path
import shutil
from tests_tools import get_test_dirs, assert_return_code, get_license_temp_path

@pytest.mark.parametrize("test_dir",get_test_dirs())
def test_error_code(analyzer,test_dir, report_path, test_name):
    expected_code = 22

    command_line = ["analyze", f"{test_dir}", "-o", f"{report_path}/{test_dir.name}_{test_name}_report.json"]
    license_original, license_temp=get_license_temp_path(Path(__file__).parent)
    shutil.copy2(license_original, license_temp)

    if license_original.exists():
        try:
            license_original.unlink()
            stdout, stderr, returncode, time = analyzer(command_line)

            assert_return_code(returncode, expected_code, stderr)
        finally:
            if not license_original.exists() and license_temp.exists():
                shutil.copy2(license_temp,license_original)
                license_temp.unlink()
    else:
        stdout, stderr, returncode, time = analyzer(command_line)

        assert_return_code(returncode, expected_code, stderr)
