from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(1000)

        for name in [
            "Switch to Gara-Bashi Snowfields",
            "Switch to Dombai Alpine Gorges",
            "Switch to The High Saddle Glacier"
        ]:
            btn = page.query_selector(f'button[aria-label="{name}"]')
            if btn:
                print(f"Testing click on: {name}")
                btn.scroll_into_view_if_needed()
                page.wait_for_timeout(200)
                btn.click(timeout=3000)
                print(f"SUCCESS: {name} clicked smoothly!")
            else:
                print(f"FAILED: Button not found {name}")
        browser.close()

if __name__ == "__main__":
    test()
