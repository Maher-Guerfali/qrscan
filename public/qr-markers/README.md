# QR Markers Directory

This directory contains QR code images and marker patterns for AR experiences.

## File Structure:
- `*.png` - QR code images that users scan with their native camera
- `*.patt` - AR.js marker pattern files for tracking

## How to add new QR codes:

1. **Create QR Code**: Generate a QR code that points to your app URL with experience parameter:
   ```
   https://your-app-url.com/?experience=cube-experience
   ```

2. **Add QR Image**: Save the QR code image as PNG in this directory
   - Example: `cube-qr.png`

3. **Create Marker Pattern** (Optional): 
   - Use AR.js Marker Training: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
   - Upload your QR code image to generate a `.patt` file
   - Save the `.patt` file in this directory

4. **Update Configuration**: Add the experience to `src/config/arExperiences.json`

## Default Markers:
- Uses AR.js built-in "hiro" marker for testing
- You can print the Hiro marker from: https://github.com/jeromeetienne/AR.js/blob/master/data/images/HIRO.jpg