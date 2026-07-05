import pytest
import os
from run_static_analyzer import run_static_analyzer

@pytest.fixture
def analyzer():
    analyzer_path = os.environ.get("STATIC_ANALYZER_PATH")

    def _run(source_file_path, command_line=None, expected_code=None):
        return run_static_analyzer(analyzer_path, source_file_path, command_line=command_line, expected_code=expected_code)
    return _run
