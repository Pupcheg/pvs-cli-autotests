import subprocess
import json
from pathlib import Path


def run_static_analyzer(static_analyzer_path, source_file_dir, timeout=None):
    """
    Runs a static analyzer on the given source file.
    You can specify a timeout in seconds. If the static analyzer takes longer than the timeout, it will be terminated.

    Запускает статический анализатор, расположенный по указанному пути, на заданном файле.
    Можно указать тайм-аут в секундах. Если статический анализатор выполняется дольше указанного времени, он будет завершен.
    """
    source_file_dir = Path(source_file_dir)
    reports_dir = Path(__file__).parent.parent / "reports"
    reports_dir.mkdir(exist_ok=True)
    
    if not static_analyzer_path or not source_file_dir:
        return None, "Static analyzer path and source file path must be provided", -1
    
    try:
        report_path = reports_dir / (source_file_dir.stem + '_report.json')
        cmd = [str(static_analyzer_path), "analyze", str(source_file_dir), "-o", str(report_path)]
        print("Команда:", " ".join(cmd))
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        
        # Сохраняем код возврата в JSON-отчёт
        if report_path.exists():
            with open(report_path, 'r', encoding='utf-8') as f:
                report_data = json.load(f)
            report_data['returncode'] = result.returncode
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2)
        else:
            # Если отчёт не создан, создаём его с ошибкой
            error_report = {
                "returncode": result.returncode,
                "warnings": [],
                "error": "Report file was not created by analyzer",
                "stderr": result.stderr
            }
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(error_report, f, indent=2)
        
    except FileNotFoundError:
        return None, f"Static analyzer not found at {static_analyzer_path}", -1
    except subprocess.TimeoutExpired:
        return None, f"Static analyzer timed out after {timeout} seconds", -1
    except PermissionError:
        return None, f"Permission denied when trying to execute {static_analyzer_path}", -1
    except OSError as e:
        return None, f"OS error occurred: {str(e)}", -1
    except (TypeError, ValueError) as e:
        return None, f"Invalid argument: {str(e)}", -1
    except Exception as e:
        return None, str(e), -1

    return result.stdout, result.stderr, result.returncode, report_path
