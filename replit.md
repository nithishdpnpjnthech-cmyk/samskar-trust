# Samsakar Trust Website

## Overview
A beautiful, modern charity website for Samsakar Trust - a non-profit organization dedicated to transforming lives through compassion and action. The website showcases their mission to provide medical aid, food support, education, and women empowerment.

## Project Type
Static HTML/CSS/JavaScript website with no build process or backend dependencies.

## Technology Stack
- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Styling**: Tailwind CSS (loaded via CDN)
- **Fonts**: Google Fonts (Poppins, Inter)
- **Icons**: SVG icons and emoji
- **Server**: Python http.server for local development

## Project Structure
```
/
├── index.html              # Main HTML file
├── script.js               # JavaScript functionality
├── styles.css              # Custom CSS styles
├── logo.png                # Trust logo
├── qr-code.png            # UPI QR code for donations
├── gallery/               # Event photos
├── QRcode/                # QR code assets
├── uploaded_images/       # User-uploaded content
└── attached_assets/       # Various assets and images
```

## Key Features
1. **Responsive Design**: Mobile-first approach with Tailwind CSS
2. **Bilingual Translation System**: Complete English-Kannada translation with language switcher
   - Dictionary-based offline translation (translations.js)
   - Language preference saved to localStorage
   - Covers navigation, section headers, form labels, buttons, and UI elements
3. **UPI Donation System**: Integrated payment system with multiple UPI apps
4. **Volunteer Registration**: Form to join as a volunteer
5. **Event Gallery**: Showcase of trust activities
6. **Contact Forms**: Quick form modals for user engagement
7. **Google Sheets Integration**: Form submissions saved to Google Sheets (optional)

## Development Setup
The website runs on Python's built-in HTTP server on port 5000. No compilation or build step required.

### Workflow
- **Name**: Start Website
- **Command**: `python server.py`
- **Port**: 5000 (exposed for web preview)
- **Type**: Static website server with cache control headers

## Deployment
Configured as a static deployment - serves HTML, CSS, JavaScript, and assets directly without any server-side processing.

## Forms and Data Collection
- Volunteer registration form integrates with Google Apps Script
- Quick form modal for rapid user engagement
- Fallback to localStorage if Google Sheets integration is not configured
- CSV export functionality for admin convenience

## Payment Integration
- UPI ID: `samsakartrust@paytm`
- Supports multiple payment apps: Paytm, Google Pay, PhonePe
- QR code scanning for easy donations
- Configurable donation amounts

## Recent Changes
- **Dec 2, 2025**: Implemented complete English-Kannada bilingual translation system
  - Created translations.js with comprehensive translation dictionary
  - Added Translator class with language switching functionality
  - Tagged all major sections with data-i18n attributes (Navigation, Hero, About, Causes, Donation, Events, Testimonials, Gallery, Volunteer, Contact)
  - Language preference persists in localStorage
  - Added language switcher dropdown in navigation

- **Dec 2, 2025**: Imported from GitHub and configured for Replit environment
  - Installed Python 3.11 for static file serving
  - Set up workflow to serve site on port 5000
  - Configured static deployment

## User Preferences
None specified yet.

## Notes
- No backend required - purely client-side application
- All form submissions handled via Google Apps Script or localStorage
- Images and assets served directly from filesystem
- No build process or package manager needed
