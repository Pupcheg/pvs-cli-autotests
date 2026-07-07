from pathlib import Path
import platform
import os

def get_license_path():
    system=platform.system()
    if system == 'Windows':
        return Path(os.getenv('APPDATA'))/"PVS-Studio"/"Settings.xml"
    elif system=='Darwin':
        return Path.home() / ".config" / "PVS-Studio" / "PVS-Studio.lic"
    else:
        return Path.home() / ".config" / "PVS-Studio" / "PVS-Studio.lic"


def get_test_dirs():
    test_dir=Path(__file__).parent.parent / "tests" /"examples_ts_js" 
    return [d for d in test_dir.iterdir() if d.is_dir()]

def assert_return_code(return_code, expected_code, stderr):
    assert return_code == expected_code, f"Expected return code {expected_code}, but got {return_code}. Stderr: {stderr}"

def assert_no_stderr(stderr):
    assert stderr == "", f"Expected no stderr output, but got: {stderr}"

def assers_json(report_content):
    assert isinstance(report_content, dict), f"Expected report content to be a dictionary, but got {type(report_content)}"
    assert "version" in report_content, "Not a PVS-Studio report"
    assert "warnings" in report_content, "Missing 'warnings' field"
    assert isinstance(report_content["warnings"], list), "Warnings should be a list"

