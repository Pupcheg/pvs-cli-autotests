from src.run_tests import run_tests
from src.report_builder import build_report

if __name__ == "__main__":
    # 1. Запускаем тесты
    stdout, stderr, code = run_tests(
        "C:\\Program Files (x86)\\PVS-Studio\\pvs-js\\pvs-js.exe")
    print(stdout, stderr, code)
    
    # 2. Генерируем отчёт по результатам
    build_report(
        reports_dir="reports",
        analyzer_version="7.42.122+486086bb"  # версия из --version
    )
    
