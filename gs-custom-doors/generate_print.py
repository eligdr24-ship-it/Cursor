#!/usr/bin/env python3
"""
Gs Custom Doors Inc. — print-ready business sign & business cards
Art direction: architectural portal monogram, walnut ink, limestone field, brass accent.
Sizes: Sign 30×15 cm @ 300 DPI | Business card 3.5×2 in @ 300 DPI
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.units import mm, inch
from reportlab.pdfgen import canvas as pdfcanvas

ROOT = Path(__file__).resolve().parent
FONTS = ROOT / "fonts"
OUT = ROOT / "print-ready"
PREVIEW = ROOT / "preview"

# —— Palette (print-safe, high contrast) ——
INK = (28, 24, 20)          # deep walnut charcoal
INK_SOFT = (58, 52, 46)     # secondary text
FIELD = (245, 242, 237)     # cool limestone (not warm cream cliché)
FIELD_DEEP = (236, 232, 226)
BRASS = (168, 132, 84)      # brushed brass accent
BRASS_SOFT = (196, 168, 122)
WHITE = (255, 255, 255)

COMPANY = "Gs Custom Doors Inc."
COMPANY_LINES = ("GS CUSTOM", "DOORS INC.")
TAGLINE = "CUSTOM ENTRY & INTERIOR DOORS"
ADDRESS = "4885 Fulton Dr Ste C"
CITY = "Fairfield, CA 94534-4206"
PHONE = "(650) 634-8570"


def font(path: str, size: float) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / path), size)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[float, float]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_portal_mark(
    draw: ImageDraw.ImageDraw,
    cx: float,
    cy: float,
    height: float,
    stroke: float,
    color: tuple[int, int, int],
    letter_font: ImageFont.FreeTypeFont,
    letters: str = "GS",
) -> None:
    """Architectural door-portal monogram: vertical frame + GS."""
    width = height * 0.62
    x0 = cx - width / 2
    y0 = cy - height / 2
    x1 = cx + width / 2
    y1 = cy + height / 2

    # Outer portal frame
    draw.rectangle([x0, y0, x1, y1], outline=color, width=max(1, int(stroke)))

    # Inner reveal (door panel depth)
    inset = stroke * 2.2
    draw.rectangle(
        [x0 + inset, y0 + inset, x1 - inset, y1 - inset],
        outline=color,
        width=max(1, int(stroke * 0.45)),
    )

    # Subtle top rail (header panel of a door)
    rail_y = y0 + height * 0.28
    draw.line(
        [x0 + inset * 1.4, rail_y, x1 - inset * 1.4, rail_y],
        fill=color,
        width=max(1, int(stroke * 0.4)),
    )

    # Letters optically centered in the lower door panel
    tw, th = text_size(draw, letters, letter_font)
    panel_top = rail_y
    panel_mid_y = (panel_top + (y1 - inset)) / 2
    lx = cx - tw / 2
    ly = panel_mid_y - th / 2 - height * 0.02
    draw.text((lx, ly), letters, font=letter_font, fill=color)


def draw_brass_rule(draw: ImageDraw.ImageDraw, x: float, y: float, length: float, weight: float) -> None:
    draw.line([x, y, x + length, y], fill=BRASS, width=max(1, int(weight)))
    # soft highlight edge
    draw.line(
        [x, y - max(1, int(weight * 0.35)), x + length, y - max(1, int(weight * 0.35))],
        fill=BRASS_SOFT,
        width=1,
    )


def mm_to_px(mm_val: float, dpi: int = 300) -> int:
    return int(round(mm_val / 25.4 * dpi))


def save_jpeg(img: Image.Image, path: Path, dpi: int = 300) -> None:
    rgb = img.convert("RGB")
    rgb.save(path, "JPEG", quality=95, dpi=(dpi, dpi), subsampling=0, optimize=True)


def img_to_pdf(img: Image.Image, path: Path, width_pt: float, height_pt: float) -> None:
    """Embed high-res RGB image into a PDF with exact print page size."""
    tmp = path.with_suffix(".tmp.jpg")
    save_jpeg(img, tmp, dpi=300)
    c = pdfcanvas.Canvas(str(path), pagesize=(width_pt, height_pt))
    c.drawImage(str(tmp), 0, 0, width=width_pt, height=height_pt, preserveAspectRatio=False, anchor="c")
    c.setTitle("Gs Custom Doors Inc.")
    c.setAuthor("Gs Custom Doors Inc.")
    c.setSubject("Print-ready artwork")
    c.save()
    tmp.unlink(missing_ok=True)


# ─────────────────────────────────────────────
# BUSINESS SIGN — 30 cm × 15 cm
# ─────────────────────────────────────────────

def build_sign(variant: str = "light") -> Image.Image:
    """
    Trim size: 300 × 150 mm
    Includes 3 mm bleed on all sides → canvas 306 × 156 mm @ 300 DPI
    """
    dpi = 300
    bleed_mm = 3
    trim_w, trim_h = 300, 150
    canvas_w = mm_to_px(trim_w + bleed_mm * 2, dpi)
    canvas_h = mm_to_px(trim_h + bleed_mm * 2, dpi)
    bleed = mm_to_px(bleed_mm, dpi)

    if variant == "dark":
        bg, fg, fg_soft = INK, FIELD, FIELD_DEEP
        accent = BRASS
    else:
        bg, fg, fg_soft = FIELD, INK, INK_SOFT
        accent = BRASS

    img = Image.new("RGB", (canvas_w, canvas_h), bg)
    draw = ImageDraw.Draw(img)

    # Trim box (for layout reference — content stays inside safe margin)
    safe = bleed + mm_to_px(8, dpi)  # 8 mm safe inset from trim
    content_left = safe
    content_right = canvas_w - safe
    content_top = safe
    content_bottom = canvas_h - safe
    content_w = content_right - content_left
    content_h = content_bottom - content_top

    # Subtle vertical grain / atmosphere (very light tonal shift, not flat)
    if variant == "light":
        for i in range(0, canvas_w, 3):
            tone = 1 if (i // 3) % 2 == 0 else 0
            shade = (bg[0] - tone, bg[1] - tone, bg[2] - tone)
            draw.line([(i, 0), (i, canvas_h)], fill=shade, width=1)
    else:
        for i in range(0, canvas_w, 4):
            tone = 2 if (i // 4) % 2 == 0 else 0
            shade = (min(255, bg[0] + tone), min(255, bg[1] + tone), min(255, bg[2] + tone))
            draw.line([(i, 0), (i, canvas_h)], fill=shade, width=1)

    # Double border just inside trim (ink + brass — architectural edge)
    border_inset = bleed + mm_to_px(4, dpi)
    border_w = max(2, mm_to_px(0.45, dpi))
    outer = fg if variant == "light" else accent
    inner = accent if variant == "light" else fg
    draw.rectangle(
        [border_inset, border_inset, canvas_w - border_inset, canvas_h - border_inset],
        outline=outer,
        width=border_w,
    )
    hi = border_inset + mm_to_px(2.0, dpi)
    draw.rectangle(
        [hi, hi, canvas_w - hi, canvas_h - hi],
        outline=inner,
        width=max(1, mm_to_px(0.35, dpi)),
    )

    # —— Left: portal mark ——
    mark_h = content_h * 0.72
    mark_cx = content_left + content_w * 0.16
    mark_cy = content_top + content_h * 0.48
    mark_stroke = mm_to_px(1.1, dpi)
    letter_fnt = font("CormorantGaramond-SemiBold.ttf", int(mark_h * 0.28))
    draw_portal_mark(draw, mark_cx, mark_cy, mark_h, mark_stroke, fg, letter_fnt)

    # —— Divider ——
    div_x = content_left + content_w * 0.32
    draw.line(
        [div_x, content_top + content_h * 0.18, div_x, content_bottom - content_h * 0.18],
        fill=accent,
        width=max(2, mm_to_px(0.6, dpi)),
    )

    # —— Right: wordmark + contact ——
    text_left = div_x + content_w * 0.045
    contact_fnt = font("Montserrat-Regular.ttf", mm_to_px(3.4, dpi))
    contact_bold = font("Montserrat-Medium.ttf", mm_to_px(3.6, dpi))

    lockup = "Gs Custom Doors Inc."
    max_text_w = content_right - text_left
    name_size = mm_to_px(13.5, dpi)
    name_fnt = font("CormorantGaramond-SemiBold.ttf", name_size)
    while text_size(draw, lockup, name_fnt)[0] > max_text_w and name_size > mm_to_px(9, dpi):
        name_size -= 2
        name_fnt = font("CormorantGaramond-SemiBold.ttf", name_size)

    # Quiet location eyebrow (tracked letterspacing drawn manually)
    label = "FAIRFIELD, CALIFORNIA"
    label_fnt = font("Montserrat-Medium.ttf", mm_to_px(2.6, dpi))
    tracking = mm_to_px(0.55, dpi)

    def draw_tracked(x: float, y: float, text: str, fnt: ImageFont.FreeTypeFont, col) -> tuple[float, float]:
        cx_t = x
        max_h = 0.0
        for ch in text:
            draw.text((cx_t, y), ch, font=fnt, fill=col)
            cw, ch_h = text_size(draw, ch, fnt)
            cx_t += cw + tracking
            max_h = max(max_h, ch_h)
        return cx_t - x - tracking, max_h

    # Measure full text block for vertical centering in right panel
    nw, nh = text_size(draw, lockup, name_fnt)
    _, lh = text_size(draw, label, label_fnt)
    addr_h = text_size(draw, ADDRESS, contact_fnt)[1]
    city_h = text_size(draw, CITY, contact_fnt)[1]
    phone_h = text_size(draw, PHONE, contact_bold)[1]
    block_h = (
        lh
        + mm_to_px(3.2, dpi)  # to rule
        + mm_to_px(0.55, dpi)  # rule
        + mm_to_px(5.5, dpi)  # to name
        + nh
        + mm_to_px(7.5, dpi)  # to address
        + addr_h
        + mm_to_px(2.0, dpi)
        + city_h
        + mm_to_px(3.5, dpi)
        + phone_h
    )
    block_top = content_top + (content_h - block_h) / 2

    draw_tracked(text_left, block_top, label, label_fnt, accent)
    rule_y = block_top + lh + mm_to_px(3.2, dpi)
    draw_brass_rule(draw, text_left, rule_y, mm_to_px(32, dpi), mm_to_px(0.55, dpi))

    name_y = rule_y + mm_to_px(5.5, dpi)
    draw.text((text_left, name_y), lockup, font=name_fnt, fill=fg)

    contact_y = name_y + nh + mm_to_px(7.5, dpi)
    lines = [
        (ADDRESS, contact_fnt, fg_soft),
        (CITY, contact_fnt, fg_soft),
        (PHONE, contact_bold, fg),
    ]
    cy = contact_y
    for i, (text, fnt, col) in enumerate(lines):
        draw.text((text_left, cy), text, font=fnt, fill=col)
        _, th = text_size(draw, text, fnt)
        cy += th + (mm_to_px(3.5, dpi) if i == 1 else mm_to_px(2.0, dpi))

    return img


# ─────────────────────────────────────────────
# BUSINESS CARD — 3.5 × 2 in (US standard)
# ─────────────────────────────────────────────

def build_card_front() -> Image.Image:
    dpi = 300
    bleed_in = 0.125
    trim_w, trim_h = 3.5, 2.0
    bleed = int(bleed_in * dpi)  # 37 px — exact, avoid banker's round
    canvas_w = int(trim_w * dpi) + bleed * 2
    canvas_h = int(trim_h * dpi) + bleed * 2

    img = Image.new("RGB", (canvas_w, canvas_h), FIELD)
    draw = ImageDraw.Draw(img)

    # atmosphere
    for i in range(0, canvas_w, 2):
        shade = (FIELD[0] - (i // 2) % 2, FIELD[1] - (i // 2) % 2, FIELD[2] - (i // 2) % 2)
        draw.line([(i, 0), (i, canvas_h)], fill=shade, width=1)

    # border
    inset = bleed + int(0.12 * dpi)
    draw.rectangle(
        [inset, inset, canvas_w - inset, canvas_h - inset],
        outline=BRASS,
        width=max(2, int(0.015 * dpi)),
    )
    inset2 = inset + int(0.06 * dpi)
    draw.rectangle(
        [inset2, inset2, canvas_w - inset2, canvas_h - inset2],
        outline=INK,
        width=1,
    )

    cx = canvas_w / 2
    # Mark
    mark_h = canvas_h * 0.38
    mark_cy = bleed + canvas_h * 0.36
    letter_fnt = font("CormorantGaramond-SemiBold.ttf", int(mark_h * 0.30))
    draw_portal_mark(draw, cx, mark_cy, mark_h, max(2, int(0.018 * dpi)), INK, letter_fnt)

    # Name
    name_fnt = font("CormorantGaramond-SemiBold.ttf", int(0.17 * dpi))
    lockup = "Gs Custom Doors Inc."
    tw, th = text_size(draw, lockup, name_fnt)
    name_y = mark_cy + mark_h * 0.55
    draw.text((cx - tw / 2, name_y), lockup, font=name_fnt, fill=INK)

    # brass rule
    rule_w = int(0.55 * dpi)
    rule_y = name_y + th + int(0.07 * dpi)
    draw_brass_rule(draw, cx - rule_w / 2, rule_y, rule_w, max(2, int(0.012 * dpi)))

    # phone under rule (quiet)
    phone_fnt = font("Montserrat-Medium.ttf", int(0.075 * dpi))
    pw, ph = text_size(draw, PHONE, phone_fnt)
    draw.text((cx - pw / 2, rule_y + int(0.06 * dpi)), PHONE, font=phone_fnt, fill=INK_SOFT)

    return img


def build_card_back() -> Image.Image:
    dpi = 300
    bleed_in = 0.125
    trim_w, trim_h = 3.5, 2.0
    bleed = int(bleed_in * dpi)
    canvas_w = int(trim_w * dpi) + bleed * 2
    canvas_h = int(trim_h * dpi) + bleed * 2

    img = Image.new("RGB", (canvas_w, canvas_h), INK)
    draw = ImageDraw.Draw(img)

    for i in range(0, canvas_w, 3):
        tone = 2 if (i // 3) % 2 == 0 else 0
        shade = (INK[0] + tone, INK[1] + tone, INK[2] + tone)
        draw.line([(i, 0), (i, canvas_h)], fill=shade, width=1)

    inset = bleed + int(0.12 * dpi)
    draw.rectangle(
        [inset, inset, canvas_w - inset, canvas_h - inset],
        outline=BRASS,
        width=max(2, int(0.015 * dpi)),
    )

    cx = canvas_w / 2
    cy = canvas_h / 2

    title_fnt = font("CormorantGaramond-Medium.ttf", int(0.13 * dpi))
    body_fnt = font("Montserrat-Regular.ttf", int(0.078 * dpi))
    phone_fnt = font("Montserrat-Medium.ttf", int(0.085 * dpi))

    lines = [
        (COMPANY, title_fnt, FIELD),
        ("", None, None),
        (ADDRESS, body_fnt, FIELD_DEEP),
        (CITY, body_fnt, FIELD_DEEP),
        ("", None, None),
        (PHONE, phone_fnt, BRASS_SOFT),
    ]

    # measure block height
    gap = int(0.045 * dpi)
    heights = []
    for text, fnt, _ in lines:
        if not text:
            heights.append(gap // 2)
        else:
            heights.append(text_size(draw, text, fnt)[1])
    total_h = sum(heights) + gap * (len([h for h in heights if h]) - 1) * 0  # manual
    # simpler spacing
    spaced = []
    for text, fnt, col in lines:
        if text == "":
            spaced.append(("", None, None, gap // 2))
        else:
            spaced.append((text, fnt, col, text_size(draw, text, fnt)[1]))

    block_h = sum(s[3] for s in spaced) + int(0.02 * dpi) * (len(spaced) - 1)
    y = cy - block_h / 2

    for text, fnt, col, h in spaced:
        if text and fnt:
            tw, _ = text_size(draw, text, fnt)
            draw.text((cx - tw / 2, y), text, font=fnt, fill=col)
        y += h + int(0.028 * dpi)

    return img


def build_card_onesided() -> Image.Image:
    """All info on one side — practical for small businesses."""
    dpi = 300
    bleed_in = 0.125
    trim_w, trim_h = 3.5, 2.0
    bleed = int(bleed_in * dpi)
    canvas_w = int(trim_w * dpi) + bleed * 2
    canvas_h = int(trim_h * dpi) + bleed * 2

    img = Image.new("RGB", (canvas_w, canvas_h), FIELD)
    draw = ImageDraw.Draw(img)

    for i in range(0, canvas_w, 2):
        shade = (FIELD[0] - (i // 2) % 2, FIELD[1] - (i // 2) % 2, FIELD[2] - (i // 2) % 2)
        draw.line([(i, 0), (i, canvas_h)], fill=shade, width=1)

    inset = bleed + int(0.1 * dpi)
    draw.rectangle(
        [inset, inset, canvas_w - inset, canvas_h - inset],
        outline=BRASS,
        width=max(2, int(0.014 * dpi)),
    )
    inset2 = inset + int(0.05 * dpi)
    draw.rectangle(
        [inset2, inset2, canvas_w - inset2, canvas_h - inset2],
        outline=INK,
        width=1,
    )

    # Left mark
    mark_h = canvas_h * 0.52
    mark_cx = bleed + canvas_w * 0.18
    mark_cy = canvas_h / 2
    letter_fnt = font("CormorantGaramond-SemiBold.ttf", int(mark_h * 0.30))
    draw_portal_mark(draw, mark_cx, mark_cy, mark_h, max(2, int(0.016 * dpi)), INK, letter_fnt)

    # Vertical brass rule
    rx = bleed + canvas_w * 0.34
    draw.line(
        [rx, bleed + canvas_h * 0.22, rx, canvas_h - bleed - canvas_h * 0.22],
        fill=BRASS,
        width=max(2, int(0.012 * dpi)),
    )

    text_left = rx + int(0.1 * dpi)
    name_fnt = font("CormorantGaramond-SemiBold.ttf", int(0.145 * dpi))
    body_fnt = font("Montserrat-Regular.ttf", int(0.068 * dpi))
    phone_fnt = font("Montserrat-Medium.ttf", int(0.075 * dpi))

    # Vertically center text block
    name = "Gs Custom Doors Inc."
    block_lines = [
        (name, name_fnt, INK, int(0.05 * dpi)),
        (ADDRESS, body_fnt, INK_SOFT, int(0.02 * dpi)),
        (CITY, body_fnt, INK_SOFT, int(0.045 * dpi)),
        (PHONE, phone_fnt, INK, 0),
    ]
    heights = [text_size(draw, t, f)[1] + pad for t, f, _, pad in block_lines]
    total = sum(heights)
    y = (canvas_h - total) / 2
    for (text, fnt, col, pad), h in zip(block_lines, heights):
        draw.text((text_left, y), text, font=fnt, fill=col)
        # brass underline under name
        if text == name:
            tw, th = text_size(draw, text, fnt)
            draw_brass_rule(
                draw,
                text_left,
                y + th + int(0.035 * dpi),
                min(tw, int(1.1 * dpi)),
                max(1, int(0.01 * dpi)),
            )
        y += h

    return img


def crop_to_trim_preview(img: Image.Image, bleed_px: int) -> Image.Image:
    return img.crop((bleed_px, bleed_px, img.width - bleed_px, img.height - bleed_px))


def build_logo_mark(size_px: int = 2400, dark: bool = False) -> Image.Image:
    """Standalone brand mark for reuse."""
    bg = INK if dark else FIELD
    fg = FIELD if dark else INK
    img = Image.new("RGB", (size_px, size_px), bg)
    draw = ImageDraw.Draw(img)
    mark_h = size_px * 0.62
    letter_fnt = font("CormorantGaramond-SemiBold.ttf", int(mark_h * 0.28))
    draw_portal_mark(
        draw,
        size_px / 2,
        size_px / 2,
        mark_h,
        max(3, int(size_px * 0.008)),
        fg,
        letter_fnt,
    )
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)

    # —— Sign (light — primary) ——
    sign = build_sign("light")
    sign_path_jpg = OUT / "GS-Custom-Doors-Sign-30x15cm.jpg"
    sign_path_pdf = OUT / "GS-Custom-Doors-Sign-30x15cm.pdf"
    save_jpeg(sign, sign_path_jpg)
    # PDF page = trim size 300×150 mm (image includes bleed; for print shops
    # we also export a bleed PDF at full canvas and a trim-safe JPEG preview)
    img_to_pdf(sign, sign_path_pdf, 306 * mm, 156 * mm)

    # Trim-only versions (no bleed) for simple print shops
    bleed_sign = mm_to_px(3, 300)
    sign_trim = crop_to_trim_preview(sign, bleed_sign)
    save_jpeg(sign_trim, OUT / "GS-Custom-Doors-Sign-30x15cm-TRIM.jpg")
    img_to_pdf(sign_trim, OUT / "GS-Custom-Doors-Sign-30x15cm-TRIM.pdf", 300 * mm, 150 * mm)

    # Dark alternate
    sign_dark = build_sign("dark")
    save_jpeg(sign_dark, OUT / "GS-Custom-Doors-Sign-30x15cm-DARK.jpg")
    img_to_pdf(sign_dark, OUT / "GS-Custom-Doors-Sign-30x15cm-DARK.pdf", 306 * mm, 156 * mm)
    save_jpeg(crop_to_trim_preview(sign_dark, bleed_sign), OUT / "GS-Custom-Doors-Sign-30x15cm-DARK-TRIM.jpg")
    img_to_pdf(
        crop_to_trim_preview(sign_dark, bleed_sign),
        OUT / "GS-Custom-Doors-Sign-30x15cm-DARK-TRIM.pdf",
        300 * mm,
        150 * mm,
    )

    # —— Business cards ——
    front = build_card_front()
    back = build_card_back()
    one = build_card_onesided()

    for name, im in [
        ("GS-Custom-Doors-BusinessCard-FRONT", front),
        ("GS-Custom-Doors-BusinessCard-BACK", back),
        ("GS-Custom-Doors-BusinessCard-ONESIDE", one),
    ]:
        save_jpeg(im, OUT / f"{name}.jpg")
        # Exact bleed page: 3.5+0.25 by 2.0+0.25 in → use pixel-true size
        img_to_pdf(im, OUT / f"{name}.pdf", im.width / 300 * inch, im.height / 300 * inch)

    bleed_card = int(0.125 * 300)
    for name, im in [
        ("GS-Custom-Doors-BusinessCard-FRONT-TRIM", front),
        ("GS-Custom-Doors-BusinessCard-BACK-TRIM", back),
        ("GS-Custom-Doors-BusinessCard-ONESIDE-TRIM", one),
    ]:
        trimmed = crop_to_trim_preview(im, bleed_card)
        save_jpeg(trimmed, OUT / f"{name}.jpg")
        img_to_pdf(trimmed, OUT / f"{name}.pdf", 3.5 * inch, 2.0 * inch)

    # Previews (screen-sized)
    for src, dst in [
        (sign_trim, "preview-sign-light.jpg"),
        (crop_to_trim_preview(sign_dark, bleed_sign), "preview-sign-dark.jpg"),
        (crop_to_trim_preview(one, bleed_card), "preview-card-oneside.jpg"),
        (crop_to_trim_preview(front, bleed_card), "preview-card-front.jpg"),
        (crop_to_trim_preview(back, bleed_card), "preview-card-back.jpg"),
    ]:
        preview = src.copy()
        preview.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
        save_jpeg(preview, PREVIEW / dst, dpi=150)

    # —— Logo marks ——
    logo_light = build_logo_mark(2400, dark=False)
    logo_dark = build_logo_mark(2400, dark=True)
    save_jpeg(logo_light, OUT / "GS-Custom-Doors-Logo-Mark.jpg")
    save_jpeg(logo_dark, OUT / "GS-Custom-Doors-Logo-Mark-DARK.jpg")
    img_to_pdf(logo_light, OUT / "GS-Custom-Doors-Logo-Mark.pdf", 4 * inch, 4 * inch)
    img_to_pdf(logo_dark, OUT / "GS-Custom-Doors-Logo-Mark-DARK.pdf", 4 * inch, 4 * inch)

    # Specs sheet
    specs = OUT / "PRINT-SPECS.txt"
    specs.write_text(
        """Gs Custom Doors Inc. — Print Specifications
