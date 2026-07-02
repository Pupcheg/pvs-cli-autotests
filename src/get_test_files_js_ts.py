from pathlib import Path


def get_test_files_js_ts(test_folder):
    """
    Returns a list of all .js and .ts files in the given test folder.
    """
    test_files = []
    folder_path = Path(test_folder)
    test_files.extend([str(file) for file in folder_path.glob("*.js")])
    test_files.extend([str(file) for file in folder_path.glob("*.ts")])
    return test_files
