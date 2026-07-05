#2.2.14 Коды возврата утилиты анализа
#коды возврата, которые утилита анализа выдаёт хронологически на разных этапах в режиме analyze:
#Проверка лицензии:
#Утилита анализа выдаёт код возврата 22, если лицензия отсутствует

import os
from pathlib import Path
import shutil
test_dir=Path(__file__).parent.parent.parent / "examples_ts_js"

def test_error_code(analyzer):
    license_original=Path(os.getenv('APPDATA'))/"PVS-Studio"/"Settings.xml"

    license_temp=Path(__file__).parent /"Settings.xml"
    shutil.copy2(license_original, license_temp)

    if license_original.exists():
        
        try:
            license_original.unlink()
            stdout, stderr, returncode, report_file = analyzer(str(test_dir), expected_code=22)
            assert returncode == 22, f"Expected return code 22, but got {returncode}. Stderr: {stderr}"
        finally:
            if not license_original.exists() and license_temp.exists():
                shutil.copy2(license_temp,license_original)
                license_temp.unlink()
    else:
        stdout, stderr, returncode, report_file = analyzer(str(test_dir), expected_code=22)
        assert returncode == 22, f"Expected return code 22, but got {returncode}. Stderr: {stderr}"
