try:
    from run_tests import run_tests
    from report_builder import build_report
    from get_analyzer_version import get_analyzer_version
    from remove_json_reports import remove_json_reports
except ModuleNotFoundError:
    print("Package not installed. Use ","pip install -e .",".")
    exit(1)
import argparse
import os

if __name__ == "__main__":  # используйте только латиницу в путях 
    parser = argparse.ArgumentParser()
    parser.add_argument("analyzer_path", help="Path to the executable file (*.exe) to be tested.")
    parser.add_argument(
        "--report",
        default=None,
        help="Path to save the report.md (optional). Must be a full path to a file, e.g. C:\\reports\\result.md. If not specified, saves to reports/final/report.md"
    )
    args = parser.parse_args()
    if os.path.exists(args.analyzer_path) and os.path.isfile(args.analyzer_path):
    
        stdout, stderr, code = run_tests(args.analyzer_path)
        print(stdout, stderr, code)

        build_report(
            reports_dir="reports",
            output_path=args.report,
            analyzer_version=get_analyzer_version(args.analyzer_path),
            stdout=stdout,
            stderr=stderr
        )
        remove_json_reports()
    else:
        print("Path invalid.")
