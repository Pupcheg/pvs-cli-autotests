import pytest
#import sys
import os
#from pathlib import Path
#sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from run_static_analyzer import run_static_analyzer

@pytest.fixture
def analyzer():
    analyzer_path = os.environ.get("STATIC_ANALYZER_PATH")

    def _run(source_file_path, expected_code=None):
        return run_static_analyzer(analyzer_path, source_file_path, expected_code=expected_code)
    return _run
