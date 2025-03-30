const actions = [
  { word: "deploy", icon: "fas fa-code-branch" },
  { word: "optimize", icon: "fas fa-bolt" },
  { word: "refactor", icon: "fas fa-code" },
  { word: "boost", icon: "fas fa-chart-line" },
  { word: "containerize", icon: "fab fa-docker" },
  { word: "secure", icon: "fas fa-shield-alt" },
];

document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.createElement('div');
  preloader.className = 'icon-preloader';
  document.body.appendChild(preloader);
  
  actions.forEach(action => {
    const icon = document.createElement('i');
    const iconClasses = action.icon.split(' ');
    iconClasses.forEach(cls => icon.classList.add(cls));
    preloader.appendChild(icon);
  });
});

var typed = new Typed('.auto-type', {
  strings: [
    "API integration",
    "embedded system",
    "algorithm design",
    "optimization",
    "backend service",
    "merchant platform",
  ],
  typeSpeed: 70,
  backSpeed: 25,
  loop: true,

  preStringTyped: function(arrayPos) {
    const actionWrapper = document.querySelector('.action-wrapper');
    
    if (actionWrapper.classList.contains('sweep-out') || 
        actionWrapper.classList.contains('sweep-in')) {
      return;
    }
    
    actionWrapper.classList.add('sweep-out');
    
    setTimeout(() => {
      document.querySelector('.action-word').textContent = actions[arrayPos].word;
      
      const iconElement = document.querySelector('.action-icon');
      iconElement.className = 'action-icon';
      const iconClasses = actions[arrayPos].icon.split(' ');
      iconClasses.forEach(cls => iconElement.classList.add(cls));
      
      actionWrapper.classList.remove('sweep-out');
      actionWrapper.classList.add('sweep-in');
      
      setTimeout(() => {
        actionWrapper.classList.remove('sweep-in');
      }, 200);
      
    }, 200);
  }
});
