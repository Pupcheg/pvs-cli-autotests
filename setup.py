from setuptools import setup, find_packages

setup(
    name="pvs_tester",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "pytest>=9.0.0",
    ],
    python_requires=">=3.13",
)