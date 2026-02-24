@echo off
echo Starting ScreenFree Backend...
cd Backend
call .\myenv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000
pause
