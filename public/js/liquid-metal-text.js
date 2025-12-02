const params = {
  refraction: 0.002,
  edge: 0.000,
  patternBlur: 0.05,
  liquid: 0.35,
  speed: 0.04,
  patternScale: 0.1,
};
const vertexShaderSource = `#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 vUv;

        void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;


const liquidFragSource = `#version 300 es
precision mediump float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_patternScale;
uniform float u_refraction;
uniform float u_edge;
uniform float u_patternBlur;
uniform float u_liquid;


#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846


vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
        float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

vec2 get_img_uv() {
  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
      img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  } else {
      img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  }
  float scale_factor = 1.;
  img_uv *= scale_factor;
  img_uv += .5;

  img_uv.y = 1. - img_uv.y;

  return img_uv;
}
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {
  float ch = c2;
  float border = 0.;
  float blur = u_patternBlur + extra_blur;

  ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));

  border = w[0];
  ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));

  b = smoothstep(.2, .8, b);
  border = w[0] + .4 * (1. - b) * w[1];
  ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));

  border = w[0] + .5 * (1. - b) * w[1];
  ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));

  return ch;
}

float get_img_frame_alpha(vec2 uv, float img_frame_width) {
  float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
  img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
  return img_frame_alpha;
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float diagonal = uv.x - uv.y;

  float t = .001 * u_time;

  vec2 img_uv = get_img_uv();
  vec4 img = texture(u_image_texture, img_uv);

  vec3 color = vec3(0.);
  float opacity = 1.;

  vec3 color1 = vec3(1.0, 1.0, 1.0);
  vec3 color2 = vec3(0.0, 0.0, 0.0);

  float edge = img.r;


  vec2 grad_uv = uv;
  grad_uv.x -= u_ratio * 0.5;
  grad_uv.y -= 0.5;

  float dist = length(grad_uv + vec2(0., .2 * diagonal));

  grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * PI);

  float bulge = pow(1.8 * dist, 1.2);
  bulge = 1. - bulge;
  bulge *= pow(uv.y, .3);


  float cycle_width = u_patternScale;
  float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);
  float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycle_width * thin_strip_1_ratio;
  float thin_strip_2_width = cycle_width * thin_strip_2_ratio;

  opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);
  opacity *= get_img_frame_alpha(img_uv, 0.01);


  float noise = snoise(uv - t);

  edge += (1. - edge) * u_liquid * noise;

  float refr = 0.;
  refr += (1. - bulge);
  refr = clamp(refr, 0., 1.);

  float dir = grad_uv.x;


  dir += diagonal;

  dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));

  bulge *= clamp(pow(uv.y, .1), .3, 1.);
  dir *= (.1 + (1.1 - edge) * bulge);

  dir *= smoothstep(1., .7, edge);

  dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));
  dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));

  dir *= (.5 + .5 * pow(uv.y, 2.));

  dir *= cycle_width;

  dir -= t;

  float refr_r = refr;
  refr_r += .03 * bulge * noise;
  float refr_b = 1.3 * refr;

  refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));
  refr_r -= diagonal;

  refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));
  refr_b -= .2 * edge;

  refr_r *= u_refraction;
  refr_b *= u_refraction;

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bulge);
  float stripe_r = mod(dir + refr_r, 1.);
  float r = get_color_channel(color1.r, color2.r, stripe_r, w, 0.02 + .03 * u_refraction * bulge, bulge);
  float stripe_g = mod(dir, 1.);
  float g = get_color_channel(color1.g, color2.g, stripe_g, w, 0.01, bulge);
  float stripe_b = mod(dir - refr_b, 1.);
  float b = get_color_channel(color1.b, color2.b, stripe_b, w, .01, bulge);

  color = vec3(r, g, b);

  color *= opacity;

  fragColor = vec4(color, opacity);
}`;


function init() {

  createTextImage();


  initWebGL();
}


function createTextImage() {
  const textCanvas = document.getElementById('text-canvas');

  if (!textCanvas) {
    console.error('Text canvas not found');
    return;
  }

  const ctx = textCanvas.getContext('2d');

  const containerWidth = textCanvas.parentElement.offsetWidth;
  const containerHeight = textCanvas.parentElement.offsetHeight;

  const scale = (window.devicePixelRatio || 1) * 1.5;
  textCanvas.width = containerWidth * scale;
  textCanvas.height = containerHeight * scale;

  ctx.scale(scale, scale);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, containerWidth, containerHeight);

  const fontSize = Math.min(
    Math.floor(containerHeight * 0.65),
    Math.floor(containerWidth / 8)
  );

  ctx.fillStyle = 'black';
  ctx.font = '900 ' + fontSize + 'px "Audiowide", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText('Aaron McLean', containerWidth / 2, containerHeight / 2);

  processTextImage(textCanvas);
}


function processTextImage(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;


  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;


  const shapeMask = new Array(width * height).fill(false);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      if (data[idx] < 240 || data[idx + 1] < 240 || data[idx + 2] < 240) {
        shapeMask[y * width + x] = true;
      }
    }
  }


  const boundaryMask = new Array(width * height).fill(false);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!shapeMask[idx]) continue;

      let isBoundary = false;
      for (let ny = Math.max(0, y - 1); ny <= Math.min(height - 1, y + 1) && !isBoundary; ny++) {
        for (let nx = Math.max(0, x - 1); nx <= Math.min(width - 1, x + 1) && !isBoundary; nx++) {
          if (!shapeMask[ny * width + nx]) {
            isBoundary = true;
          }
        }
      }

      if (isBoundary) {
        boundaryMask[idx] = true;
      }
    }
  }


  let distField = new Float32Array(width * height).fill(0);
  const iterations = 100;


  let newDist = new Float32Array(width * height).fill(0);
  const distC = 0.05;


  for (let iter = 0; iter < iterations; iter++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;

        if (!shapeMask[idx] || boundaryMask[idx]) {
          newDist[idx] = 0;
          continue;
        }


        let sum = 0;
        let count = 0;

        for (let ny = Math.max(0, y - 1); ny <= Math.min(height - 1, y + 1); ny++) {
          for (let nx = Math.max(0, x - 1); nx <= Math.min(width - 1, x + 1); nx++) {
            if ((nx !== x || ny !== y) && shapeMask[ny * width + nx]) {
              sum += distField[ny * width + nx];
              count++;
            }
          }
        }

        newDist[idx] = count > 0 ? (distC + sum / count) : distC;
      }
    }


    const temp = distField;
    distField = newDist;
    newDist = temp;
  }


  let maxDist = 0;
  for (let i = 0; i < distField.length; i++) {
    maxDist = Math.max(maxDist, distField[i]);
  }


  const outImageData = ctx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixelIdx = idx * 4;

      if (!shapeMask[idx]) {
        outImageData.data[pixelIdx] = 255;
        outImageData.data[pixelIdx + 1] = 255;
        outImageData.data[pixelIdx + 2] = 255;
        outImageData.data[pixelIdx + 3] = 255;
      } else {

        const val = distField[idx] / maxDist;
        const remapped = Math.pow(val, 1.5);
        const gray = Math.floor(255 * (1 - remapped));

        outImageData.data[pixelIdx] = gray;
        outImageData.data[pixelIdx + 1] = gray;
        outImageData.data[pixelIdx + 2] = gray;
        outImageData.data[pixelIdx + 3] = 255;
      }
    }
  }


  ctx.putImageData(outImageData, 0, 0);


  window.processedTextImage = outImageData;
}


function initWebGL() {
  const shaderCanvas = document.getElementById('shader-canvas');

  if (!shaderCanvas) {
    console.error('Shader canvas not found');
    return;
  }

  const gl = shaderCanvas.getContext('webgl2', {
    antialias: true,
    alpha: true
  });

  if (!gl) {
    console.error('WebGL2 not supported');
    return;
  }

  const containerWidth = shaderCanvas.parentElement.offsetWidth;
  const containerHeight = shaderCanvas.parentElement.offsetHeight;

  // Force 150% resolution by multiplying the scale factor
  const scale = (window.devicePixelRatio || 1) * 1.5;
  shaderCanvas.width = containerWidth * scale;
  shaderCanvas.height = containerHeight * scale;

  gl.viewport(0, 0, shaderCanvas.width, shaderCanvas.height);

  const program = createShaderProgram(gl, vertexShaderSource, liquidFragSource);
  if (!program) {
    console.error('Failed to create shader program');
    return;
  }

  gl.useProgram(program);

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {};
  const uniformNames = [
    'u_image_texture',
    'u_time',
    'u_ratio',
    'u_img_ratio',
    'u_patternScale',
    'u_refraction',
    'u_edge',
    'u_patternBlur',
    'u_liquid'
  ];

  uniformNames.forEach(name => {
    uniforms[name] = gl.getUniformLocation(program, name);
  });

  setupTexture(gl, uniforms);

  gl.uniform1f(uniforms.u_ratio, containerWidth / containerHeight);
  gl.uniform1f(uniforms.u_img_ratio, containerWidth / containerHeight);
  gl.uniform1f(uniforms.u_patternScale, params.patternScale);
  gl.uniform1f(uniforms.u_refraction, params.refraction);
  gl.uniform1f(uniforms.u_edge, params.edge);
  gl.uniform1f(uniforms.u_patternBlur, params.patternBlur);
  gl.uniform1f(uniforms.u_liquid, params.liquid);

  window.glContext = {
    gl: gl,
    uniforms: uniforms
  };

  let animationTime = 0;
  let lastTime = 0;

  function render(currentTime) {
    currentTime *= 0.001;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    animationTime += deltaTime * params.speed * 1000;
    gl.uniform1f(uniforms.u_time, animationTime);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  window.addEventListener('resize', function () {
    setTimeout(() => {
      if (!shaderCanvas || !shaderCanvas.parentElement) return;

      const newWidth = shaderCanvas.parentElement.offsetWidth;
      const newHeight = shaderCanvas.parentElement.offsetHeight;

      shaderCanvas.width = newWidth * scale;
      shaderCanvas.height = newHeight * scale;

      gl.viewport(0, 0, shaderCanvas.width, shaderCanvas.height);

      gl.uniform1f(uniforms.u_ratio, newWidth / newHeight);

      createTextImage();
    }, 100);
  });
}


function createShaderProgram(gl, vsSource, fsSource) {

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);


  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return null;
  }


  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);


  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }


  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);


  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }

  return program;
}


function setupTexture(gl, uniforms) {

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);


  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


  const checkImage = () => {
    if (window.processedTextImage) {

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        window.processedTextImage.width,
        window.processedTextImage.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        window.processedTextImage.data
      );


      gl.uniform1i(uniforms.u_image_texture, 0);
    } else {

      setTimeout(checkImage, 100);
    }
  };

  checkImage();
}


document.addEventListener('DOMContentLoaded', function () {
  try {
    console.log('Initializing liquid metal text effect');
    init();
  } catch (e) {
    console.error('Error initializing liquid metal text:', e);
  }
});