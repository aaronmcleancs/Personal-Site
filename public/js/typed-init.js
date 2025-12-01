const actions = [
  { word: "Engineering", icon: "fas fa-microchip" },
  { word: "Optimizing", icon: "fas fa-bolt" },
  { word: "Developing", icon: "fas fa-code" },
  { word: "Testing", icon: "fas fa-vial" },
  { word: "Architecting", icon: "fas fa-network-wired" },
  { word: "Training", icon: "fas fa-brain" },
];

document.addEventListener('DOMContentLoaded', function () {
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
    "Embedded Control Systems",
    "Neural Networks",
    "Testing Automation",
    "Distributed Systems",
    "Vehicle Electrification",
    "Quantum Algorithms",
  ],
  typeSpeed: 70,
  backSpeed: 45,
  backDelay: 800,
  loop: true,

  preStringTyped: function (arrayPos) {
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
