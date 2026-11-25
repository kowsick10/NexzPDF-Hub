import io
import zipfile
from pathlib import Path

try:
    import pypdfium2 as pdfium
    HAS_PDFIUM = True
except ImportError:
    HAS_PDFIUM = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


DPI_MAP = {"standard": 150, "high": 300}


def pdf_to_jpg(input_path: Path, quality: str = "high", pages: list[int] | None = None) -> tuple[bytes, str]:
    if not HAS_PDFIUM:
        raise RuntimeError("pypdfium2 is not installed. Cannot convert PDF to JPG.")

    dpi = DPI_MAP.get(quality, 300)
    scale = dpi / 72.0

    doc = pdfium.PdfDocument(str(input_path))
    total = len(doc)
    target_pages = pages if pages else list(range(total))

    if not target_pages:
        raise ValueError("No pages to convert")

    jpg_buffers = []
    for page_idx in target_pages:
        if page_idx < 0 or page_idx >= total:
            continue
        page = doc[page_idx]
        bitmap = page.render(scale=scale, rotation=0)
        pil_image = bitmap.to_pil()
        buf = io.BytesIO()
        pil_image.save(buf, format="JPEG", quality=92 if quality == "high" else 75)
        jpg_buffers.append((f"page_{page_idx + 1}.jpg", buf.getvalue()))

    doc.close()

    if not jpg_buffers:
        raise ValueError("No pages converted")

    if len(jpg_buffers) == 1:
        return jpg_buffers[0][1], "page_1.jpg"

    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, data in jpg_buffers:
            zf.writestr(name, data)
    return zip_buf.getvalue(), "pdf_images.zip"
