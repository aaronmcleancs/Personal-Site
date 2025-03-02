(function() {
    const heroSection = document.querySelector('.hero__section');
    let ticking = false;
    function getBaseScale(width) {
      const minWidth = 300, maxWidth = 1300;
      if (width <= minWidth) return 1300;
      if (width >= maxWidth) return 220;
      return 1300 - (width - minWidth) * ((1300 - 220) / (maxWidth - minWidth));
    }
    function updateBackground() {
      const scrollPercent = window.scrollY / (document.body.offsetHeight - window.innerHeight);
      const baseScale = getBaseScale(window.innerWidth);
      const dynamicScale = baseScale + scrollPercent * 800;
      heroSection.style.backgroundSize = `${dynamicScale}%`;
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateBackground);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateBackground);
    updateBackground();
  })();

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
    const dotRadius = 2;
    const dotColor = 'rgb(32, 32, 32)';
    
    
    const waveSpeed = 0.005;
    const waveAmplitude = 10;
    const waveFrequency = 0.05;
    const waveOffset = 5;
    
    
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let mouseActive = false;
    
    
    heroSection.addEventListener('mousemove', function(e) {
      const rect = heroSection.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
      
      
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseActive = false;
      }, 2000);
    });
    
    let mouseTimeout;
    
    
    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          
          
          let offsetX = Math.sin(time + j * waveFrequency) * waveAmplitude;
          let offsetY = Math.cos(time + i * waveFrequency) * waveAmplitude;
          
          
          if (mouseActive) {
            const distX = x - mouseX;
            const distY = y - mouseY;
            const dist = Math.sqrt(distX * distX + distY * distY);
            const maxDist = 400;
            
            if (dist < maxDist) {
              const influence = (1 - dist / maxDist) * 15;
              offsetX += (distX / dist) * influence;
              offsetY += (distY / dist) * influence;
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