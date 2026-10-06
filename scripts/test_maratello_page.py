from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        console_errors = []
        page_errors = []

        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        print("Navigating to http://localhost:3000/maratello ...")
        res = page.goto("http://localhost:3000/maratello", wait_until="networkidle", timeout=15000)
        assert res.status == 200, f"Expected 200 but got {res.status}"

        page.wait_for_timeout(1500)

        # Check title
        title = page.title()
        print(f"Page Title: {title}")

        # Check WebGL Canvas presence
        canvas = page.query_selector("canvas")
        assert canvas is not None, "WebGL Canvas must be present!"
        print("WebGL Canvas verified successfully!")

        # Click sound toggle (ЗВУК ВЫКЛ -> ЗВУК ВКЛ)
        sound_btn = page.query_selector("button:has-text('ЗВУК')")
        if sound_btn:
            sound_btn.click()
            print("Clicked Audio Toggle button successfully!")

        # Click copy telegram
        tg_btn = page.query_selector("button:has-text('TG: @DIRECTORBABOK')")
        if tg_btn:
            tg_btn.click()
            print("Clicked Copy Telegram button successfully!")

        # Click Discord button
        discord_btn = page.query_selector("button:has-text('DISCORD: MARATELLO')")
        if discord_btn:
            discord_btn.click()
            print("Clicked Copy Discord button successfully!")

        # Click filter button Wonderwell
        wonderwell_btn = page.query_selector("button:has-text('Wonderwell')")
        if wonderwell_btn:
            wonderwell_btn.click()
            print("Clicked Wonderwell filter button successfully!")

        # Verify 6 games are rendered (including Control)
        games = ["Cyberpunk 2077", "Lies of P", "ULTRAKILL", "DOOM: The Dark Ages", "NieR: Automata", "Control"]
        for game_title in games:
            game_el = page.query_selector(f"text='{game_title}'")
            assert game_el is not None, f"Game '{game_title}' was not found on page!"
            print(f"Verified game: {game_title}")

        # Verify 8 rap legends are rendered
        artists = ["2Pac", "The Notorious B.I.G.", "Dr. Dre", "Eminem", "OutKast", "Mobb Deep", "The Game", "Skee-Lo"]
        for artist in artists:
            artist_el = page.query_selector(f"text='{artist}'")
            assert artist_el is not None, f"Artist '{artist}' was not found on page!"
            print(f"Verified music legend: {artist}")

        # Click 90s Beat button
        beat_btn = page.query_selector("button:has-text('90s БИТ')")
        if beat_btn:
            beat_btn.click()
            print("Started 90s Boom-Bap beat synthesizer successfully!")
            page.wait_for_timeout(800)
            beat_btn.click()
            print("Stopped beat synthesizer successfully!")

        # Click terminal chip ($music)
        chip_btn = page.query_selector("button:has-text('$music')")
        if chip_btn:
            chip_btn.click()
            print("Clicked $music terminal chip successfully!")

        page.wait_for_timeout(1000)

        # Assert no page errors
        print(f"Total Page Errors: {len(page_errors)}")
        print(f"Total Console Errors: {len(console_errors)}")
        if page_errors:
            print(f"Errors: {page_errors}")

        assert len(page_errors) == 0, f"Page errors encountered: {page_errors}"

        browser.close()
        print("ALL MARATELLO SHOWCASE TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test()
