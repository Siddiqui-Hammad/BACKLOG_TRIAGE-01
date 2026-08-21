"""
Backend CLI Launcher.
"""
import uvicorn

if __name__ == "__main__":
    print("Starting Judicial Case Backlog Triage Engine Backend on http://127.0.0.1:8000")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
