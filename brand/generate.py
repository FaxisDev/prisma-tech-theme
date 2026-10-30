"""Genera la identidad de Prisma-Tech: isotipo (prisma facetado) y logotipo con wordmark geométrico."""
import os, sys
OUT = sys.argv[1]

# ---------- Isotipo: triángulo equilátero con núcleo hueco, dividido en 6 facetas en rotación ----------
A = (512.0, 162.0); B = (108.0, 862.0); C = (916.0, 862.0)        # exterior (centrado en 1024)
G = ((A[0]+B[0]+C[0])/3, (A[1]+B[1]+C[1])/3)
K = 0.36
lerp = lambda P, Q, t: (P[0]+(Q[0]-P[0])*t, P[1]+(Q[1]-P[1])*t)
a = lerp(G, A, K); b = lerp(G, B, K); c = lerp(G, C, K)              # núcleo
f = lambda *pts: ' '.join('%.2f,%.2f' % p for p in pts)

# Paleta original del tema.
AURA, CYAN, BLUE, INDIGO, LAV, MAGENTA, PINK, BG = '#61FFCA', '#5CDFFF', '#6E9CFF', '#ACA0FF', '#C8B9FF', '#F77BFF', '#FF6EB6', '#1B2126'

def grad(id_, p1, p2, c1, c2):
    return ('<linearGradient id="%s" gradientUnits="userSpaceOnUse" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f">'
            '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>') % (id_, p1[0], p1[1], p2[0], p2[1], c1, c2)

# Facetas: cada lado del marco se parte en una faceta ancha (luz) y una estrecha (sombra), girando en el mismo sentido.
facets = [
    ('fL',  (A, B, b), A, B, AURA, CYAN, False),
    ('fLs', (A, b, a), A, b, CYAN, BLUE, True),
    ('fB',  (B, C, c), B, C, BLUE, INDIGO, False),
    ('fBs', (B, c, b), B, c, INDIGO, LAV, True),
    ('fR',  (C, A, a), C, A, MAGENTA, PINK, False),
    ('fRs', (C, a, c), C, a, PINK, MAGENTA, True),
]

def symbol(prefix=''):
    defs = ''.join(grad(prefix+i, p1, p2, c1, c2) for i, _, p1, p2, c1, c2, _ in facets)
    body = ''
    for i, pts, *_ , shade in facets:
        body += '<polygon points="%s" fill="url(#%s)"/>' % (f(*pts), prefix+i)
        if shade:  # profundidad: las facetas estrechas se oscurecen con el fondo del tema
            body += '<polygon points="%s" fill="%s" fill-opacity="0.38"/>' % (f(*pts), BG)
    # Aristas finas que separan las facetas (cristal tallado, sin brillos exagerados).
    edges = [(A, b), (B, c), (C, a), (a, b), (b, c), (c, a)]
    body += ''.join('<line x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>' % (p[0], p[1], q[0], q[1]) for p, q in edges)
    return defs, body

def isotype_svg(size=None):
    defs, body = symbol()
    wh = ' width="%d" height="%d"' % (size, size) if size else ''
    body = body.replace('<line', '<line stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="5" stroke-linecap="round"')
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"%s><title>Prisma-Tech</title>'
            '<defs>%s</defs><g stroke-linejoin="round">%s</g></svg>\n') % (wh, defs, body)

