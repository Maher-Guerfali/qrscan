import * as THREE from 'three';

// Base AR Component interface
export interface ARComponentInterface {
  init(): void;
  update?(deltaTime: number): void;
  dispose?(): void;
}

// Granny AR Component
export class GrannyComponent implements ARComponentInterface {
  private anchor: THREE.Group;
  private scene: THREE.Scene;
  private flowers: THREE.Mesh[] = [];
  private butterfly: THREE.Mesh | null = null;
  private time: number = 0;

  constructor(anchor: THREE.Group, scene: THREE.Scene) {
    this.anchor = anchor;
    this.scene = scene;
  }

  init() {
    console.log('🌻 Initializing Granny\'s Garden...');

    // Create a garden scene
    this.createGarden();
    this.createButterfly();
    this.createGrandmaChair();
    
    // Start animation loop
    this.animate();
  }

  private createGarden() {
    // Create flowers
    const flowerColors = [0xff69b4, 0xffd700, 0xff4500, 0x9370db, 0x00ff7f];
    
    for (let i = 0; i < 8; i++) {
      const flowerGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
      const flowerMaterial = new THREE.MeshPhongMaterial({ 
        color: flowerColors[i % flowerColors.length] 
      });
      const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
      
      // Position flowers in a circle
      const angle = (i / 8) * Math.PI * 2;
      flower.position.set(
        Math.cos(angle) * 0.8,
        0.15,
        Math.sin(angle) * 0.8
      );
      
      this.flowers.push(flower);
      this.anchor.add(flower);
    }

    // Create grass base
    const grassGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.05, 16);
    const grassMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.y = -0.025;
    this.anchor.add(grass);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 5, 5);
    this.scene.add(directionalLight);
  }

  private createButterfly() {
    // Create a simple butterfly
    const butterflyGroup = new THREE.Group();
    
    // Wings
    const wingGeometry = new THREE.SphereGeometry(0.08, 8, 6);
    const wingMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff69b4,
      transparent: true,
      opacity: 0.8
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.06, 0, 0);
    leftWing.scale.set(1, 0.5, 0.2);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.06, 0, 0);
    rightWing.scale.set(1, 0.5, 0.2);
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    butterflyGroup.add(leftWing);
    butterflyGroup.add(rightWing);
    butterflyGroup.add(body);
    
    butterflyGroup.position.set(0, 1, 0);
    this.butterfly = butterflyGroup;
    this.anchor.add(butterflyGroup);
  }

  private createGrandmaChair() {
    // Create a simple rocking chair
    const chairGroup = new THREE.Group();
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.4);
    const woodMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const seat = new THREE.Mesh(seatGeometry, woodMaterial);
    seat.position.y = 0.3;
    
    // Backrest
    const backGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.05);
    const back = new THREE.Mesh(backGeometry, woodMaterial);
    back.position.set(0, 0.55, -0.175);
    
    // Legs
    for (let i = 0; i < 4; i++) {
      const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
      const leg = new THREE.Mesh(legGeometry, woodMaterial);
      const x = (i % 2) * 0.35 - 0.175;
      const z = Math.floor(i / 2) * 0.35 - 0.175;
      leg.position.set(x, 0.15, z);
      chairGroup.add(leg);
    }
    
    chairGroup.add(seat);
    chairGroup.add(back);
    chairGroup.position.set(0.5, 0, 0.5);
    chairGroup.scale.set(0.8, 0.8, 0.8);
    
    this.anchor.add(chairGroup);
  }

  private animate() {
    const animateLoop = () => {
      this.time += 0.016; // ~60fps
      
      // Animate flowers swaying
      this.flowers.forEach((flower, index) => {
        flower.rotation.z = Math.sin(this.time * 2 + index) * 0.1;
      });
      
      // Animate butterfly flying
      if (this.butterfly) {
        this.butterfly.position.y = 1 + Math.sin(this.time * 3) * 0.2;
        this.butterfly.position.x = Math.cos(this.time * 1.5) * 0.5;
        this.butterfly.position.z = Math.sin(this.time * 1.2) * 0.5;
        this.butterfly.rotation.y = this.time * 2;
      }
      
      requestAnimationFrame(animateLoop);
    };
    
    animateLoop();
  }

  dispose() {
    // Clean up resources
    this.flowers.forEach(flower => {
      if (flower.geometry) flower.geometry.dispose();
      if (flower.material) (flower.material as THREE.Material).dispose();
    });
  }
}

