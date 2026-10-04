# Hand's on, the Unisex Salon: website

A static website (HTML, CSS, JavaScript). No build step, no frameworks, no backend.

## Open it
Double-click `index.html`. An internet connection is needed for the Google Fonts and the embedded map.

## Put it online
Drag the whole folder onto any static host: Netlify Drop, Vercel, Cloudflare Pages, GitHub Pages, or cPanel hosting (upload to `public_html`).

## Folder map
```
index.html            all page content
css/styles.css        design tokens, layout, responsive rules
js/site-config.js     phone, WhatsApp, social links, hours, map link
js/main.js            hero art, look picker, menu, booking form
assets/art/           generated artwork (SVG), used until real photos exist
assets/images/        drop real photographs here (names in the README inside)
assets/favicon.svg
```

## Details used (from handsonsalon.in and the Google Maps pin)
- Studios: Gamdevi (Indra Bhavan, Pandita Ramabai Road, Mumbai 400007) and Girgaon (159, Shree Bhuvan, Dr. B.J. Marg, Thakurdwar Road, Mumbai 400002)
- Phone: +91 72080 60606
- Hours: Tuesday to Sunday, 11 AM to 9 PM (Mondays occasional)
- Services: Haircut, Beard trim, Personal care, Spa, Tattoos (by appointment)
- Instagram: hands.on.salon, Facebook: handsonsalon

## To confirm with the salon
- Is +91 72080 60606 on WhatsApp? If not, set `whatsapp` to "" in `js/site-config.js`.
- Exact spa and personal care treatments, and whether to show prices.
- Real photos (see `assets/images/README.txt`), then set `showProposalBanner` to `false`.
