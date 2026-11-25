import io
from pathlib import Path
from PIL import Image


PAGE_SIZES = {
    "a4": (595, 842),
    "letter": (612, 792),
}

MARGINS = {
    "none": 0,
    "small": 20,
    "medium": 40,
}


def jpg_to_pdf(
    image_paths: list[Path],
    orientation: str = "portrait",
    page_size: str = "a4",
    margin: str = "small",
) -> bytes:
    images = []
    for path in image_paths:
        img = Image.open(str(path)).convert("RGB")
        images.append(img)

    if not images:
        raise ValueError("No valid images provided")

    if page_size == "original":
        first = images[0]
        w, h = first.size
        if orientation == "landscape" and w < h:
            w, h = h, w
        elif orientation == "portrait" and w > h:
            w, h = h, w
        canvas_size = (w, h)
    else:
        canvas_size = PAGE_SIZES.get(page_size, PAGE_SIZES["a4"])
        if orientation == "landscape":
            canvas_size = (canvas_size[1], canvas_size[0])

    margin_px = MARGINS.get(margin, 20)
    available_w = canvas_size[0] - 2 * margin_px
    available_h = canvas_size[1] - 2 * margin_px

    pdf_images = []
    for img in images:
        canvas = Image.new("RGB", canvas_size, (255, 255, 255))
        iw, ih = img.size
        scale = min(available_w / iw, available_h / ih)
        new_w, new_h = int(iw * scale), int(ih * scale)
        resized = img.resize((new_w, new_h), Image.LANCZOS)
        x = margin_px + (available_w - new_w) // 2
        y = margin_px + (available_h - new_h) // 2
        canvas.paste(resized, (x, y))
        pdf_images.append(canvas)

    buf = io.BytesIO()
    if len(pdf_images) == 1:
        pdf_images[0].save(buf, format="PDF", resolution=100)
    else:
        pdf_images[0].save(buf, format="PDF", resolution=100, save_all=True, append_images=pdf_images[1:])
    return buf.getvalue()
