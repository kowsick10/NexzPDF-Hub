import io
from pathlib import Path
from pypdf import PdfWriter, PdfReader
from pypdf.errors import PdfReadError


def unlock_pdf(input_path: Path, password: str) -> bytes:
    reader = PdfReader(str(input_path))

    if not reader.is_encrypted:
        raise ValueError("This PDF is not password-protected.")

    success = reader.decrypt(password)
    if success == 0:
        raise PermissionError("Incorrect password. Please verify the document password and try again.")

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()
