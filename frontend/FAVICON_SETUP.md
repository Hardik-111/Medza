# How to Change the Favicon

The favicon is the small icon that appears in the browser tab next to your website title.

## Current Setup

Your favicon is located at: `frontend/public/favicon.ico`

Vite automatically serves files from the `public` folder, so the favicon is automatically available at `/favicon.ico`.

## Steps to Change the Favicon

### Step 1: Prepare Your Favicon

1. **Create or download your favicon**:
   - Size: 32x32 pixels or 16x16 pixels (recommended: 32x32)
   - Format: `.ico` (best compatibility) or `.png`
   - You can use online tools like:
     - [Favicon Generator](https://www.favicon-generator.org/)
     - [RealFaviconGenerator](https://realfavicongenerator.net/)
     - [Favicon.io](https://favicon.io/)

2. **Name it**: `favicon.ico` (or `favicon.png`)

### Step 2: Replace the Existing Favicon

**Option A: Using File Explorer/Finder**
1. Navigate to: `frontend/public/`
2. Delete or rename the existing `favicon.ico`
3. Copy your new favicon file to `frontend/public/favicon.ico`

**Option B: Using Terminal**
```bash
cd frontend/public
# Backup the old one (optional)
mv favicon.ico favicon.ico.backup
# Copy your new favicon here
cp /path/to/your/new-favicon.ico favicon.ico
```

### Step 3: Update index.html (Optional but Recommended)

For better control and to support multiple formats, update `frontend/index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  
  <title>Dr. Jayshankar Prasad Singh - Home Clinic...</title>
  <!-- rest of your head content -->
</head>
```

**Note**: If you only have a `.ico` file, just add:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

### Step 4: Clear Browser Cache

After replacing the favicon:

1. **Hard refresh** your browser:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R`

2. **Or clear browser cache**:
   - Chrome: Settings > Privacy > Clear browsing data > Cached images and files
   - Firefox: Settings > Privacy > Clear Data > Cached Web Content

### Step 5: Rebuild (If Needed)

If you're running a development server, restart it:
```bash
cd frontend
npm run dev
# or
npm start
```

For production builds:
```bash
cd frontend
npm run build
```

## Quick Example

Here's a quick way to change it:

1. **Get a medical-themed favicon**:
   - Use a stethoscope icon 🩺
   - Use a medical cross icon ⚕️
   - Use a heart icon ❤️
   - Or use the clinic logo

2. **Convert to .ico format**:
   - Use [Favicon.io](https://favicon.io/) - upload image, download .ico
   - Or use [CloudConvert](https://cloudconvert.com/png-to-ico)

3. **Replace the file**:
   ```bash
   # Copy your new favicon
   cp ~/Downloads/my-favicon.ico frontend/public/favicon.ico
   ```

4. **Restart dev server** (if running):
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

## File Locations

- **Source**: `frontend/public/favicon.ico` (this is what you edit)
- **Build output**: `frontend/dist/favicon.ico` (auto-generated, don't edit)

## Supported Formats

- `.ico` - Best compatibility (recommended)
- `.png` - Modern browsers support this
- `.svg` - Scalable, modern browsers only

## Tips

1. **Keep it simple**: Favicons are small, so simple designs work best
2. **Use high contrast**: Make sure it's visible on both light and dark browser themes
3. **Test in different browsers**: Chrome, Firefox, Safari, Edge
4. **Consider multiple sizes**: 16x16, 32x32, 48x48 for different contexts

## Troubleshooting

### Favicon not updating?
- Clear browser cache (hard refresh)
- Check file name is exactly `favicon.ico`
- Verify file is in `frontend/public/` folder
- Restart development server

### Favicon looks blurry?
- Use a higher resolution source image (at least 64x64)
- Convert to .ico format properly
- Consider using SVG for crisp display

### Want to use a different file name?
If you want to use `logo.ico` instead:
1. Place it in `public/` folder
2. Update `index.html`:
   ```html
   <link rel="icon" type="image/x-icon" href="/logo.ico" />
   ```
