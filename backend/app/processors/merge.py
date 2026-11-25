import io
from pathlib import Path
from pypdf import PdfWriter, PdfReader


def merge_pdfs(input_paths: list[Path]) -> bytes:
    writer = PdfWriter()
    for path in input_paths:
        reader = PdfReader(str(path))
        for page in reader.pages:
            writer.add_page(page)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()
