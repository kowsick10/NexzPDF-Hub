import os
import shutil
import subprocess
import tempfile
from pathlib import Path


def word_to_pdf(input_path: Path) -> bytes:
    libreoffice = _find_libreoffice()
    if not libreoffice:
        raise RuntimeError(
            "LibreOffice is not installed or not found in PATH. "
            "Install LibreOffice and ensure 'libreoffice' or 'soffice' is accessible."
        )

    with tempfile.TemporaryDirectory() as tmp_dir:
        profile_dir = os.path.join(tmp_dir, "lo_profile")
        os.makedirs(profile_dir)

        result = subprocess.run(
            [
                libreoffice,
                "--headless",
                "--norestore",
                "--nocrashreport",
                f"-env:UserInstallation=file://{profile_dir}",
                "--convert-to", "pdf",
                "--outdir", tmp_dir,
                str(input_path),
            ],
            capture_output=True,
            timeout=90,
            cwd=tmp_dir,
        )

        if result.returncode != 0:
            stderr = result.stderr.decode("utf-8", errors="ignore")
            raise RuntimeError(f"LibreOffice conversion failed: {stderr[:200]}")

        pdf_name = input_path.stem + ".pdf"
        output_path = Path(tmp_dir) / pdf_name

        if not output_path.exists():
            for f in Path(tmp_dir).glob("*.pdf"):
                output_path = f
                break

        if not output_path.exists():
            raise RuntimeError("LibreOffice did not produce a PDF output file")

        return output_path.read_bytes()


def _find_libreoffice() -> str | None:
    for name in ("libreoffice", "soffice"):
        path = shutil.which(name)
        if path:
            return path
    common_paths = [
        "/usr/bin/libreoffice",
        "/usr/bin/soffice",
        "/usr/local/bin/libreoffice",
        "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
        "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
    ]
    for p in common_paths:
        if os.path.exists(p):
            return p
    return None
