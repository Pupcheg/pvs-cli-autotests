from src.run_tests import run_tests

if __name__ == "__main__":  # пример работы
    stdout, stderr, code = run_tests(
        "C:\\Program Files (x86)\\PVS-Studio\\pvs-js\\pvs-js.exe")
    print(stdout, stderr, code)
 