import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from report_generator import generate_report


def collect_results_from_reports(reports_dir: str = "reports") -> List[Dict[str, Any]]:
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

    for report_file in json_files:
        case_name = report_file.stem

        try:
            with open(report_file, "r", encoding="utf-8") as f:
                report_data = json.load(f)

            warnings = report_data.get("warnings", [])
            returncode = report_data.get("returncode", -1)
            
            # Определяем статус на основе кода возврата
            # 0, 1, 2, 4 – ожидаемые для 12 рассматриваемых кейсов
            if returncode in [0, 1, 2, 4]:
                status = "соответствует"
            else:
                status = "не соответствует"
            
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

            result = {
                "case_name": case_name.replace("_report", "").replace("_", " ").title(),
                "requirement": "См. спецификацию, разделы 2.2.2, 2.2.3, 2.2.14",
                "description": f"Проверка поведения анализатора на тестовом примере",
                "test_data": str(report_file.parent),
                "command": f"pvs-js analyze {case_name}",
                "actual": f"код возврата {returncode}, предупреждения: {warnings_text}",
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
    analyzer_version: Optional[str] = None
):
    """
    Собирает результаты и генерирует отчёт.

    - reports_dir: папка, где лежат JSON-отчёты (по умолчанию "reports")
    - output_path: куда сохранить report.md (если None, то reports/final/report.md)
    - analyzer_version: версия анализатора
    """
    results = collect_results_from_reports(reports_dir)
    if not results:
        print("Не найдено результатов для отчёта.")
        return

    if output_path is None:
        final_dir = Path(reports_dir) / "final"
        final_dir.mkdir(parents=True, exist_ok=True)
        output_path = str(final_dir / "report.md")

    generate_report(results, output_path=output_path, analyzer_version=analyzer_version)
    print(f"Отчёт сохранён: {Path(output_path).absolute()}")


if __name__ == "__main__":
    reports_dir = Path(__file__).parent.parent / "reports"
    build_report(str(reports_dir), analyzer_version="1.2.3")
