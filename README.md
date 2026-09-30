# Kartly — React + Redux + Tailwind e-commerce capstone

## Run
    npm install
    npm run dev       # http://localhost:5173
    npm test          # React Testing Library + Vitest
    npm run build     # production build in /dist

## Features
- Dashboard: fixed header, parallax carousel banner, perks, category filter, product grid, FAQ accordion, footer with newsletter
- Search icon expands into a search bar; filters by product name
- Category filter fetches category-wise data from Fake Store API
- Product detail: price, units, reviews, payment options, offers, delivery date, key features
- Cart (qty, remove, totals, header badge, "Go to cart") and Wishlist (header badge)
- Login with validation; Privacy and T&C modals
- Light / dark theme (remembers choice, follows system default)
- Cart, wishlist, theme and login persist in localStorage
- Responsive from 320px phones to wide desktops; reduced-motion respected

## Structure
    src/store       actions (thunks), reducers, store + persistence
    src/components  Header, Banner, ProductCard, Footer, Modal, ...
    src/pages       Home, ProductDetail, Cart, Wishlist, Login
    src/utils       price and validation helpers
    src/test        unit tests

## Deploy
Push to GitHub, import the repo in Vercel or Netlify (build: `npm run build`, output: `dist`).
`vercel.json` and `public/_redirects` already handle SPA routing.
