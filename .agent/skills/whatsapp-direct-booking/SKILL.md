---
name: whatsapp-direct-booking
description: Zero-friction WhatsApp direct lead capture, pre-filled expedition inquiries, anti-spam, and 152-FZ compliance.
---
# WhatsApp Direct Booking & Legal Compliance

## 1. Instant WhatsApp Lead Generation
- For high-ticket expeditions ($900 - $1,100), eliminate multi-step cart checkouts.
- Direct booking CTA must encode trip parameters:
  `https://wa.me/79280828413?text=Expedition%20Inquiry%0ATour:%20{tourName}%0ADates:%20{dates}%0AGroup:%20{climbersCount}`
- Open WhatsApp in a clean external tab while displaying confirmation modal on site.

## 2. Anti-Spam & Legal
- Honeypot: Include `<input type="text" name="website_hp" className="hidden" tabIndex={-1} autoComplete="off" />`. Reject submissions where honeypot is filled.
- 152-FZ Consent: Mandatory checkbox: "I agree to the processing of personal data and Expedition Rules". Disable action buttons until checked.
