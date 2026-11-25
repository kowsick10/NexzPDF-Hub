import io
from pathlib import Path
from pypdf import PdfWriter, PdfReader


def rotate_pdf(input_path: Path, rotations: list[dict]) -> bytes:
    reader = PdfReader(str(input_path))
    writer = PdfWriter()
    total = len(reader.pages)

    rotation_map = {r["page"]: r["degrees"] for r in rotations if 1 <= r.get("page", 0) <= total}

    for i, page in enumerate(reader.pages, 1):
        new_page = writer.add_page(page)
        if i in rotation_map:
            new_page.rotate(rotation_map[i])

    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()
