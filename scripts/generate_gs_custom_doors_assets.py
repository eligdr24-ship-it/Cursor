#!/usr/bin/env python3
"""Generate print-ready sign and business card assets for GS Custom Doors."""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "designs" / "gs-custom-doors"
CHROME = "/usr/bin/google-chrome-stable"


COLORS = {
    "charcoal": "#242524",
    "charcoal_2": "#343633",
    "wood": "#A8753F",
    "wood_dark": "#80562E",
    "paper": "#F7F2E8",
    "cream": "#FFF9EF",
    "muted": "#696761",
}


def run(args: list[str]) -> None:
    subprocess.run(args, check=True)


def html_page(svg: str, width_css: str, height_css: str) -> str:
    return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page {{ size: {width_css} {height_css}; margin: 0; }}
    html, body {{
      margin: 0;
      width: {width_css};
      height: {height_css};
      overflow: hidden;
      background: white;
    }}
    * {{ box-sizing: border-box; }}
    svg {{
      display: block;
      width: {width_css};
      height: {height_css};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
  </style>
</head>
<body>
{svg}
</body>
</html>
"""


def logo_svg(x: float, y: float, scale: float = 1.0, dark: bool = True) -> str:
    bg = COLORS["charcoal"] if dark else COLORS["cream"]
    fill = COLORS["charcoal"] if dark else COLORS["cream"]
    wood = COLORS["wood"]
    return f"""
      <g transform="translate({x} {y}) scale({scale})">
        <rect x="0" y="0" width="34" height="46" rx="3" fill="{bg}"/>
        <rect x="5.5" y="5.5" width="23" height="35" rx="1.8" fill="{COLORS['cream']}"/>
        <path d="M17 5.5 L28.5 10.7 V40.5 H17 Z" fill="{wood}"/>
        <circle cx="24" cy="24" r="1.2" fill="{COLORS['cream']}"/>
        <text x="17" y="29" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
              font-size="10.5" font-weight="700" letter-spacing="0.7" fill="{fill}">GS</text>
      </g>
    """


def sign_svg() -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" role="img" aria-label="Gs Custom Doors Inc business sign">
  <rect width="300" height="150" fill="{COLORS['paper']}"/>
  <rect x="5" y="5" width="290" height="140" rx="4" fill="none" stroke="{COLORS['wood']}" stroke-width="2"/>
  <rect x="10" y="10" width="280" height="130" rx="2" fill="none" stroke="{COLORS['charcoal']}" stroke-width="0.6" opacity="0.18"/>
  {logo_svg(24, 31, 1.78)}
  <line x1="98" y1="34" x2="98" y2="116" stroke="{COLORS['wood']}" stroke-width="1.2"/>
  <text x="116" y="62" font-family="Arial, Helvetica, sans-serif" font-size="14.6"
        font-weight="700" letter-spacing="0.75" fill="{COLORS['charcoal']}">Gs Custom Doors Inc.</text>
  <text x="117" y="79" font-family="Arial, Helvetica, sans-serif" font-size="5.1"
        font-weight="700" letter-spacing="1.75" fill="{COLORS['wood_dark']}">CUSTOM DOORS • DESIGN • INSTALLATION</text>
  <rect x="116" y="91" width="151" height="0.8" fill="{COLORS['wood']}"/>
  <text x="116" y="106" font-family="Arial, Helvetica, sans-serif" font-size="5.7"
        font-weight="600" letter-spacing="0.3" fill="{COLORS['charcoal_2']}">4885 Fulton Dr Ste C, Fairfield, CA 94534-4206</text>
  <text x="116" y="119" font-family="Arial, Helvetica, sans-serif" font-size="7.2"
        font-weight="700" letter-spacing="0.8" fill="{COLORS['charcoal']}">(650) 634-8570</text>
</svg>"""


def card_front_svg() -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95.25 57.15" role="img" aria-label="Gs Custom Doors Inc business card front">
  <rect width="95.25" height="57.15" fill="{COLORS['paper']}"/>
  <rect x="3" y="3" width="89.25" height="51.15" rx="2" fill="none" stroke="{COLORS['wood']}" stroke-width="0.6"/>
  {logo_svg(8.2, 12.2, 0.62)}
  <text x="35.5" y="20.5" font-family="Arial, Helvetica, sans-serif" font-size="4.55"
        font-weight="700" letter-spacing="0.08" fill="{COLORS['charcoal']}">Gs Custom Doors Inc.</text>
  <text x="35.7" y="27.1" font-family="Arial, Helvetica, sans-serif" font-size="1.95"
        font-weight="700" letter-spacing="0.52" fill="{COLORS['wood_dark']}">CUSTOM DOORS • DESIGN • INSTALL</text>
  <line x1="35.5" y1="31.2" x2="84.2" y2="31.2" stroke="{COLORS['wood']}" stroke-width="0.35"/>
  <text x="35.5" y="38" font-family="Arial, Helvetica, sans-serif" font-size="3.05"
        font-weight="700" fill="{COLORS['charcoal']}">(650) 634-8570</text>
  <text x="35.5" y="44" font-family="Arial, Helvetica, sans-serif" font-size="2.75"
        font-weight="600" fill="{COLORS['muted']}">4885 Fulton Dr Ste C</text>
  <text x="35.5" y="49" font-family="Arial, Helvetica, sans-serif" font-size="2.75"
        font-weight="600" fill="{COLORS['muted']}">Fairfield, CA 94534-4206</text>
</svg>"""


def card_back_svg() -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95.25 57.15" role="img" aria-label="Gs Custom Doors Inc business card back">
  <rect width="95.25" height="57.15" fill="{COLORS['charcoal']}"/>
  <rect x="3" y="3" width="89.25" height="51.15" rx="2" fill="none" stroke="{COLORS['wood']}" stroke-width="0.65"/>
  <path d="M18 8 L43 18 V49 H18 Z" fill="{COLORS['wood']}" opacity="0.28"/>
  <path d="M23 13 L38 20 V45 H23 Z" fill="{COLORS['paper']}" opacity="0.08"/>
  <text x="47.5" y="26" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="15.5" font-weight="700" letter-spacing="2.2" fill="{COLORS['cream']}">GS</text>
  <text x="47.5" y="36" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="4.1" font-weight="700" letter-spacing="1.75" fill="{COLORS['wood']}">CUSTOM DOORS</text>
  <text x="47.5" y="44.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="2.65" font-weight="600" letter-spacing="0.55" fill="{COLORS['cream']}">Gs Custom Doors Inc. • (650) 634-8570</text>
</svg>"""


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def patch_jpeg_density(path: Path, dpi: int = 300) -> None:
    data = bytearray(path.read_bytes())
    density = dpi.to_bytes(2, "big")
    if data[:2] != b"\xff\xd8":
        raise ValueError(f"{path} is not a JPEG file")

    pos = 2
    if data[pos:pos + 2] == b"\xff\xe0":
        length = int.from_bytes(data[pos + 2:pos + 4], "big")
        payload = pos + 4
        if data[payload:payload + 5] == b"JFIF\x00" and length >= 16:
            data[payload + 7] = 1
            data[payload + 8:payload + 10] = density
            data[payload + 10:payload + 12] = density
            path.write_bytes(data)
            return

    jfif = bytearray(b"\xff\xe0\x00\x10JFIF\x00\x01\x01\x01")
    jfif.extend(density)
    jfif.extend(density)
    jfif.extend(b"\x00\x00")
    path.write_bytes(data[:2] + jfif + data[2:])


def patch_pdf_media_box(path: Path, width_pt: float, height_pt: float) -> None:
    data = path.read_bytes()
    updated = data.replace(
        b"/MediaBox [0 0 850.07996 425.03998]",
        f"/MediaBox [0 0 {width_pt:.5f} {height_pt:.5f}]".encode("ascii"),
        1,
    )
    if updated == data:
        raise ValueError(f"Could not find expected MediaBox in {path}")
    path.write_bytes(updated)


def export_pdf(html_path: Path, pdf_path: Path) -> None:
    with tempfile.TemporaryDirectory(prefix="gs-doors-chrome-") as profile:
        run([
            CHROME,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            f"--user-data-dir={profile}",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            f"file://{html_path}",
        ])


def export_jpeg(svg: str, jpg_path: Path, width: int, height: int) -> None:
    png_path = jpg_path.with_suffix(".png")
    with tempfile.TemporaryDirectory(prefix="gs-doors-chrome-") as profile:
        html_path = Path(profile) / "screenshot.html"
        write_text(html_path, html_page(svg, f"{width}px", f"{height}px"))
        run([
            CHROME,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            f"--user-data-dir={profile}",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            f"--window-size={width},{height}",
            f"--screenshot={png_path}",
            f"file://{html_path}",
        ])
    run(["ffmpeg", "-y", "-i", str(png_path), "-frames:v", "1", "-update", "1", "-q:v", "2", str(jpg_path)])
    patch_jpeg_density(jpg_path, 300)
    png_path.unlink()


def combined_business_card_html(front: str, back: str) -> str:
    return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page {{ size: 3.75in 2.25in; margin: 0; }}
    html, body {{ margin: 0; background: white; }}
    section {{
      width: 3.75in;
      height: 2.25in;
      page-break-after: always;
      overflow: hidden;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    svg {{ display: block; width: 3.75in; height: 2.25in; }}
  </style>
</head>
<body>
  <section>{front}</section>
  <section>{back}</section>
</body>
</html>
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    sign = sign_svg()
    front = card_front_svg()
    back = card_back_svg()

    write_text(OUT / "gs_custom_doors_sign_30x15cm.html", html_page(sign, "30cm", "15cm"))
    write_text(OUT / "gs_custom_doors_business_card_front.html", html_page(front, "3.75in", "2.25in"))
    write_text(OUT / "gs_custom_doors_business_card_back.html", html_page(back, "3.75in", "2.25in"))
    write_text(OUT / "gs_custom_doors_business_card_2sided.html", combined_business_card_html(front, back))

    sign_pdf = OUT / "Gs_Custom_Doors_sign_30x15cm.pdf"
    export_pdf(OUT / "gs_custom_doors_sign_30x15cm.html", sign_pdf)
    patch_pdf_media_box(sign_pdf, 30 / 2.54 * 72, 15 / 2.54 * 72)
    export_jpeg(sign, OUT / "Gs_Custom_Doors_sign_30x15cm.jpg", 3543, 1772)

    export_pdf(OUT / "gs_custom_doors_business_card_front.html", OUT / "Gs_Custom_Doors_business_card_front_3.75x2.25in.pdf")
    export_jpeg(front, OUT / "Gs_Custom_Doors_business_card_front_3.75x2.25in.jpg", 1125, 675)

    export_pdf(OUT / "gs_custom_doors_business_card_back.html", OUT / "Gs_Custom_Doors_business_card_back_3.75x2.25in.pdf")
    export_jpeg(back, OUT / "Gs_Custom_Doors_business_card_back_3.75x2.25in.jpg", 1125, 675)

    export_pdf(OUT / "gs_custom_doors_business_card_2sided.html", OUT / "Gs_Custom_Doors_business_card_2sided_3.75x2.25in.pdf")

    write_text(OUT / "README.md", """# GS Custom Doors print assets

Generated print files for Gs Custom Doors Inc.

- Business sign: 30 cm x 15 cm, PDF plus 300 DPI JPEG.
- Business cards: standard US card trim area with 0.125 in bleed, 3.75 in x 2.25 in files, PDF plus 300 DPI JPEG front/back.
- Combined two-sided business card PDF is included for print shops that prefer one two-page file.

Contact details used:

Gs Custom Doors Inc.
4885 Fulton Dr Ste C
Fairfield, CA 94534-4206
(650) 634-8570
""")


if __name__ == "__main__":
    main()
