export function initResizer() {
  const resizer = document.getElementById('resizer');
  const detail  = document.getElementById('detail-pane');
  const app     = document.getElementById('app');
  let dragging  = false, startX = 0, startW = 0;

  resizer.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = detail.offsetWidth;
    resizer.classList.add('dragging');
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const appW   = app.offsetWidth;
    const delta  = startX - e.clientX; // moving left = wider detail
    const newW   = Math.min(appW * 0.4, Math.max(appW * 0.1, startW + delta));
    detail.style.width = newW + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('dragging');
    document.body.style.userSelect = '';
  });
}
