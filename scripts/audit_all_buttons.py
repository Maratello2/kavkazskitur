import sys
import time
import json
import urllib.parse
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"

ROUTES = [
    "/",
    "/expeditions",
    "/tours/elbrus-south-classic",
    "/barrels",
    "/schedule",
    "/acclimatization",
    "/safety",
    "/map",
    "/compare",
    "/favorites",
    "/cabinet",
    "/booking",
    "/guides",
    "/privacy",
    "/offer",
    "/about",
    "/partners"
]

def run_audit():
    results = {
        "routes_scanned": len(ROUTES),
        "total_buttons": 0,
        "total_links": 0,
        "issues": [],
        "pages_summary": {}
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        console_errors = []
        page_errors = []

        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        for route in ROUTES:
            page_url = f"{BASE_URL}{route}"
            print(f"\n==========================================")
            print(f"Scanning route: {route}")
            print(f"==========================================")
            
            console_errors.clear()
            page_errors.clear()

            try:
                response = page.goto(page_url, wait_until="networkidle", timeout=15000)
            except Exception as e:
                results["issues"].append({
                    "route": route,
                    "type": "PAGE_LOAD_ERROR",
                    "details": str(e)
                })
                continue

            if response is None or response.status != 200:
                results["issues"].append({
                    "route": route,
                    "type": "HTTP_STATUS_NOT_200",
                    "status": response.status if response else "NO_RESPONSE"
                })
                continue

            # Give client components a moment to hydrate
            page.wait_for_timeout(1000)

            # 1. Audit Links
            links = page.query_selector_all("a")
            results["total_links"] += len(links)
            page_links_report = []

            for idx, link in enumerate(links):
                try:
                    href = link.get_attribute("href")
                    text = (link.inner_text() or link.get_attribute("aria-label") or link.get_attribute("title") or "").strip()
                    # Clean up multiline
                    text = " ".join(text.split())
                    if not text:
                        # check inner img alt or svg
                        img = link.query_selector("img")
                        if img:
                            text = f"[Image: {img.get_attribute('alt') or 'unnamed'}]"
                        else:
                            text = "[Icon/Empty link]"

                    class_name = link.get_attribute("class") or ""
                    if "ymaps-" in class_name or "leaflet-control" in class_name:
                        continue

                    is_visible = link.is_visible()
                    if not href:
                        results["issues"].append({
                            "route": route,
                            "element": "link",
                            "text": text,
                            "type": "EMPTY_HREF",
                            "severity": "HIGH",
                            "desc": f"Link '{text}' has no href attribute or empty href"
                        })
                    elif href in ["#", "javascript:void(0)", "javascript:;"]:
                        results["issues"].append({
                            "route": route,
                            "element": "link",
                            "text": text,
                            "href": href,
                            "type": "DUMMY_HREF",
                            "severity": "MEDIUM",
                            "desc": f"Link '{text}' uses placeholder href='{href}' without destination"
                        })
                    elif href.startswith("/"):
                        # Internal link check
                        pass
                except Exception as e:
                    pass

            # 2. Audit Buttons
            buttons = page.query_selector_all("button")
            results["total_buttons"] += len(buttons)
            print(f"Found {len(buttons)} buttons and {len(links)} links on {route}")

            # Collect button descriptors before clicking
            button_data = []
            for idx, btn in enumerate(buttons):
                try:
                    text = (btn.inner_text() or btn.get_attribute("aria-label") or btn.get_attribute("title") or "").strip()
                    text = " ".join(text.split())
                    if not text:
                        # check svg or children
                        text = f"[Icon Button #{idx+1}]"
                    
                    btn_type = btn.get_attribute("type") or "button"
                    is_visible = btn.is_visible()
                    is_disabled = btn.is_disabled()
                    
                    box = btn.bounding_box()
                    button_data.append({
                        "index": idx,
                        "text": text,
                        "type": btn_type,
                        "visible": is_visible,
                        "disabled": is_disabled,
                        "has_box": box is not None and box["width"] > 0 and box["height"] > 0
                    })
                except Exception as e:
                    button_data.append({
                        "index": idx,
                        "text": f"[Error reading button #{idx}]",
                        "error": str(e)
                    })

            # Click interactive testing for buttons
            for b_info in button_data:
                idx = b_info["index"]
                text = b_info["text"]

                # Re-query elements as DOM might mutate
                current_buttons = page.query_selector_all("button")
                if idx >= len(current_buttons):
                    continue
                btn = current_buttons[idx]

                try:
                    if not btn.is_visible() or btn.is_disabled():
                        continue

                    # Check bounding box
                    box = btn.bounding_box()
                    if not box or box["width"] <= 0 or box["height"] <= 0:
                        continue

                    # Check if button is off-screen or hidden
                    prev_errors_count = len(page_errors)
                    initial_url = page.url
                    initial_html_len = len(page.content())

                    # Attempt to click (with force=False first, or normal click)
                    try:
                        # Scroll into view if needed
                        btn.scroll_into_view_if_needed(timeout=2000)
                        btn.click(timeout=2500)
                        page.wait_for_timeout(300)
                    except Exception as click_err:
                        # Is it obscured or unclickable?
                        results["issues"].append({
                            "route": route,
                            "element": "button",
                            "text": text,
                            "type": "CLICK_BLOCKED_OR_FAILED",
                            "severity": "HIGH",
                            "error": str(click_err)[:200],
                            "desc": f"Button '{text}' failed to click (might be covered by overlay or unclickable)"
                        })
                        continue

                    # Did a JavaScript crash occur?
                    if len(page_errors) > prev_errors_count:
                        new_err = page_errors[-1]
                        results["issues"].append({
                            "route": route,
                            "element": "button",
                            "text": text,
                            "type": "JS_RUNTIME_ERROR_ON_CLICK",
                            "severity": "CRITICAL",
                            "error": new_err,
                            "desc": f"Clicking button '{text}' triggered JS error: {new_err}"
                        })

                    # If page navigated away, go back
                    if page.url != initial_url and not page.url.startswith(page_url):
                        page.goto(page_url, wait_until="networkidle", timeout=10000)
                        page.wait_for_timeout(500)

                    # If a modal or dialog opened, try closing it via Escape or close button
                    modals = page.query_selector_all("[role='dialog'], .fixed.inset-0")
                    if len(modals) > 0:
                        page.keyboard.press("Escape")
                        page.wait_for_timeout(200)

                except Exception as e:
                    pass

        # Final route link checks (verify that internal routes in href exist)
        print("\nChecking validity of internal link targets...")
        unique_internal_links = set()
        for route in ROUTES:
            page.goto(f"{BASE_URL}{route}", wait_until="networkidle", timeout=10000)
            for link in page.query_selector_all("a"):
                href = link.get_attribute("href")
                if href and href.startswith("/") and not href.startswith("//") and not href.startswith("/api/"):
                    clean_path = href.split("#")[0].split("?")[0]
                    if clean_path:
                        unique_internal_links.add(clean_path)

        for target in unique_internal_links:
            try:
                res = page.goto(f"{BASE_URL}{target}", timeout=10000)
                if res and res.status == 404:
                    results["issues"].append({
                        "route": "ANY",
                        "element": "link",
                        "target": target,
                        "type": "INTERNAL_404_BROKEN_LINK",
                        "severity": "CRITICAL",
                        "desc": f"Broken internal link points to 404: '{target}'"
                    })
                elif res and res.status >= 400:
                    results["issues"].append({
                        "route": "ANY",
                        "element": "link",
                        "target": target,
                        "type": "INTERNAL_ERROR_LINK",
                        "status": res.status,
                        "severity": "HIGH",
                        "desc": f"Link target '{target}' returned HTTP {res.status}"
                    })
            except Exception as e:
                results["issues"].append({
                    "route": "ANY",
                    "element": "link",
                    "target": target,
                    "type": "LINK_TARGET_EXCEPTION",
                    "error": str(e)
                })

        browser.close()

    with open("scripts/audit_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("\n==========================================")
    print(f"AUDIT COMPLETE!")
    print(f"Total Buttons: {results['total_buttons']}")
    print(f"Total Links: {results['total_links']}")
    print(f"Total Issues Found: {len(results['issues'])}")
    print("==========================================")

if __name__ == "__main__":
    run_audit()
