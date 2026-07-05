import subprocess
import sys
import os

def run_tests(static_analyzer_path,):
    test_folder_path = os.path.join(os.path.dirname(__file__), "..", "tests")
    env = os.environ.copy()
    env["STATIC_ANALYZER_PATH"] = static_analyzer_path
    command = [sys.executable, "-m", "pytest", test_folder_path]
    tests_result = subprocess.run(
        command, capture_output=True, text=True, env=env)
    return tests_result.stdout, tests_result.stderr, tests_result.returncode
