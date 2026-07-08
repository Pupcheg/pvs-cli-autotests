import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from src.report_generator import generate_report


def parse_pytest_output(stdout: str, stderr: str) -> Dict[str, Dict[str, Any]]:
    """
    Парсит вывод pytest и возвращает словарь:
    {имя_теста: {"status": "passed"|"failed", "returncode": int, "expected_code": int}}
    """
    output = stdout + "\n" + stderr
    results = {}
    lines = output.splitlines()

    # Предварительно находим все ошибки с их позициями
    errors = []
    for idx, line in enumerate(lines):
        match = re.search(r'Expected return code (\d+), but got (\d+)', line)
        if match:
            errors.append((idx, int(match.group(1)), int(match.group(2))))

    # Ищем тесты
    for i, line in enumerate(lines):
        # Ищем строки с результатами тестов
        if ".py" in line and re.search(r'\s+[\.F]', line):
            # Извлекаем имя теста (имя файла)
            test_match = re.search(r'([^/\\]+)\.py', line)
            if not test_match:
                continue
            test_name = test_match.group(1)

            # Определяем статус
            if "F" in line:
                status = "failed"
                # Ищем ошибку в следующих строках до следующего теста
                next_test_idx = None
                for j in range(i + 1, len(lines)):
                    if ".py" in lines[j] and re.search(r'\s+[\.F]', lines[j]):
                        next_test_idx = j
                        break
                if next_test_idx is None:
                    next_test_idx = len(lines)

                found_error = None
                for err_idx, expected, actual in errors:
                    if i < err_idx < next_test_idx:
                        found_error = (expected, actual)
                        break

                if found_error:
                    expected, actual = found_error
                    results[test_name] = {
                        "status": status,
                        "returncode": actual,
                        "expected_code": expected
                    }
                else:
                    results[test_name] = {"status": status, "returncode": None, "expected_code": None}
            elif "." in line:
                results[test_name] = {"status": "passed", "returncode": None, "expected_code": None}

    return results


def collect_results_from_reports(
    reports_dir: str = "reports",
    stdout: str = "",
    stderr: str = ""
) -> List[Dict[str, Any]]:
    """
    Собирает результаты из всех JSON-отчётов в папке reports.
    """
    results = []
    reports_path = Path(reports_dir)

    if not reports_path.exists():
        print(f"Папка с отчётами не найдена: {reports_dir}")
        return results

    json_files = list(reports_path.glob("*.json"))
    if not json_files:
        print(f"JSON-файлы не найдены в {reports_dir}")
        return results

    test_statuses = parse_pytest_output(stdout, stderr)

    for report_file in json_files:
        case_name = report_file.stem

        try:
            with open(report_file, "r", encoding="utf-8") as f:
                report_data = json.load(f)

            warnings = report_data.get("warnings", [])

            # Извлекаем имя теста из имени файла
            test_name = case_name.replace("_report", "")
            matched_test = None
            for known_test in test_statuses.keys():
                if known_test in test_name:
                    matched_test = known_test
                    break

            if matched_test is None:
                parts = case_name.split("_")
                matched_test = "_".join(parts[-2:]) if len(parts) >= 2 else case_name

            test_info = test_statuses.get(matched_test, {})
            status_from_pytest = test_info.get("status", "unknown")
            expected_code = test_info.get("expected_code")
            returncode = test_info.get("returncode")

            # Если returncode не найден в pytest, берем из JSON
            if returncode is None:
                returncode = report_data.get("returncode", -1)

            # Определяем статус
            if status_from_pytest == "passed":
                status = "соответствует"
            elif status_from_pytest == "failed":
                if expected_code is not None:
                    status = "соответствует" if returncode == expected_code else "не соответствует"
                else:
                    status = "неизвестно"
            else:
                status = "неизвестно"

            # Формируем список предупреждений
            warnings_list = []
            for w in warnings[:5]:
                code = w.get("code", "V???")
                message = w.get("message", "")
                if message:
                    warnings_list.append(f"{code}: {message[:50]}...")
                else:
                    warnings_list.append(code)

            warnings_text = ", ".join(warnings_list)
            if len(warnings) > 5:
                warnings_text += f" и ещё {len(warnings) - 5} шт."
            if not warnings_text:
                warnings_text = "нет предупреждений"

            # Определяем направление по имени файла
            direction = "CLI"
            name_lower = case_name.lower()
            if "return_code" in name_lower or "code" in name_lower:
                direction = "Коды возврата"
            elif "path" in name_lower or "glob" in name_lower:
                direction = "Пути и glob-паттерны"
            elif "report" in name_lower or "format" in name_lower:
                direction = "Формат отчёта"
            elif "suppress" in name_lower or "filter" in name_lower:
                direction = "Подавление"
            elif "rpc" in name_lower or "communication" in name_lower or "ide" in name_lower:
                direction = "JSON-RPC"
            elif "help" in name_lower or "version" in name_lower:
                direction = "Справочная информация"

            if expected_code is not None:
                actual_text = f"ожидался код {expected_code}, получен {returncode}, предупреждения: {warnings_text}"
            else:
                actual_text = f"код возврата {returncode}, предупреждения: {warnings_text}"

            result = {
                "case_name": case_name.replace("_report", "").replace("_", " ").title(),
                "requirement": "См. спецификацию, разделы 2.2.2, 2.2.3, 2.2.14",
                "description": f"Проверка поведения анализатора на тестовом примере",
                "test_data": str(report_file.parent),
                "command": f"pvs-js analyze {case_name}",
                "actual": actual_text,
                "status": status,
                "direction": direction
            }

            results.append(result)

        except json.JSONDecodeError as e:
            print(f"Ошибка парсинга JSON в {report_file}: {e}")
        except Exception as e:
            print(f"Ошибка при чтении {report_file}: {e}")

    return results


def build_report(
    reports_dir: str = "reports",
    output_path: Optional[str] = None,
    analyzer_version: Optional[str] = None,
    stdout: str = "",
    stderr: str = ""
):
    """
    Собирает результаты и генерирует отчёт.

    - reports_dir: папка, где лежат JSON-отчёты (по умолчанию "reports")
    - output_path: куда сохранить report.md (если None, то reports/final/report.md)
    - analyzer_version: версия анализатора
    - stdout: вывод pytest (stdout)
    - stderr: вывод pytest (stderr)
    """
    results = collect_results_from_reports(reports_dir, stdout, stderr)
    if not results:
        print("Не найдено результатов для отчёта.")
        return

    if output_path is None:
        final_dir = Path(reports_dir) / "final"
        final_dir.mkdir(parents=True, exist_ok=True)
        output_path = str(final_dir / "report.md")

    generate_report(results, output_path=output_path, analyzer_version=analyzer_version)
    print(f"Отчёт сохранён: {Path(output_path).absolute()}")
