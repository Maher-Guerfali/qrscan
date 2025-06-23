import * as THREE from 'three';

interface MindARCallbacks {
  onTrackingStart: () => void;
  onTrackingLost: () => void;
  onError: (error: string) => void;
  onReady: () => void;
}

interface MindARInstance {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  anchor: THREE.Group;
  isTracking: boolean;
  cleanup: () => void;
  takePhoto?: () => string | null;
}

export class MindARSystem {
  private container: HTMLElement;
  private mindFileUrl: string;
  private callbacks: MindARCallbacks;
  private ARComponent: any;
  private instance: MindARInstance | null = null;
  private animationId: number | null = null;
  private mindarThree: any = null;

  constructor(
    container: HTMLElement, 
    mindFileUrl: string, 
    callbacks: MindARCallbacks,
    ARComponent: any
  ) {
    this.container = container;
    this.mindFileUrl = mindFileUrl;
    this.callbacks = callbacks;
    this.ARComponent = ARComponent;
  }

  async initialize(): Promise<MindARInstance> {
    try {
      console.log('🚀 Initializing MindAR system...');
      console.log('📁 Marker file:', this.mindFileUrl);

      // Clear container
      this.container.innerHTML = '';

      // Validate .mind file before initializing MindAR
      await this.validateMindFile();

      // Dynamically import MindAR
      const { MindARThree } = await import('mind-ar/dist/mindar-image-three.prod.js');
      
      // Initialize MindAR
      this.mindarThree = new MindARThree({
        container: this.container,
        imageTargetSrc: this.mindFileUrl,
        maxTrack: 1,
        filterMinCF: 0.0001,
        filterBeta: 0.001,
        warmupTolerance: 5,
        missTolerance: 5
      });

      const { renderer, scene, camera } = this.mindarThree;

      // Create anchor for AR content
      const anchor = this.mindarThree.addAnchor(0);
      
      // Initialize AR component
      if (this.ARComponent) {
        const arComponent = new this.ARComponent(anchor.group, scene);
        if (arComponent.init) {
          arComponent.init();
        }
      }

      // Set up event listeners
      anchor.onTargetFound = () => {
        console.log('🎯 Target found!');
        this.callbacks.onTrackingStart();
        if (this.instance) {
          this.instance.isTracking = true;
        }
      };

      anchor.onTargetLost = () => {
        console.log('📱 Target lost!');
        this.callbacks.onTrackingLost();
        if (this.instance) {
          this.instance.isTracking = false;
        }
      };

      // Start MindAR
      await this.mindarThree.start();
      console.log('✅ MindAR started successfully');

      const instance: MindARInstance = {
        scene,
        camera,
        renderer,
        anchor: anchor.group,
        isTracking: false,
        cleanup: () => this.cleanup(),
        takePhoto: () => this.takePhoto()
      };

      this.instance = instance;

      // Start render loop
      this.startRenderLoop();

      this.callbacks.onReady();
      return instance;

    } catch (error) {
      console.error('❌ Failed to initialize MindAR:', error);
      
      // Provide specific error messages for common issues
      let errorMessage = `Failed to initialize MindAR: ${error}`;
      
      if (error instanceof Error) {
        if (error.message.includes('Extra') && error.message.includes('byte(s) found')) {
          errorMessage = `Invalid or corrupted .mind file: ${this.mindFileUrl}\n\nTo fix this:\n1. Go to https://hiukim.github.io/mind-ar-js-doc/tools/compile\n2. Upload your target image\n3. Download the generated .mind file\n4. Replace the current file in /public/assets/`;
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = `Marker file not found: ${this.mindFileUrl}\n\nPlease add the marker file to the /public/assets/ directory`;
        }
      }
      
      this.callbacks.onError(errorMessage);
      throw error;
    }
  }

  private async validateMindFile(): Promise<void> {
    try {
      const response = await fetch(this.mindFileUrl);
      
      if (!response.ok) {
        throw new Error(`Marker file not found (${response.status}): ${this.mindFileUrl}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      
      // Basic validation - .mind files should be at least a few KB
      if (arrayBuffer.byteLength < 100) {
        throw new Error(`Marker file appears to be empty or too small: ${arrayBuffer.byteLength} bytes`);
      }

      // Check if it's a valid binary file (not HTML error page)
      const uint8Array = new Uint8Array(arrayBuffer);
      const firstBytes = Array.from(uint8Array.slice(0, 10));
      
      // If it starts with HTML tags, it's likely an error page
      const text = new TextDecoder().decode(uint8Array.slice(0, 100));
      if (text.includes('<html') || text.includes('<!DOCTYPE')) {
        throw new Error(`Marker file appears to be an HTML page instead of a .mind file`);
      }

      console.log('✅ Marker file validation passed:', {
        size: arrayBuffer.byteLength,
        firstBytes: firstBytes.map(b => b.toString(16)).join(' ')
      });

    } catch (error) {
      console.error('❌ Marker file validation failed:', error);
      throw error;
    }
  }

  private startRenderLoop() {
    if (!this.mindarThree) return;

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.mindarThree.renderer.render(this.mindarThree.scene, this.mindarThree.camera);
    };

    animate();
  }

  private cleanup() {
    console.log('🧹 Cleaning up MindAR...');

    // Stop animation loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Stop MindAR
    if (this.mindarThree) {
      this.mindarThree.stop();
      this.mindarThree = null;
    }

    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }

    this.instance = null;
  }

  takePhoto(): string | null {
    if (!this.mindarThree) return null;

    try {
      const canvas = this.mindarThree.renderer.domElement;
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }
}

export const initializeMindAR = async (
  container: HTMLElement,
  mindFileUrl: string,
  callbacks: MindARCallbacks,
  ARComponent: any
): Promise<{ instance: MindARInstance; cleanupFn: () => void }> => {
  const mindAR = new MindARSystem(container, mindFileUrl, callbacks, ARComponent);
  const instance = await mindAR.initialize();
  
  return {
    instance,
    cleanupFn: () => mindAR.cleanup()
  };
};