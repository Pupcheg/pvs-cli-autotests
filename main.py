from src.run_tests import run_tests
import argparse
import os

if __name__ == "__main__":  # пример работы. используйте только анлийские буквы в путях 
    parser = argparse.ArgumentParser()
    parser.add_argument("analyzer_path", help="Path to the executable file (*.exe).")
    parser.add_argument("--report",default="reports", help="Path to save the report (*.md).")# пока не работает. Жду когда Родион поправит код для отчетов
    args=parser.parse_args()
    if os.path.exists(args.analyzer_path) and os.path.isfile(args.analyzer_path):
        stdout, stderr, code = run_tests(args.analyzer_path)
        print(stdout, stderr, code)
    else:
        print("Рath invalid.")
    
 