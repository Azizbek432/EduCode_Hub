from fastapi import APIRouter
from schemas import CodeRequest
import subprocess
import tempfile
import os

router = APIRouter(prefix="/code", tags=["Code Runner"])

@router.post("/run")
async def run_code(request: CodeRequest):
    with tempfile.NamedTemporaryFile(
        mode='w', suffix='.py', delete=False, encoding='utf-8'
    ) as f:
        f.write(request.code)
        tmp_path = f.name

    try:
        result = subprocess.run(
            ["python", tmp_path],
            capture_output=True,
            text=True,
            timeout=5,
            encoding='utf-8'
        )
        output = result.stdout or result.stderr
        return {
            "output": output if output else "Natija yo'q (print() ishlating)",
            "error": bool(result.stderr),
            "returncode": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"output": "⏱ Vaqt tugadi (5 soniya limit)", "error": True, "returncode": -1}
    except Exception as e:
        return {"output": f"Server xatosi: {str(e)}", "error": True, "returncode": -1}
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)