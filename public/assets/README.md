# AR Marker Files (.mind)

This directory contains MindAR marker files for image tracking.

## 📁 File Structure:
```
assets/
├── granny.mind      ← Marker for /granny experience
├── robot.mind       ← Marker for /robot experience
├── dragon.mind      ← Marker for /dragon experience
└── ocean.mind       ← Marker for /ocean experience
```

## 🎯 How it works:

1. **User scans QR code** → Goes to `domain.com/granny`
2. **System loads** → `/assets/granny.mind` marker file
3. **Camera tracks** → The printed `granny.mind` image
4. **Shows AR** → `GrannyComponent` Three.js experience

## 📱 Creating .mind files:

1. **Go to MindAR Compiler**: https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. **Upload your target image** (logo, photo, artwork, etc.)
3. **Download the generated .mind file**
4. **Rename it** to match your experience ID (e.g., `granny.mind`)
5. **Place it in this folder**

## 🖼️ Target Image Guidelines:

- **High contrast** images work best
- **Rich textures** and details
- **Avoid plain colors** or simple shapes
- **Square or rectangular** images preferred
- **Good lighting** in the source image

## 📋 Example Setup:

For a "granny" experience:
1. Take/find a photo of granny or her garden
2. Upload to MindAR compiler → get `granny.mind`
3. User scans QR → goes to `/granny`
4. Point camera at the original granny photo
5. See 3D garden with flowers and butterfly! 🌻🦋

## 🔗 QR Code Generation:

Generate QR codes that point to:
- `https://yourdomain.com/granny`
- `https://yourdomain.com/robot`
- `https://yourdomain.com/dragon`
- etc.

The system automatically loads the matching `.mind` file and AR component!