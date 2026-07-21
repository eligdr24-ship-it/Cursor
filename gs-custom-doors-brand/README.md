# GS Custom Doors Inc. — Brand & Print Assets

Print-ready sign and business card artwork for **GS Custom Doors Inc.**,
4885 Fulton Dr Ste C, Fairfield, CA 94534 · (650) 634-8570.

## Deliverables (`print/`)

| File | Size | Format |
| --- | --- | --- |
| `gs_custom_doors_sign_30x15cm` | 300 × 150 mm (30 × 15 cm) | vector PDF + 300 DPI JPEG (3543 × 1772 px) |
| `gs_custom_doors_business_card_front` | 3.5 × 2 in + 1/8 in bleed (95.25 × 57.15 mm) | vector PDF + 300 DPI JPEG |
| `gs_custom_doors_business_card_back` | 3.5 × 2 in + 1/8 in bleed (95.25 × 57.15 mm) | vector PDF + 300 DPI JPEG |

PDFs are vector (crisp text at any size) — send these to the print shop.
JPEGs are 300 DPI proofs/previews. Card files include bleed; the printer
trims 1/8 in (3.175 mm) from each edge to the final 3.5 × 2 in card.

## Brand system

- **Mark:** minimal arched door with a GS monogram and brass threshold line.
- **Palette:** charcoal `#161E26`, brass `#C9A15C`, cream `#F4EFE6`.
- **Type:** Montserrat (500/600/700/800), tracked-out uppercase.

## Regenerating

Install Montserrat static weights (named `Montserrat W500`…`W800`) plus
`cairosvg` and `pillow`, then run:

```bash
python3 generate_brand_assets.py
```
