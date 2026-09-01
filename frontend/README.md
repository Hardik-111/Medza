# MediAssist Frontend

Modern healthcare practice website built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🖼️ Changing Images

### Hero Section Image
The hero section image is located in:
```
src/assets/doctor-profile.jpg
```

**To change the hero section image:**

1. **Replace the existing image:**
   - Navigate to `src/assets/`
   - Replace `doctor-profile.jpg` with your new image
   - Keep the same filename or update the import in `HeroSection.tsx`

2. **Update the import in HeroSection.tsx:**
   ```typescript
   // In src/components/HeroSection.tsx, line ~3
   import doctorImage from "@/assets/your-new-image.jpg";
   ```

3. **Image Requirements:**
   - **Recommended size**: 800x600px or larger
   - **Format**: JPG, PNG, or WebP
   - **Aspect ratio**: 4:3 or 16:9 works best
   - **File size**: Keep under 500KB for optimal performance

### Other Images
- **Clinic Interior**: `src/assets/clinic-interior.jpg`
- **Favicon**: `public/favicon.ico`
- **Placeholder**: `public/placeholder.svg`

## 🎨 Customization

### Colors
Update the color scheme in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#your-primary-color",
        // ... other shades
      }
    }
  }
}
```

### Fonts
Update fonts in `tailwind.config.ts` and `src/index.css`

### Components
All components are in `src/components/` and can be customized as needed.

## 📱 Responsive Design
The website is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/     # React components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── assets/        # Images and static files
└── ui/            # Reusable UI components
```

## 🌐 Environment Variables
Create `.env.local` file:
```env
VITE_API_URL=http://localhost:8000/api
```

## 📦 Dependencies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Vite** - Build tool

## 🚀 Deployment
The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 📝 Notes
- All images are optimized for web
- Components use modern React patterns
- Fully accessible and SEO-friendly
- Mobile-first responsive design
