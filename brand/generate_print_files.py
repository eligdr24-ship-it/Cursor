from pathlib import Path
from xml.sax.saxutils import escape

import cairosvg
from PIL import Image
from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"
PRINT = ROOT / "print"
SOURCE.mkdir(parents=True, exist_ok=True)
PRINT.mkdir(parents=True, exist_ok=True)

NAVY = "#0A2342"
GOLD = "#C99532"
CREAM = "#F7F4ED"
INK = "#172033"
FONT = "Noto Sans, DejaVu Sans, sans-serif"


def svg_document(width_mm: float, height_mm: float, body: str, view_width: int, view_height: int) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg"
  width="{width_mm}mm" height="{height_mm}mm"
  viewBox="0 0 {view_width} {view_height}">
  {body}
</svg>
"""


def door_mark(x: float, y: float, size: float, dark: str = NAVY, accent: str = GOLD) -> str:
    """A simple open-door mark built as vector geometry."""
    return f"""
    <g transform="translate({x} {y}) scale({size / 1000})">
      <path fill="{dark}" d="M120 120 L520 205 L520 300 L330 340 L330 790 L430 810 L430 885 L120 950 Z"/>
      <path fill="{accent}" d="M485 300 L880 190 L880 950 L485 860 L485 785 L670 750 L670 430 L485 370 Z"/>
      <circle cx="626" cy="585" r="17" fill="{dark}"/>
    </g>"""


def text(x: float, y: float, value: str, size: int, fill: str, weight: int = 400,
         spacing: float = 0, anchor: str = "start") -> str:
    safe = escape(value)
    return (
        f'<text x="{x}" y="{y}" fill="{fill}" font-family="{FONT}" '
        f'font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}" '
        f'text-anchor="{anchor}">{safe}</text>'
    )


sign = svg_document(
    300,
    150,
    f"""
    <rect width="3000" height="1500" fill="{NAVY}"/>
    <rect x="75" y="75" width="2850" height="1350" rx="24" fill="none" stroke="{GOLD}" stroke-width="8"/>
    {door_mark(190, 260, 920, CREAM, GOLD)}
    <line x1="1200" y1="350" x2="1200" y2="1150" stroke="{GOLD}" stroke-width="8"/>
    {text(1370, 590, "GS", 330, GOLD, 700, 12)}
    {text(1370, 790, "CUSTOM DOORS", 150, CREAM, 700, 8)}
    {text(1375, 915, "INC.", 74, GOLD, 700, 18)}
    <line x1="1375" y1="985" x2="2705" y2="985" stroke="{GOLD}" stroke-width="5"/>
    {text(1375, 1085, "4885 Fulton Dr Ste C  •  Fairfield, CA 94534-4206", 55, CREAM, 400)}
    {text(1375, 1180, "(650) 634-8570", 82, GOLD, 700, 2)}
    """,
    3000,
    1500,
)

card_front = svg_document(
    95.25,
    57.15,
    f"""
    <rect width="1125" height="675" fill="{NAVY}"/>
    <rect x="75" y="75" width="975" height="525" rx="12" fill="none" stroke="{GOLD}" stroke-width="3"/>
    {door_mark(106, 116, 440, CREAM, GOLD)}
    <line x1="550" y1="155" x2="550" y2="520" stroke="{GOLD}" stroke-width="4"/>
    {text(615, 280, "GS", 140, GOLD, 700, 5)}
    {text(615, 365, "CUSTOM DOORS", 58, CREAM, 700, 3)}
    {text(619, 420, "INC.", 30, GOLD, 700, 8)}
    """,
    1125,
    675,
)

card_back = svg_document(
    95.25,
    57.15,
    f"""
    <rect width="1125" height="675" fill="{CREAM}"/>
    <rect x="75" y="75" width="975" height="525" rx="12" fill="none" stroke="{NAVY}" stroke-width="3"/>
    {door_mark(78, 177, 275, NAVY, GOLD)}
    {text(390, 180, "GS CUSTOM DOORS INC.", 54, NAVY, 700, 1)}
    <line x1="390" y1="220" x2="1015" y2="220" stroke="{GOLD}" stroke-width="5"/>
    {text(390, 322, "(650) 634-8570", 55, GOLD, 700, 1)}
    {text(390, 420, "4885 Fulton Dr Ste C", 39, INK, 400)}
    {text(390, 480, "Fairfield, CA 94534-4206", 39, INK, 400)}
    """,
    1125,
    675,
)


def export(name: str, svg: str, width_px: int, height_px: int) -> tuple[Path, Path]:
    svg_path = SOURCE / f"{name}.svg"
    pdf_path = PRINT / f"{name}.pdf"
    jpg_path = PRINT / f"{name}_300dpi.jpg"
    png_path = PRINT / f".{name}.png"
    svg_path.write_text(svg, encoding="utf-8")
    cairosvg.svg2pdf(bytestring=svg.encode(), write_to=str(pdf_path))
    cairosvg.svg2png(
        bytestring=svg.encode(),
        write_to=str(png_path),
        output_width=width_px,
        output_height=height_px,
    )
    with Image.open(png_path) as image:
        image.convert("RGB").save(
            jpg_path,
            "JPEG",
            quality=98,
            subsampling=0,
            dpi=(300, 300),
        )
    png_path.unlink()
    return pdf_path, jpg_path


sign_pdf, _ = export("sign_30x15cm", sign, 3543, 1772)
front_pdf, _ = export("business_card_front_with_bleed", card_front, 1125, 675)
back_pdf, _ = export("business_card_back_with_bleed", card_back, 1125, 675)

writer = PdfWriter()
for file in (front_pdf, back_pdf):
    writer.add_page(PdfReader(file).pages[0])
with (PRINT / "business_card_two_page_print.pdf").open("wb") as output:
    writer.write(output)

print(f"Created print package in {PRINT}")
