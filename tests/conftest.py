import pytest
import os
from pathlib import Path
from run_static_analyzer import run_static_analyzer

@pytest.fixture
def report_path():
    return Path(__file__).parent.parent / "reports"

@pytest.fixture
def test_name(request):
    return Path(request.module.__file__).stem

@pytest.fixture
def analyzer():
    analyzer_path = os.environ.get("STATIC_ANALYZER_PATH")

    def _run(command_line):
        return run_static_analyzer(analyzer_path, command_line)
    return _run


