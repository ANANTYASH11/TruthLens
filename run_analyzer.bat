@echo off
echo Running DeepFake Analyzer...
cd /d "%~dp0"
python dfa-core\run_analyzer.py
pause 