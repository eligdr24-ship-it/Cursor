#!/usr/bin/env python3
"""
GS Custom Doors Inc. - brand assets generator.

Builds a print-ready business sign (300 x 150 mm) and US-standard business
cards (3.5 x 2 in + 1/8 in bleed) as vector PDF and 300-DPI JPEG.

Requires: cairosvg, pillow, Montserrat static weights installed as
"Montserrat W500/W600/W700/W800" (see repo README).
"""

import io
import os

import cairosvg
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "print")
os.makedirs(OUT, exist_ok=True)

DPI = 300
MM_TO_PX = DPI / 25.4

# ---------------------------------------------------------------- palette
INK = "#161E26"        # deep charcoal (background)
INK_SOFT = "#1E2933"   # slightly lifted charcoal (door fill)
BRASS = "#C9A15C"      # warm brass / gold
BRASS_DIM = "#9A7B45"  # muted brass for hairlines
CREAM = "#F4EFE6"      # warm off-white
CREAM_DIM = "#C4BEB2"  # secondary text on dark

F500 = "Montserrat W500"
F600 = "Montserrat W600"
F700 = "Montserrat W700"
F800 = "Montserrat W800"

ADDRESS = "4885 Fulton Dr, Ste C  \u00b7  Fairfield, CA 94534"
PHONE = "(650) 634-8570"


def door_mark(cx, top, h, line_color=BRASS, fill=INK_SOFT, mono_color=CREAM,
              stroke=1.1, with_monogram=True, mono_scale=0.245):
    """Minimal arched-door mark with a GS monogram, centred on cx (mm)."""
    w = h * 0.62
    x = cx - w / 2
    arch = h * 0.30                       # arch radius portion
    inset = h * 0.115                     # inner panel inset
    handle_r = h * 0.028

    def arch_path(px, py, pw, ph, r):
        return (f"M {px} {py + ph} L {px} {py + r} "
                f"A {pw / 2} {r} 0 0 1 {px + pw} {py + r} "
                f"L {px + pw} {py + ph} Z")

    outer = arch_path(x, top, w, h, arch)
    ix, iy = x + inset, top + inset
    iw, ih = w - 2 * inset, h - 2 * inset
    inner = arch_path(ix, iy, iw, ih, arch * 0.78)

    mono = ""
    if with_monogram:
        mono = (f'<text x="{cx}" y="{top + h * 0.615}" font-family="{F800}" '
                f'font-size="{h * mono_scale}" fill="{mono_color}" text-anchor="middle" '
                f'letter-spacing="{h * 0.010}">GS</text>')

    handle = (f'<circle cx="{x + w - inset * 1.85}" cy="{top + h * 0.80}" '
              f'r="{handle_r}" fill="{line_color}"/>')

    threshold = (f'<line x1="{x - w * 0.14}" y1="{top + h}" x2="{x + w * 1.14}" '
                 f'y2="{top + h}" stroke="{line_color}" stroke-width="{stroke}" '
                 f'stroke-linecap="round"/>')

    return (f'<path d="{outer}" fill="{fill}" stroke="{line_color}" stroke-width="{stroke}"/>'
            f'<path d="{inner}" fill="none" stroke="{line_color}" stroke-width="{stroke * 0.72}"/>'
            f"{mono}{handle}{threshold}")


def svg_doc(w_mm, h_mm, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w_mm}mm" height="{h_mm}mm" '
            f'viewBox="0 0 {w_mm} {h_mm}">{body}</svg>')


def render(svg, basename, w_mm, h_mm):
    svg_bytes = svg.encode()
    pdf_path = os.path.join(OUT, basename + ".pdf")
    cairosvg.svg2pdf(bytestring=svg_bytes, write_to=pdf_path)

    png_bytes = cairosvg.svg2png(
        bytestring=svg_bytes,
        output_width=round(w_mm * MM_TO_PX),
        output_height=round(h_mm * MM_TO_PX),
    )
    img = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    jpg_path = os.path.join(OUT, basename + ".jpg")
    img.save(jpg_path, "JPEG", quality=95, dpi=(DPI, DPI), subsampling=0)
    print(f"  {basename}: PDF + JPEG ({img.size[0]} x {img.size[1]} px @ {DPI} DPI)")