// Robot AR Component
export class RobotComponent implements ARComponentInterface {
  private anchor: THREE.Group;
  private scene: THREE.Scene;
  private robot: THREE.Group | null = null;

  constructor(anchor: THREE.Group, scene: THREE.Scene) {
    this.anchor = anchor;
    this.scene = scene;
  }

  init() {
    console.log('🤖 Initializing Robot Factory...');
    this.createRobot();
    this.animate();
  }

  private createRobot() {
    const robotGroup = new THREE.Group();
    
    // Robot body
    const bodyGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.3);
    const metalMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x708090,
      metalness: 0.8,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, metalMaterial);
    body.position.y = 0.3;
    
    // Robot head
    const headGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const head = new THREE.Mesh(headGeometry, metalMaterial);
    head.position.y = 0.725;
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00,
      emissive: 0x004400
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.06, 0.75, 0.13);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.06, 0.75, 0.13);
    
    robotGroup.add(body);
    robotGroup.add(head);
    robotGroup.add(leftEye);
    robotGroup.add(rightEye);
    
    this.robot = robotGroup;
    this.anchor.add(robotGroup);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00ff00, 1, 10);
    pointLight.position.set(0, 2, 2);
    this.scene.add(pointLight);
  }

  private animate() {
    let time = 0;
    
    const animateLoop = () => {
      time += 0.016;
      
      if (this.robot) {
        // Robot head rotation
        const head = this.robot.children[1];
        if (head) {
          head.rotation.y = Math.sin(time) * 0.5;
        }
        
        // Robot body bobbing
        this.robot.position.y = Math.sin(time * 2) * 0.05;
      }
      
      requestAnimationFrame(animateLoop);
    };
    
    animateLoop();
  }

  dispose() {
    // Cleanup
  }
}

// Default/Fallback AR Component
export class DefaultComponent implements ARComponentInterface {
  private anchor: THREE.Group;
  private scene: THREE.Scene;

  constructor(anchor: THREE.Group, scene: THREE.Scene) {
    this.anchor = anchor;
    this.scene = scene;
  }

  init() {
    console.log('✨ Initializing Default AR Experience...');
    
    // Create a simple rotating cube
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    const cube = new THREE.Mesh(geometry, material);
    
    this.anchor.add(cube);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Animate
    let time = 0;
    const animate = () => {
      time += 0.016;
      cube.rotation.x = time;
      cube.rotation.y = time * 0.7;
      requestAnimationFrame(animate);
    };
    animate();
  }

  dispose() {
    // Cleanup
  }
}

// Component registry
const AR_COMPONENTS: Record<string, new (anchor: THREE.Group, scene: THREE.Scene) => ARComponentInterface> = {
  'granny': GrannyComponent,
  'robot': RobotComponent,
  'dragon': DefaultComponent, // Will create DragonComponent later
  'ocean': DefaultComponent,  // Will create OceanComponent later
};

export const loadARComponent = async (experienceId: string): Promise<new (anchor: THREE.Group, scene: THREE.Scene) => ARComponentInterface> => {
  console.log('🎯 Loading AR component for:', experienceId);
  
  const ComponentClass = AR_COMPONENTS[experienceId] || DefaultComponent;
  
  console.log('✅ AR component loaded:', ComponentClass.name);
  return ComponentClass;
};