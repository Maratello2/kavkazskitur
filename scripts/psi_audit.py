import urllib.request
import json
import sys

def get_psi(strategy):
    print(f"\n==========================================")
    print(f" Fetching PageSpeed Insights for: {strategy.upper()}")
    print(f"==========================================")
    url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://kavkazskitur.com&strategy={strategy}&category=performance&category=accessibility&category=best-practices&category=seo"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"Error fetching PSI data: {e}")
        return

    categories = data.get("lighthouseResult", {}).get("categories", {})
    audits = data.get("lighthouseResult", {}).get("audits", {})

    print("\n--- CATEGORY SCORES ---")
    for cat_id, cat_data in categories.items():
        score = int(cat_data.get("score", 0) * 100)
        print(f"{cat_data.get('title')}: {score}/100")

    print("\n--- CORE METRICS ---")
    metrics = [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
        "speed-index"
    ]
    for m in metrics:
        audit = audits.get(m, {})
        val = audit.get("displayValue", audit.get("numericValue", "N/A"))
        score = audit.get("score")
        print(f"  * {audit.get('title', m)}: {val} (score: {score})")

    print("\n--- DIAGNOSTICS & FAILED AUDITS (Score < 0.9) ---")
    for k, v in audits.items():
        score = v.get("score")
        if score is not None and score < 0.90:
            details = v.get("details", {})
            items = details.get("items", [])
            disp = v.get("displayValue", "")
            print(f"\n[!] {v.get('title')} (score: {score}) - {disp}")
            print(f"    Description: {v.get('description', '')[:120]}...")
            if items and len(items) > 0:
                print(f"    Items ({len(items)}):")
                for item in items[:5]:
                    url_item = item.get("url") or item.get("node", {}).get("snippet") or item.get("source") or str(item)[:80]
                    wasted_bytes = item.get("wastedBytes")
                    wasted_ms = item.get("wastedMs")
                    extra = []
                    if wasted_bytes: extra.append(f"{wasted_bytes // 1024} KB wasted")
                    if wasted_ms: extra.append(f"{wasted_ms:.0f} ms wasted")
                    extra_str = f" ({', '.join(extra)})" if extra else ""
                    print(f"      - {url_item}{extra_str}")

if __name__ == "__main__":
    strategy = sys.argv[1] if len(sys.argv) > 1 else "mobile"
    get_psi(strategy)
