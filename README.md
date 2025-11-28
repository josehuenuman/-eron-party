# Eron Party - Hub+Doers Fest Montevideo

A modern, password-protected web application designed to replace the traditional PDF event guide for Eron International's Hub+Doers Fest in Montevideo. Built for deployment on Cloudflare Workers.

## Overview

This application provides a comprehensive digital guide for the company event, including travel information, accommodation details, agenda, party location, and key contacts. It features a clean, modern interface with smooth navigation and embedded Google Maps for easy location access.

## Features

- **Password Protection**: Secure access gate using session storage
- **Responsive Navigation**: Sticky header with mobile-friendly hamburger menu
- **Smooth Scrolling**: Enhanced UX with smooth section navigation
- **Embedded Maps**: Interactive Google Maps for venues and hotels
- **Modern Design**: Glassmorphism effects with gradient backgrounds
- **Mobile-First**: Fully responsive layout optimized for all devices
- **Event Sections**:
  - Travel logistics and documentation
  - Hotel accommodations with maps
  - Office locations (WTC campus)
  - Corporate card usage guidelines
  - 3-day event agenda
  - Party details and pickup times
  - Emergency contacts by department

## Tech Stack

- **Framework**: Vite (Rolldown build)
- **Language**: TypeScript
- **Styling**: Pure CSS with modern features
- **Build Tool**: Rolldown Vite 7.2.5
- **Deployment**: Ready for Cloudflare Workers

## Installation

```bash
# Clone the repository
git clone https://github.com/josehuenuman/-eron-party.git
cd eron-party

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
eron-party/
├── src/
│   ├── main.ts          # Main application logic and markup
│   ├── config.ts        # Access code and branding configuration
│   ├── style.css        # Complete styling with responsive design
│   ├── counter.ts       # Legacy counter (unused)
│   └── assets/
│       └── eron-logo.svg
├── public/
│   ├── images/
│   │   ├── WTC-torre2.jpg
│   │   └── WTC-torre4.jpg
│   └── vite.svg
├── index.html
├── package.json
└── tsconfig.json
```

## Configuration

Update the access credentials and branding in `src/config.ts`:

```typescript
export const ACCESS_CODE = 'eron2025'

export const BRAND = {
  eventTitle: 'Eron International / Hub+Doers Fest Montevideo',
  eventSubtitle: 'Internal event – enter the access code',
  heroTitle: 'AI drives the future. Doers rule the party.',
  heroSubtitle: 'Hub+Doers Fest – Montevideo · December 10–12',
}
```

## Deployment to Cloudflare Workers

This application is optimized for Cloudflare Workers deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Cloudflare Pages or Workers:
   - Use [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) for Workers
   - Or connect your GitHub repository to [Cloudflare Pages](https://pages.cloudflare.com/)

3. Set up custom domain and SSL (handled automatically by Cloudflare)

## Development

The application uses:
- **Session Storage** for authentication persistence
- **Vanilla TypeScript** for minimal bundle size
- **CSS Custom Properties** for easy theming
- **Semantic HTML** for accessibility

### Key Components

- **Password Gate**: Initial screen requiring access code
- **Navigation**: Auto-hiding mobile menu with smooth scroll
- **Sections**: Modular content sections with cards and timelines
- **Maps**: Embedded Google Maps iframes for all venues

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is an internal company project. For changes or improvements:
1. Create a feature branch
2. Make your changes
3. Test on mobile and desktop
4. Submit a pull request

## License

Internal use only - Eron International

---

**Event Details**: December 10-12, 2025 · Montevideo, Uruguay
**Theme**: AI drives the future. Doers rule the party.
