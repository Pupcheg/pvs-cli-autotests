#2.2.14 Коды возврата утилиты анализа
#коды возврата, которые утилита анализа выдаёт хронологически на разных этапах в режиме analyze:
#Проверка лицензии:
#Утилита анализа выдаёт код возврата 22, если лицензия невалидна
import pytest
import os
from pathlib import Path
import shutil
test_dir=Path(__file__).parent.parent.parent / "examples_ts_js"
report_path=Path(__file__).parent.parent.parent.parent / "reports"
report_path.mkdir(exist_ok=True)
test_dirs=[d for d in test_dir.iterdir() if d.is_dir()]
test_name=Path(__file__).stem

@pytest.mark.parametrize("test_dir",test_dirs)
def test_error_code(analyzer,test_dir):
    command_line = ["analyze", f"{test_dir}", "-o", f"{report_path}/{test_dir.name}_{test_name}_report.json"]
    license_original=Path(os.getenv('APPDATA'))/"PVS-Studio"/"Settings.xml"

    license_temp=Path(__file__).parent /"Settings.xml"
    shutil.copy2(license_original, license_temp)

    content = license_original.read_text(encoding='utf-8')
    license_original.write_text(content[:len(content)//2], encoding='utf-8')

    try:
        stdout, stderr, returncode, report_file = analyzer(test_dir,command_line, expected_code=22)
        assert returncode == 22, f"Expected return code 22, but got {returncode}. Stderr: {stderr}"
    finally:
        shutil.copy2(license_temp,license_original)
        license_temp.unlink()

