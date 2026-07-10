#2.2.2	Конфигурирование работы утилиты анализа через аргументы командной строки
#Для функционирования утилиты анализа во всех сценариях она ДОЛЖНА поддерживать следующий интерфейс командной строки:
#Режим analyze:
#[Single] --file-analysis-timeout — время в формате "XXhYYmZZs", после которого ядро останавливает анализ. При значении 0 
#секунд анализатор ДОЛЖЕН считать, что таймаута нет. При этом ядро возвращает ненулевой код возврата;

#работа программы прерванная по таймауту 

import pytest
from tests_tools import get_big_test_dir,assert_return_code, assert_no_stderr

valid_formats =["99h99m99s","00h20m00s","10h00m00s","01h01m01s"]

@pytest.mark.parametrize("test_dir",get_big_test_dir())
def test_timeout(analyzer, test_dir):
    expected_code=0
    command_line_1= ["analyze", f"{test_dir}", "--file-analysis-timeout"]
    for timeout in valid_formats:
        command_line =command_line_1+[timeout]
        stdout, stderr, returncode, time = analyzer(command_line)
        
        assert_no_stderr(stderr)
        assert_return_code(returncode, expected_code, stderr)

    
    timeout="00h00m01s"
    not_expected_code=0
    command_line = command_line_1+[timeout]
    stdout, stderr, returncode, time = analyzer(command_line)

    if time<=1.0:
        # программа завершилась по истичении отведенного времени и неправильно если вернула 0, так как тестовая дериктория обрабатывается примерно 3 секунды
        assert returncode != not_expected_code, f"Expected return code not equal {not_expected_code}, but got {returncode}."
    else:# программа не остановилась по указанному таймеру, но выполнилась без ошибок
        assert returncode != not_expected_code, f"Expected return code not equal {not_expected_code}, but got {returncode}. Program was NOT stopped by timeout and completed on its own"
    timeout="00h00m00s"
    command_line = command_line_1+[timeout]
    stdout, stderr, returncode, time = analyzer(command_line)
    assert returncode != not_expected_code, f"Expected return code not equal {not_expected_code}, but got {returncode}. Timeout should be disabled and program should complete normally. {stderr}"
    
    
    

    


