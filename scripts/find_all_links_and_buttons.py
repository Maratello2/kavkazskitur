import re
import os
import glob
import json

def scan_codebase():
    routes_found = set()
    # Discover all app routes
    for app_dir in ["app", "src/app"]:
        for root, dirs, files in os.walk(app_dir):
            if "page.tsx" in files or "page.ts" in files:
                rel = os.path.relpath(root, app_dir).replace("\\", "/")
                if rel == ".":
                    routes_found.add("/")
                else:
                    # remove route groups like (protected)
                    clean_parts = [p for p in rel.split("/") if not (p.startswith("(") and p.endswith(")"))]
                    clean_route = "/" + "/".join(clean_parts)
                    routes_found.add(clean_route)

    print("Existing Next.js Page Routes in filesystem:")
    for r in sorted(routes_found):
        print(f"  {r}")

    # Discover tour slugs in src/data/toursData.ts
    slugs = []
    tours_path = "src/data/toursData.ts"
    if os.path.exists(tours_path):
        with open(tours_path, "r", encoding="utf-8") as f:
            for line in f:
                if "slug:" in line:
                    m = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", line)
                    if m:
                        slugs.append(m.group(1))
    print("\nValid Tour Slugs:")
    for s in slugs:
        print(f"  /tours/{s}")

    # Now scan all source files for hrefs and onClick handlers
    href_pattern = re.compile(r"href\s*[:=]\s*['\"](/[^'\"#?]+)['\"]")
    empty_onclick_pattern = re.compile(r"onClick\s*=\s*\{(?:\s*\(\)\s*=>\s*\{\s*\}|\s*\(\)\s*=>\s*undefined\s*)\}")

    broken_links = []
    empty_buttons = []

    for ext in ["*.tsx", "*.ts", "*.jsx", "*.js"]:
        for fpath in glob.glob(f"**/{ext}", recursive=True):
            if any(ign in fpath for ign in ["node_modules", ".next", "scripts"]):
                continue

            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            # Check empty onClick handlers
            for m in empty_onclick_pattern.finditer(content):
                empty_buttons.append((fpath, m.group(0)))

            # Check hrefs
            for m in href_pattern.finditer(content):
                href = m.group(1)
                # Check if it matches existing route or dynamic route
                is_valid = False
                if href in routes_found:
                    is_valid = True
                elif href.startswith("/tours/"):
                    tour_slug = href.replace("/tours/", "")
                    if tour_slug in slugs:
                        is_valid = True
                elif any(href.startswith(r.replace("[slug]", "")) for r in routes_found if "[slug]" in r):
                    is_valid = True
                elif href in ["/favicon.ico", "/favicon.png", "/robots.txt", "/sitemap.xml"]:
                    is_valid = True

                if not is_valid:
                    broken_links.append((fpath, href))

    print("\n--- POTENTIALLY BROKEN INTERNAL LINKS IN SOURCE CODE ---")
    for fp, hl in sorted(set(broken_links)):
        print(f"File: {fp} -> Link: {hl}")

    print("\n--- EMPTY/DUMMY ONCLICK HANDLERS ---")
    for fp, btn in sorted(set(empty_buttons)):
        print(f"File: {fp} -> Empty handler: {btn}")

if __name__ == "__main__":
    scan_codebase()
