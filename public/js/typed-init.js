const actions = [
  { word: "commit", icon: "fab fa-git-alt" },
  { word: "push", icon: "fas fa-upload" },
  { word: "merge", icon: "fas fa-code-branch" },
  { word: "deploy", icon: "fas fa-rocket" },
  { word: "debug", icon: "fas fa-bug" },
  { word: "optimize", icon: "fas fa-bolt" },
  { word: "refactor", icon: "fas fa-code" },
  { word: "scale", icon: "fas fa-expand-arrows-alt" },
  { word: "containerize", icon: "fab fa-docker" }
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
    "mobile app architecture",
    "React.js application",
    "neural network",
    "API integration",
    "full-stack development",
    "embedded system",
    "algorithm design",
    "system optimization",
    "distributed system"
  ],
  typeSpeed: 80,
  backSpeed: 40,
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
