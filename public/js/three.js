<script>
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('three-js-container');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Create scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(windowWidth, windowHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  
  // Create frosted glass material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.2,
    transmission: 0.95,
    thickness: 0.5,
    envMapIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  
  // Create text using TroikaText
  const text = new troika.Text3D();
  text.text = 'Aaron McLean';
  text.fontSize = windowWidth < 768 ? 0.5 : 0.8;
  text.material = glassMaterial;
  text.color = 0xffffff;
  text.anchorX = 'center';
  text.anchorY = 'middle';
  text.curveRadius = 0;
  text.bevelEnabled = true;
  text.bevelSize = 0.02;
  text.bevelThickness = 0.02;
  scene.add(text);
  
  // Position the text
  text.position.x = -2;
  text.position.y = 1;
  
  // Create ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Create directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create point lights for highlights
  const pointLight1 = new THREE.PointLight(0x4d80ff, 2, 10);
  pointLight1.position.set(-2, 1, 4);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xff6b6b, 2, 10);
  pointLight2.position.set(2, -1, 4);
  scene.add(pointLight2);
  
  // Create dynamic background
  const particleCount = 200;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8
  });
  
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate text slightly
    text.rotation.y += 0.005;
    
    // Update particle positions
    particleSystem.rotation.y += 0.001;
    
    // Render the scene
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, newHeight);
    
    // Adjust text size based on screen width
    text.fontSize = newWidth < 768 ? 0.5 : 0.8;
    text.sync();
  });
});
</script>