================================================

COMPANY
  Gs Custom Doors Inc.
  4885 Fulton Dr Ste C
  Fairfield, CA 94534-4206
  (650) 634-8570

BRAND SYSTEM
  Mark: Architectural portal / door-frame monogram with “GS”
  Type: Cormorant Garamond (wordmark) + Montserrat (contact)
  Ink:  Deep walnut charcoal  RGB(28,24,20)
  Field: Cool limestone        RGB(245,242,237)
  Accent: Brushed brass        RGB(168,132,84)

BUSINESS SIGN
  Trim size:  30 cm × 15 cm  (300 mm × 150 mm)
  Bleed:      3 mm on all sides (files labeled without -TRIM include bleed)
  Resolution: 300 DPI
  Color:      RGB (high-quality JPEG / PDF) — convert to CMYK at print shop if required
  Files:
    GS-Custom-Doors-Sign-30x15cm.pdf / .jpg           (with bleed 306×156 mm)
    GS-Custom-Doors-Sign-30x15cm-TRIM.pdf / .jpg      (exact 30×15 cm)
    GS-Custom-Doors-Sign-30x15cm-DARK*.pdf / .jpg     (dark alternate)

BUSINESS CARDS
  Trim size:  3.5 in × 2.0 in  (US standard)
  Bleed:      0.125 in on all sides
  Resolution: 300 DPI
  Files:
    FRONT / BACK — two-sided set
    ONESIDE — all info on one side (recommended for simple printing)
    *-TRIM — exact trim size, no bleed

PRINT NOTES
  • Prefer TRIM files for home/office printers or shops that add their own bleed.
  • Prefer full (with bleed) files for professional offset/digital shops.
  • Do not scale; print at 100%.
  • Soft-proof colors may shift slightly when converted to CMYK.
""",
        encoding="utf-8",
    )

    print("Generated files in", OUT)
    for p in sorted(OUT.iterdir()):
        print(f"  {p.name:55} {p.stat().st_size / 1024:8.1f} KB")


if __name__ == "__main__":
    main()
