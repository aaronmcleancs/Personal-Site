(function() {
  const heroSection = document.querySelector('.hero__section');
  const zoomFactor = 1.2;
  let animationFrameId = null;
  let lastScrollY = window.scrollY;
  let currentScale = calculateTargetScale(window.scrollY);
  
  function getBaseScale(width) {
    const minWidth = 300, maxWidth = 1300;
    if (width <= minWidth) return 1300;
    if (width >= maxWidth) return 220;
    return 1300 - (width - minWidth) * ((1300 - 220) / (maxWidth - minWidth));
  }
  
  function calculateTargetScale(scrollVal) {
    const scrollHeight = Math.max(
      document.body.scrollHeight, 
      document.documentElement.scrollHeight
    );
    const scrollPercent = scrollVal / (scrollHeight - window.innerHeight);
    const baseScale = getBaseScale(window.innerWidth);
    const baselineWidth = 1920;
    const multiplier = window.innerWidth > baselineWidth ? 700 * (baselineWidth / window.innerWidth) : 700;
    const offset = baseScale * 0.4;
    return (baseScale + scrollPercent * multiplier) - offset * (1 - scrollPercent);
  }
  
  function smoothUpdate() {
    const targetScale = calculateTargetScale(window.scrollY);
    const ease = navigator.userAgent.indexOf('Firefox') !== -1 ? 0.05 : 0.1;
    currentScale += (targetScale - currentScale) * ease;
    heroSection.style.backgroundSize = `${currentScale * zoomFactor}%`;
    if (Math.abs(targetScale - currentScale) > 0.1) {
      animationFrameId = requestAnimationFrame(smoothUpdate);
    } else {
      animationFrameId = null;
    }
  }
  
  function onScroll() {
    if (Math.abs(window.scrollY - lastScrollY) < 5) return;
    lastScrollY = window.scrollY;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(smoothUpdate);
  }
  
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;
        onScroll();
      }, 10);
    }
  }, { passive: true });
  
  window.addEventListener('resize', function() {
    currentScale = calculateTargetScale(window.scrollY);
    heroSection.style.backgroundSize = `${currentScale * zoomFactor}%`;
  });
  
  currentScale = calculateTargetScale(window.scrollY);
  heroSection.style.backgroundSize = `${currentScale * zoomFactor}%`;
  heroSection.style.backgroundPosition = "center top";
})();

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.terminal-container');
  const textWrapper = document.querySelector('.text-wrapper');
  
  container.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = y * 0.13;
    const rotateY = x * -0.05;
    
    textWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  });
  
  container.addEventListener('mouseleave', function() {
    textWrapper.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const heroSection = document.querySelector('.hero2__section');
  if (!heroSection) return;
  
  const canvas = document.createElement('canvas');
  canvas.className = 'grid-canvas';
  heroSection.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const spacing = 45;
  const baseDotRadius = 1.5;  
  const maxDotRadius = 2.6; 
  const dotColor = 'rgb(71, 71, 71)';
  
  const waveSpeed = 0.005;
  const waveAmplitude = 15;
  const waveFrequency = 0.05;
  const waveOffset = 5;
  
  
  const transitionSpeed = 0.05; 
  
  let time = 0;
  let mouseX = 0;
  let mouseY = 0;
  let mouseActive = false;
  
  
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let mouseInfluence = 0; 
  
  heroSection.addEventListener('mousemove', function(e) {
    const rect = heroSection.getBoundingClientRect();
    targetMouseX = e.clientX - rect.left;
    targetMouseY = e.clientY - rect.top;
    mouseActive = true;
    
    
    clearTimeout(mouseTimeout);
    mouseInfluenceTarget = 1;
    
    mouseTimeout = setTimeout(() => {
      
      
      mouseInfluenceTarget = 0;
    }, 1000); 
  });
  
  
  heroSection.addEventListener('mouseleave', function() {
    mouseInfluenceTarget = 0;
  });
  
  let mouseTimeout;
  let mouseInfluenceTarget = 0;
  
  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    currentMouseX += (targetMouseX - currentMouseX) * transitionSpeed;
    currentMouseY += (targetMouseY - currentMouseY) * transitionSpeed;
    mouseInfluence += (mouseInfluenceTarget - mouseInfluence) * transitionSpeed;
    
    const cols = Math.ceil(canvas.width / spacing) + 1;
    const rows = Math.ceil(canvas.height / spacing) + 1;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        
        
        let offsetX = Math.sin(time + j * waveFrequency) * waveAmplitude;
        let offsetY = Math.cos(time + i * waveFrequency) * waveAmplitude;
        
        
        let dotRadius = baseDotRadius;
        
        
        if (mouseInfluence > 0.01) { 
          const distX = x - currentMouseX;
          const distY = y - currentMouseY;
          const dist = Math.sqrt(distX * distX + distY * distY);
          const maxDist = 1000;
          
          if (dist < maxDist) {
            
            const factor = 1 - dist / maxDist;
            const influence = factor * 15 * mouseInfluence;
            
            
            offsetX += (distX / dist) * influence;
            offsetY += (distY / dist) * influence;
            
            
            
            const sizeFactor = factor * factor * mouseInfluence;
            dotRadius = baseDotRadius + (maxDotRadius - baseDotRadius) * sizeFactor;
          }
        }
        
        const dotX = x + offsetX;
        const dotY = y + offsetY;
        
        if (dotX >= -spacing && dotX <= canvas.width + spacing &&
            dotY >= -spacing && dotY <= canvas.height + spacing) {
          
          const waveHeight = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
          const opacity = 0.5 + (waveHeight / (waveAmplitude * 2)) * 0.5;
          
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(32, 32, 32, ${opacity})`;
          ctx.fill();
        }
      }
    }
    
    time += waveSpeed;
    
    requestAnimationFrame(drawGrid);
  }
  
  drawGrid();
});

document.addEventListener('DOMContentLoaded', function() {
  const scrollSuggestion = document.querySelector('.scroll-suggestion');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      scrollSuggestion.classList.add('hidden');
    } else {
      scrollSuggestion.classList.remove('hidden');
    }
  });
});