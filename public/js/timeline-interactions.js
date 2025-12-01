document.addEventListener('DOMContentLoaded', () => {
  const timelineItems = document.querySelectorAll('.timeline-content');

  timelineItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Allow links to work normally
      if (e.target.tagName === 'A' || e.target.closest('a')) return;

      // Toggle active class on the clicked item
      // We implement an accordion behavior (close others when one opens) for cleaner UX
      const wasActive = item.classList.contains('active');

      // Remove active class from all items
      timelineItems.forEach(other => {
        other.classList.remove('active');
      });

      // If it wasn't active before, make it active now
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
});
