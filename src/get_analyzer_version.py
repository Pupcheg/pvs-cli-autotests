import subprocess
from pathlib import Path

def get_analyzer_version(analyzer_path):
    cmd = [f"{analyzer_path}", "--version"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout

