// liquid-metal-text.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('shader-container');
    if (!container) {
        console.error('Shader container not found');
        return;
    }

    // --- Basic Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5; // Adjust distance based on text size

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // alpha:true for transparent background
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Better resolution on high-dpi screens
    container.appendChild(renderer.domElement);

    // --- Shader Code (GLSL) ---
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // Simple Noise function (from Book of Shaders)
    const noiseFunction = `
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                               -0.577350269189626,  // -1.0 + 2.0 * C.x
                                0.024390243902439); // 1.0 / 41.0
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i); // Avoid truncation effects in permutation
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform float time;
        uniform vec2 resolution;

        ${noiseFunction} // Include the noise function code here

        // Function to create a metallic gradient/sheen
        vec3 metallicLook(vec2 uv, float time) {
            float noiseFreq = 2.0;
            float noiseAmp = 0.15;
            float baseNoise = snoise(uv * noiseFreq + vec2(time * 0.1, 0.0)); // Slow horizontal movement

            // Distort UVs slightly based on noise for liquid effect
            vec2 distortedUv = uv + vec2(baseNoise * noiseAmp);

            // Create a base gradient (adjust colors for Apple-like silver)
            float gradient = smoothstep(0.1, 0.9, distortedUv.x + baseNoise * 0.3); // Add noise influence to gradient position
            vec3 color1 = vec3(0.8, 0.8, 0.85); // Light silver/grey
            vec3 color2 = vec3(0.4, 0.4, 0.45); // Darker silver/grey

            // Add some high-frequency noise for fine texture/reflection spots
            float fineNoise = snoise(distortedUv * 20.0 + time * 0.5);
            float highlights = smoothstep(0.6, 0.7, fineNoise); // Sharp highlights

            // Mix base gradient with highlights
            vec3 baseColor = mix(color2, color1, gradient);
            vec3 finalColor = mix(baseColor, vec3(1.0), highlights * 0.5); // Mix white highlights

            // Add subtle vertical variation / reflection-like bands
            float bands = sin((distortedUv.y + baseNoise * 0.2) * 10.0 + time * 0.3) * 0.5 + 0.5;
            finalColor = mix(finalColor, finalColor * 1.2, bands * 0.1); // Subtle bright bands
            finalColor = mix(finalColor, finalColor * 0.8, (1.0 - bands) * 0.1); // Subtle dark bands

            return finalColor;
        }

        void main() {
            vec2 uv = vUv;
            vec3 color = metallicLook(uv, time);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // --- Uniforms ---
    const uniforms = {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
    };

    // --- Material ---
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
    });

    // --- Text Geometry ---
    const fontLoader = new THREE.FontLoader();
    // You MUST host a compatible font file (convert TTF/OTF to Typeface JSON)
    // Use online converters like https://gero.github.io/facetype.js/
    // Or download pre-converted Helvetiker:
    fontLoader.load('https://unpkg.com/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {

        const textGeometry = new THREE.TextGeometry('Aaron McLean', {
            font: font,
            size: 1,         // Adjust size relative to container/camera
            height: 0.1,      // Thickness of the text
            curveSegments: 12, // Smoothness of curves
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5
        });

        // Center the text geometry
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
        textGeometry.translate(-textWidth / 2, -textHeight / 2, 0); // Center it

        const textMesh = new THREE.Mesh(textGeometry, material);
        scene.add(textMesh);

        // Adjust camera or mesh scale to fit container
        const aspect = container.clientWidth / container.clientHeight;
        // This is a rough fit, may need manual adjustment
        const textAspect = textWidth / textHeight;
        if (aspect > textAspect) {
             camera.fov = 2 * Math.atan( (textHeight/2) / camera.position.z ) * (180 / Math.PI) ;
             // Optional: Slightly zoom out
             camera.fov *= 1.5;
        } else {
             camera.fov = 2 * Math.atan( (textWidth/aspect/2) / camera.position.z ) * (180 / Math.PI) ;
             camera.fov *= 1.5;
        }
        camera.updateProjectionMatrix();


        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        onWindowResize(); // Call once initially

    }, undefined, function (error) {
        console.error('Font loading failed:', error);
         // Fallback: Show original text if font fails
         const originalH1 = document.getElementById('main-heading');
         if (originalH1) originalH1.style.visibility = 'visible';
         if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    });


    // --- Animation Loop ---
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        uniforms.time.value = elapsedTime; // Update time uniform

        // Optional: Subtle rotation or movement
        // if (scene.children.length > 0 && scene.children[0].geometry) { // Check if textMesh exists
        //     scene.children[0].rotation.y = Math.sin(elapsedTime * 0.1) * 0.1;
        // }

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize Handler ---
    function onWindowResize() {
        const width = container.clientWidth;
        // Recalculate height based on aspect ratio of the text to prevent squishing/stretching
        // This assumes textMesh is loaded. Add checks if necessary.
        let height = container.clientHeight; // Default or fallback
        const textMesh = scene.getObjectByProperty('type', 'Mesh');
         if (textMesh && textMesh.geometry.boundingBox) {
             const bounds = textMesh.geometry.boundingBox;
             const textAspect = (bounds.max.x - bounds.min.x) / (bounds.max.y - bounds.min.y);
             // Adjust height based on width to maintain aspect ratio
              if (!isNaN(textAspect) && textAspect > 0) {
                height = width / textAspect;
                // Clamp height if needed, e.g., not larger than original container height
                height = Math.min(height, container.style.height ? parseFloat(container.style.height) : 100); // Use explicit height or fallback
              }
         } else {
            // Fallback if text isn't loaded yet, use container's aspect
            height = container.clientHeight;
         }


        // Update camera aspect ratio
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(width, height);
        uniforms.resolution.value.set(width, height);
    }

});