# ================================================================ SIGN
def build_sign():
    W, H = 300.0, 150.0
    cx = W / 2

    mark = door_mark(cx, 16.5, 42.0, stroke=1.15)

    body = f'''
<rect width="{W}" height="{H}" fill="{INK}"/>
<rect x="5" y="5" width="{W - 10}" height="{H - 10}" fill="none"
      stroke="{BRASS_DIM}" stroke-width="0.45"/>
{mark}
<text x="{cx}" y="80.5" font-family="{F800}" font-size="17.5" fill="{CREAM}"
      text-anchor="middle" letter-spacing="2.3">GS CUSTOM DOORS</text>
<text x="{cx}" y="92.5" font-family="{F600}" font-size="6.4" fill="{BRASS}"
      text-anchor="middle" letter-spacing="4.6">I N C .</text>
<line x1="82" y1="104" x2="{cx - 6}" y2="104" stroke="{BRASS_DIM}" stroke-width="0.4"/>
<circle cx="{cx}" cy="104" r="1.05" fill="{BRASS}"/>
<line x1="{cx + 6}" y1="104" x2="{W - 82}" y2="104" stroke="{BRASS_DIM}" stroke-width="0.4"/>
<text x="{cx}" y="117" font-family="{F500}" font-size="5.6" fill="{CREAM_DIM}"
      text-anchor="middle" letter-spacing="0.9">{ADDRESS}</text>
<text x="{cx}" y="131" font-family="{F700}" font-size="8.2" fill="{BRASS}"
      text-anchor="middle" letter-spacing="1.6">{PHONE}</text>
'''
    render(svg_doc(W, H, body), "gs_custom_doors_sign_30x15cm", W, H)


# ================================================================ CARDS
# US standard 3.5 x 2 in = 88.9 x 50.8 mm, +3.175 mm (1/8 in) bleed per side.
BLEED = 3.175
CW, CH = 88.9 + 2 * BLEED, 50.8 + 2 * BLEED


def build_card_front():
    cx = CW / 2
    mark = door_mark(cx, 8.6 + BLEED, 20.0, stroke=0.6)
    body = f'''
<rect width="{CW}" height="{CH}" fill="{INK}"/>
{mark}
<text x="{cx}" y="{40.2 + BLEED}" font-family="{F800}" font-size="6.05" fill="{CREAM}"
      text-anchor="middle" letter-spacing="0.78">GS CUSTOM DOORS</text>
<text x="{cx}" y="{45.4 + BLEED}" font-family="{F600}" font-size="2.7" fill="{BRASS}"
      text-anchor="middle" letter-spacing="1.9">I N C .</text>
'''
    render(svg_doc(CW, CH, body), "gs_custom_doors_business_card_front", CW, CH)


def build_card_back():
    left = 10.0 + BLEED
    mark = door_mark(CW - 14.6 - BLEED, 15.2 + BLEED, 21.5, line_color=BRASS,
                     fill="none", mono_color=INK, stroke=0.55, mono_scale=0.20)
    body = f'''
<rect width="{CW}" height="{CH}" fill="{CREAM}"/>
<rect x="0" y="0" width="{CW}" height="{7.4 + BLEED}" fill="{INK}"/>
<text x="{left}" y="{5.05 + BLEED}" font-family="{F700}" font-size="3.0" fill="{BRASS}"
      letter-spacing="1.25">GS CUSTOM DOORS INC.</text>
{mark}
<text x="{left}" y="{21.0 + BLEED}" font-family="{F700}" font-size="3.15" fill="{INK}"
      letter-spacing="0.55">DESIGN \u00b7 BUILD \u00b7 INSTALL</text>
<line x1="{left}" y1="{26.6 + BLEED}" x2="{left + 34}" y2="{26.6 + BLEED}"
      stroke="{BRASS}" stroke-width="0.35"/>
<text x="{left}" y="{34.4 + BLEED}" font-family="{F700}" font-size="4.4" fill="{INK}"
      letter-spacing="0.55">{PHONE}</text>
<text x="{left}" y="{41.4 + BLEED}" font-family="{F500}" font-size="2.85" fill="#4A5560"
      letter-spacing="0.28">4885 Fulton Dr, Ste C</text>
<text x="{left}" y="{45.9 + BLEED}" font-family="{F500}" font-size="2.85" fill="#4A5560"
      letter-spacing="0.28">Fairfield, CA 94534</text>
'''
    render(svg_doc(CW, CH, body), "gs_custom_doors_business_card_back", CW, CH)


if __name__ == "__main__":
    print("Generating GS Custom Doors Inc. print assets...")
    build_sign()
    build_card_front()
    build_card_back()
    print("Done ->", OUT)
