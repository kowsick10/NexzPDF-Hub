import io
import zipfile
from pathlib import Path
from pypdf import PdfWriter, PdfReader


def parse_ranges(range_str: str, total_pages: int) -> list[int]:
    pages = set()
    for part in range_str.split(","):
        part = part.strip()
        if "-" in part:
            start, end = part.split("-", 1)
            s, e = int(start.strip()), int(end.strip())
            pages.update(range(s, e + 1))
        else:
            pages.add(int(part))
    return sorted(p for p in pages if 1 <= p <= total_pages)


def split_pdf(input_path: Path, mode: str, ranges: str | None = None) -> tuple[bytes, str]:
    reader = PdfReader(str(input_path))
    total = len(reader.pages)

    if mode == "ranges" and ranges:
        pages = parse_ranges(ranges, total)
        if len(pages) == 0:
            raise ValueError("No valid pages in specified range")
        if len(pages) == 1:
            writer = PdfWriter()
            writer.add_page(reader.pages[pages[0] - 1])
            buf = io.BytesIO()
            writer.write(buf)
            return buf.getvalue(), "split.pdf"
        zip_buf = io.BytesIO()
        with zipfile.ZipFile(zip_buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for p in pages:
                writer = PdfWriter()
                writer.add_page(reader.pages[p - 1])
                pbuf = io.BytesIO()
                writer.write(pbuf)
                zf.writestr(f"page_{p}.pdf", pbuf.getvalue())
        return zip_buf.getvalue(), "split_pages.zip"

    elif mode in ("extract", "all"):
        zip_buf = io.BytesIO()
        with zipfile.ZipFile(zip_buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for i, page in enumerate(reader.pages, 1):
                writer = PdfWriter()
                writer.add_page(page)
                pbuf = io.BytesIO()
                writer.write(pbuf)
                zf.writestr(f"page_{i}.pdf", pbuf.getvalue())
        return zip_buf.getvalue(), "all_pages.zip"

    raise ValueError(f"Unknown split mode: {mode}")