# ---------- Wordmark: letras geométricas con chaflanes a 45°, trazo uniforme ----------
S, CH = 6.5, 14.0                 # medio trazo y chaflán (altura de mayúscula = 100)
T, Bt, M = S, 100 - S, 50.0
def glyph(ch):
    if ch == 'P': W = 60; R = W - S; d = 'M%s %s V%s H%s L%s %s V%s L%s %s H%s' % (S, Bt, T, R-CH, R, T+CH, M+4-CH, R-CH, M+4, S)
    elif ch == 'R': W = 62; R = W - S; d = 'M%s %s V%s H%s L%s %s V%s L%s %s H%s M%s %s L%s %s' % (S, Bt, T, R-CH, R, T+CH, M+4-CH, R-CH, M+4, S, R-26, M+4, R, Bt)
    elif ch == 'I': W = 13; d = 'M%s %s V%s' % (S, T, Bt)
    elif ch == 'S': W = 60; R = W - S; d = 'M%s %s H%s L%s %s V%s L%s %s H%s L%s %s V%s L%s %s H%s' % (R, T, S+CH, S, T+CH, M-CH, S+CH, M, R-CH, R, M+CH, Bt-CH, R-CH, Bt, S)
    elif ch == 'M': W = 80; R = W - S; d = 'M%s %s V%s L%s %s L%s %s V%s' % (S, Bt, T, W/2, 62, R, T, Bt)
    elif ch == 'A': W = 66; R = W - S; d = 'M%s %s V%s L%s %s H%s L%s %s V%s M%s %s H%s' % (S, Bt, T+CH, S+CH, T, R-CH, R, T+CH, Bt, S, 60, R)
    elif ch == 'T': W = 62; R = W - S; d = 'M%s %s H%s M%s %s V%s' % (S, T, R, W/2, T, Bt)
    elif ch == 'E': W = 56; R = W - S; d = 'M%s %s H%s V%s H%s M%s %s H%s' % (R, T, S, Bt, R, S, M, R-8)
    elif ch == 'C': W = 60; R = W - S; d = 'M%s %s H%s L%s %s V%s L%s %s H%s' % (R, T, S+CH, S, T+CH, Bt-CH, S+CH, Bt, R)
    elif ch == 'H': W = 62; R = W - S; d = 'M%s %s V%s M%s %s V%s M%s %s H%s' % (S, T, Bt, R, T, Bt, S, M, R)
    return W, d

def wordmark(x0, y0, scale, color_a, color_b, track=18, word_gap=46):
    out = []; x = 0.0
    for wi, word in enumerate(['PRISMA', 'TECH']):
        color = color_a if wi == 0 else color_b
        for li, ch in enumerate(word):
            W, d = glyph(ch)
            out.append('<path transform="translate(%.2f 0)" d="%s" stroke="%s"/>' % (x, d, color))
            x += W + (track if li < len(word) - 1 else 0)
        x += word_gap
    width = x - word_gap
    g = ('<g transform="translate(%.2f %.2f) scale(%.4f)" fill="none" stroke-width="13" stroke-linejoin="miter" '
         'stroke-linecap="butt">%s</g>') % (x0, y0, scale, ''.join(out))
    return g, width * scale

def logo_svg(text_a, text_b, width=None):
    defs, body = symbol('L')
    body = body.replace('<line', '<line stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="5" stroke-linecap="round"')
    sym_scale = 300 / 1024.0                       # símbolo de 300 px de alto en un lienzo de 300
    cap = 112.0                                    # altura de mayúscula ≈ 37 % del símbolo
    gap = 64
    wm, wm_w = wordmark(300 * 0.94 + gap, 150 - cap / 2 + 12, cap / 100.0, text_a, text_b)
    W = int(300 * 0.94 + gap + wm_w + 8)
    H = 300
    wh = ' width="%d" height="%d"' % (width, round(width * H / W)) if width else ''
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"%s><title>PRISMA TECH</title><defs>%s</defs>'
            '<g transform="translate(-8 0) scale(%.5f)" stroke-linejoin="round">%s</g>%s</svg>\n') % (W, H, wh, defs, sym_scale, body, wm)

os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'prisma-tech-isotype.svg'), 'w').write(isotype_svg())
open(os.path.join(OUT, 'prisma-tech-logo-dark.svg'), 'w').write(logo_svg('#C4EAFF', '#8FA8B6'))   # para fondos oscuros
open(os.path.join(OUT, 'prisma-tech-logo-light.svg'), 'w').write(logo_svg('#1B2126', '#5C6B75'))  # para fondos claros
print('ok')
