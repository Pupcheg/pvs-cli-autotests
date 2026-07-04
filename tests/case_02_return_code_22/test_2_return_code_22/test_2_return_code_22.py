#2.2.14 Коды возврата утилиты анализа
#коды возврата, которые утилита анализа выдаёт хронологически на разных этапах в режиме analyze:
#Проверка лицензии:
#Утилита анализа выдаёт код возврата 22, если лицензия невалидна

import os
from pathlib import Path
import shutil
test_dir=Path(__file__).parent.parent.parent / "examples_ts_js"

def test_error_code(analyzer):
    license_original=Path(os.getenv('APPDATA'))/"PVS-Studio"/"Settings.xml"

    license_temp=Path(__file__).parent /"Settings.xml"
    shutil.copy2(license_original, license_temp)

    content = license_original.read_text(encoding='utf-8')
    license_original.write_text(content[:len(content)//2], encoding='utf-8')

    try:
            
        stdout, stderr, returncode, report_file = analyzer(str(test_dir))
        assert returncode == 22, f"Expected return code 22, but got {returncode}. Stderr: {stderr}"
    finally:
        shutil.copy2(license_temp,license_original)
        license_temp.unlink()

