#2.2.2	Конфигурирование работы утилиты анализа через аргументы командной строки
#Для функционирования утилиты анализа во всех сценариях она ДОЛЖНА поддерживать следующий интерфейс командной строки:
#Режим analyze:
#[Single] -o, --output=/path/to/output — путь до результирующего отчёта анализатора. Если флаг опущен, 
#то результирующий отчёт формируется во входной директории или в родительской директории входного файла с именем PVS-Studio.json. 
#Если необходимо выдать результат в stdout, пользователь может передать символ - как аргумент флага.

#Если флаг опущен, то результирующий отчёт формируется во входной директории или в родительской директории входного файла с именем PVS-Studio.json.

import pytest
import json
import shutil
from pathlib import Path
from tests_tools import assert_return_code, assert_no_stderr,asserts_json


path_1= Path(__file__).parent.parent.parent /"examples_ts_js" 
path_2=Path(__file__).parent /"examples_ts_js" 

if path_2.exists():
    shutil.rmtree(path_2)
shutil.copytree(path_1,path_2)

test_dirs= [d for d in path_2.iterdir() if d.is_dir()]



@pytest.mark.parametrize("test_dir",test_dirs)
def test_error_code(analyzer,test_dir):
    expected_code=0

    report_file= path_2 / "PVS-Studio.json"
    command_line = ["analyze", f"{test_dir}"]
    stdout, stderr, returncode = analyzer(command_line)

    assert_return_code(returncode, expected_code, stderr)

    assert report_file.exists(), f"Expected report file {report_file} to exist, but it does not."

    with report_file.open("r") as f:
        report_content = json.load(f)

    assert_no_stderr(stderr)

    asserts_json(report_content)
