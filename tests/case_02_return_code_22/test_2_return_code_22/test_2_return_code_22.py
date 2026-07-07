#2.2.14 Коды возврата утилиты анализа
#коды возврата, которые утилита анализа выдаёт хронологически на разных этапах в режиме analyze:
#Проверка лицензии:
#Утилита анализа выдаёт код возврата 22, если лицензия невалидна
import pytest
import os
from pathlib import Path
import shutil

from tests_tools import get_test_dirs, assert_return_code, get_license_path

@pytest.mark.parametrize("test_dir",get_test_dirs())
def test_error_code(analyzer,test_dir,report_path, test_name):
    expected_code = 22

    command_line = ["analyze", f"{test_dir}", "-o", f"{report_path}/{test_dir.name}_{test_name}_report.json"]
    license_original=get_license_path()
    #license_original=Path(os.getenv('APPDATA'))/"PVS-Studio"/"Settings.xml"

    license_temp=Path(__file__).parent /"Settings.xml"
    shutil.copy2(license_original, license_temp)

    content = license_original.read_text(encoding='utf-8')
    license_original.write_text(content[:len(content)//2], encoding='utf-8')

    try:
        stdout, stderr, returncode = analyzer(command_line)

        assert_return_code(returncode, expected_code, stderr)
    finally:
        shutil.copy2(license_temp,license_original)
        license_temp.unlink()

