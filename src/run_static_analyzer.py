import subprocess
from pathlib import Path


def run_static_analyzer(static_analyzer_path, command_line):
    """
    Runs a static analyzer on the given source file.
    You can specify a timeout in seconds. If the static analyzer takes longer than the timeout, it will be terminated.

    """

    if not static_analyzer_path:
        return None, "Static analyzer path must be provided", -1, None
    if not Path(static_analyzer_path).is_file():
        return None, f"Static analyzer not found at {static_analyzer_path}", -1, None   

    command=[f"{static_analyzer_path}"]+command_line

    try:
        result = subprocess.run(command, capture_output=True, text=True)
    except PermissionError:
        return None, f"Permission denied when trying to execute {static_analyzer_path}", -1, None
    except OSError as e:
        return None, f"OS error occurred: {str(e)}", -1, None
    except (TypeError, ValueError) as e:
        return None, f"Invalid argument: {str(e)}", -1, None

    return result.stdout, result.stderr, result.returncode
