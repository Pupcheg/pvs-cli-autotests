try:
    from run_tests import run_tests
    from report_builder import build_report
    from get_analyzer_version import get_analyzer_version
except ModuleNotFoundError:
    print("Library not installed. Use ","pip install -e .",".")
import argparse
import os



if __name__ == "__main__":  # используйте только анлийские буквы в путях 
    parser = argparse.ArgumentParser()
    parser.add_argument("analyzer_path", help="Path to the executable file (*.exe) to be tested.")
    parser.add_argument("--report", default=None, help="Path to save the report (*.md)")
    args = parser.parse_args()
    if os.path.exists(args.analyzer_path) and os.path.isfile(args.analyzer_path):
    
        tests_dir = os.path.join(os.path.dirname(__file__), "tests")
        stdout, stderr, code = run_tests(args.analyzer_path, test_folder_path=tests_dir)
        print(stdout, stderr, code)

        build_report(
            reports_dir="reports",
            output_path=args.report,
            analyzer_version=get_analyzer_version(args.analyzer_path)
        )
    else:
        print("Рath invalid.")
