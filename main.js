// Mobile Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
// Initialize Three.js
        const container = document.getElementById('car-container');
        const scene = new THREE.Scene();
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
        directionalLight.position.set(3, 5, 5);
        scene.add(directionalLight);
        
        // Car model
        let car;
        const loader = new THREE.GLTFLoader();
        
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        loader.load(
  'mustang.glb',
  (gltf) => {
    car = gltf.scene;
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(car);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Center the model
    car.position.sub(center);
    
    // Responsive scaling and positioning
    const setupCarPosition = () => {
      // Adjust scale based on screen size
      const scaleFactor = window.innerWidth < 768 ? 0.6 : (5, 7, 0.8);
      car.scale.set(scaleFactor, scaleFactor, scaleFactor);
      
      // Adjust vertical position responsively
      const verticalPosition = window.innerWidth < 768 ? 
        -size.y * 0.5 :  // Mobile
        -size.y * 1;   // Desktop
      
      car.position.y = verticalPosition;
      
      // Center camera based on device
      const cameraDistance = window.innerWidth < 768 ? 
        size.length() * 1.1 :  // Mobile (zoomed out more)
        size.length() * 0.8;   // Desktop
      
      camera.position.z = cameraDistance;
      camera.lookAt(new THREE.Vector3(0, verticalPosition, 0));
    };
    
    // Set up scroll rotation
                ScrollTrigger.create({
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom bottom",
                    onUpdate: (self) => {
                        if (car) {
                            // Full rotation based on scroll progress (0 to 1)
                            car.rotation.y = self.progress * Math.PI * 2;
                        }
                    },
                    scrub: true
                });
    // Initial setup
    setupCarPosition();
    
    // Update on window resize
    window.addEventListener('resize', () => {
      setupCarPosition();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    scene.add(car);
  },
  undefined,
  (error) => console.error(error)
);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
