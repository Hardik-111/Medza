# PDF Pricing Table Setup

## 📄 How to Add Your PDF Pricing Table

### ✅ **Recommended Method: Assets Folder**
1. **Place your PDF file** in the `frontend/src/assets/` directory
2. **Name it**: `pricing-table.pdf`
3. **Full path**: `frontend/src/assets/pricing-table.pdf`

### Alternative Methods (Not Recommended)
- **Public Folder**: `frontend/public/pricing-table.pdf`
- **Backend**: `backend/src/main/resources/static/pricing-table.pdf`

## 🎨 PDF Content Suggestions

Your PDF should include:

### Header Section
- **Doctor Name**: Dr. Jayshankar Prasad Singh
- **Qualifications**: MBBS, MD
- **Clinic Name**: Home Clinic
- **Address**: H-20, Rapti Nagar, Phase-4, Gorakhpur - 273013
- **Contact**: +91 7905152928
- **Email**: dr.jayshankar@homeclinic.com

### Pricing Sections

#### Per-Visit Options
- **First Visit**: ₹499
- **Follow-up (4 days)**: FREE
- **Repeat Visit**: ₹400-450

#### Subscription Plans (with discounts)
- **Weekly Plan**: ₹999 (was ₹1,500) - Save ₹501
- **Bi-Weekly Plan**: ₹1,799 (was ₹2,500) - Save ₹701
- **Monthly Plan**: ₹3,499 (was ₹4,000) - Save ₹501

#### Video Consultations
- **Quick (10 min)**: ₹250
- **Standard (15 min)**: ₹400
- **Detailed (25 min)**: ₹600
- **Extended (30+ min)**: ₹850

### Footer Section
- **Booking Information**: Call +91 7905152928
- **Terms**: Prices subject to change
- **Note**: Free follow-up within 4 days for same health issue

## 🚀 Features Available

### Download Functionality
- **Download Button**: Downloads the PDF file
- **Automatic Naming**: `Dr-Jayshankar-Prasad-Singh-Pricing-Table.pdf`
- **Direct Asset Access**: Uses Vite's asset handling

### Preview Functionality
- **Preview Button**: Opens PDF in new browser tab
- **Inline Viewing**: PDF displays in browser
- **No Download Required**: Users can view before downloading

### WhatsApp Sharing
- **Share Button**: Opens WhatsApp with formatted text
- **Pre-filled Message**: Includes all pricing information
- **Contact Details**: Includes phone and email

## 📱 WhatsApp Share Format

The WhatsApp share includes:
```
🏥 Dr. Jayshankar Prasad Singh - Consultation Fee & Plans

💰 PER-VISIT OPTIONS:
• First Visit: ₹499
• Follow-up (4 days): FREE
• Repeat Visit: ₹400-450

📦 SUBSCRIPTION PLANS (Heavy Discounts):
• Weekly (7 days, 3-4 visits): ₹999 (was ₹1,500) - Save ₹501
• Bi-Weekly (14 days, 5 visits): ₹1,799 (was ₹2,500) - Save ₹701
• Monthly (30 days, 7-8 visits): ₹3,499 (was ₹4,000) - Save ₹501

📹 VIDEO CONSULTATIONS:
• Quick (10 min): ₹250
• Standard (15 min): ₹400
• Detailed (25 min): ₹600
• Extended (30+ min): ₹850

📍 Location: H-20, Rapti Nagar, Phase-4, Gorakhpur - 273013
📞 Contact: +91 7905152928
📧 Email: dr.jayshankar@homeclinic.com

Book your appointment now! 🩺
```

## 🔧 Technical Details

### Frontend Implementation
- **Component**: `PricingTablePDF.tsx`
- **Location**: `frontend/src/components/`
- **PDF Import**: `import pricingTablePDF from "@/assets/pricing-table.pdf"`
- **Features**: Download, Preview, WhatsApp Share

### Vite Configuration
- **Assets Handling**: PDF files are included in build
- **Configuration**: `assetsInclude: ['**/*.pdf']` in `vite.config.ts`
- **Alias**: `@` points to `src` directory

### File Locations
- **Primary PDF**: `frontend/src/assets/pricing-table.pdf`
- **Component**: `frontend/src/components/PricingTablePDF.tsx`
- **Config**: `frontend/vite.config.ts`

## ✅ Testing

1. **Start the application**: `npm run dev`
2. **Navigate to Services section**
3. **Click "Download PDF"** - Should download the file
4. **Click "Preview PDF"** - Should open in new tab
5. **Click "Share on WhatsApp"** - Should open WhatsApp with message

## 🎯 Benefits

- **Professional Presentation**: Clean, branded PDF
- **Easy Sharing**: WhatsApp integration
- **Mobile Friendly**: Works on all devices
- **Offline Access**: Downloaded PDFs work offline
- **Print Ready**: PDF format is perfect for printing
- **Build Optimized**: PDF is processed by Vite for optimal delivery
- **Type Safe**: Import ensures file exists at build time

## 📝 Quick Setup

1. **Add your PDF**: Place `pricing-table.pdf` in `frontend/src/assets/`
2. **Restart dev server**: `npm run dev`
3. **Test features**: Download, Preview, WhatsApp Share

That's it! The system will automatically use your PDF file. 🎉
