import io
import subprocess
import tempfile
import shutil
from pathlib import Path
from pypdf import PdfWriter, PdfReader


def compress_pdf(input_path: Path, level: str) -> bytes:
    if shutil.which("qpdf"):
        return _compress_with_qpdf(input_path, level)
    return _compress_with_pypdf(input_path, level)


def _compress_with_qpdf(input_path: Path, level: str) -> bytes:
    compress_level = {"low": "2", "recommended": "6", "high": "9"}.get(level, "6")
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        result = subprocess.run(
            ["qpdf", "--linearize", f"--compress-streams=y",
             f"--compression-level={compress_level}",
             str(input_path), str(tmp_path)],
            capture_output=True, timeout=60
        )
        if result.returncode == 0 and tmp_path.exists():
            data = tmp_path.read_bytes()
            original_size = input_path.stat().st_size
            if len(data) < original_size:
                return data
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    finally:
        tmp_path.unlink(missing_ok=True)
    return _compress_with_pypdf(input_path, level)


def _compress_with_pypdf(input_path: Path, level: str) -> bytes:
    reader = PdfReader(str(input_path))
    writer = PdfWriter()
    for page in reader.pages:
        if level in ("recommended", "high"):
            page.compress_content_streams()
        writer.add_page(page)
    if level == "high":
        for page in writer.pages:
            for img in page.images:
                img.replace(img.image, quality=50)
    buf = io.BytesIO()
    writer.write(buf)
    result = buf.getvalue()
    original_size = input_path.stat().st_size
    if len(result) >= original_size:
        return input_path.read_bytes()
    return result
