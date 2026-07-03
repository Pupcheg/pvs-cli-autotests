import subprocess
from pathlib import Path


def run_static_analyzer(static_analyzer_path, source_file_dir, timeout=None):
    """
    Runs a static analyzer on the given source file.
    You can specify a timeout in seconds. If the static analyzer takes longer than the timeout, it will be terminated.
    """

    source_file_dir = Path(source_file_dir)
    reports_dir= Path(__file__).parent.parent / "reports"
    reports_dir.mkdir(exist_ok=True)
    if not static_analyzer_path or not source_file_dir:
        return None, "Static analyzer path and source file path must be provided", -1, None
    if not Path(static_analyzer_path).is_file():
        return None, f"Static analyzer not found at {static_analyzer_path}", -1, None   
    if not source_file_dir.is_dir():
        return None, f"Source file not found at {source_file_dir}", -1, None
    try:

        cmd=[f"{static_analyzer_path}", "analyze", f"{source_file_dir}", "-o",f"{reports_dir / (source_file_dir.stem + '_report.json')}"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)

    except subprocess.TimeoutExpired:
        return None, f"Static analyzer timed out after {timeout} seconds", -1, None
    except PermissionError:
        return None, f"Permission denied when trying to execute {static_analyzer_path}", -1, None
    except OSError as e:
        return None, f"OS error occurred: {str(e)}", -1, None
    except (TypeError, ValueError) as e:
        return None, f"Invalid argument: {str(e)}", -1, None

    return result.stdout, result.stderr, result.returncode, reports_dir / (source_file_dir.stem + '_report.json')
