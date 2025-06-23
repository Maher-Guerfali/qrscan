# 3D Models Directory

This directory contains 3D model files for AR experiences.

## Supported Formats:
- `.gltf` / `.glb` - Recommended format for web
- `.obj` - Basic geometry support
- `.dae` - Collada format

## File Organization:
```
models/
├── cube/
│   ├── cube.gltf
│   └── textures/
├── character/
│   ├── character.glb
│   └── animations/
└── environment/
    └── scene.gltf
```

## How to add 3D models:

1. **Prepare Model**: Optimize your 3D model for web (low poly, compressed textures)
2. **Export as GLTF**: Use Blender, Maya, or online converters
3. **Add to Directory**: Create a folder for your model and assets
4. **Update Configuration**: Reference the model in `arExperiences.json`

## Model Configuration Example:
```json
{
  "model": {
    "type": "gltf",
    "src": "/models/cube/cube.gltf",
    "scale": "1 1 1",
    "position": "0 0 0",
    "animation": {
      "property": "rotation",
      "to": "0 360 0",
      "dur": 5000,
      "loop": true
    }
  }
}
```