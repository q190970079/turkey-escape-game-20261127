// Keyboard and mouse input. Every action the turkey can do is one
// named event, so the game loop never reads raw keys itself.
export function createInput(canvas, onAction) {
  const held = new Set();
  const queue = [];

  function press(action) {
    queue.push(action);
    onAction(action);
  }

  function keyToAction(code) {
    if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') return 'jump';
    if (code === 'ArrowDown' || code === 'KeyS') return 'slide';
    if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'ArrowRight' || code === 'KeyD') return 'dash';
    if (code === 'Enter') return 'start';
    if (code === 'KeyM') return 'mute';
    if (code === 'KeyR') return 'restart';
    return null;
  }

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const action = keyToAction(event.code);
    if (!action) return;
    event.preventDefault();
    held.add(action);
    press(action);
  });
  window.addEventListener('keyup', (event) => {
    const action = keyToAction(event.code);
    if (action) held.delete(action);
  });

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    press('click');
    queue.push({ clickX: x, clickY: y });
    onAction('clickAt', x, y);
  });

  return {
    held,
    takeClicks() {
      const clicks = queue.filter((item) => item && typeof item === 'object');
      queue.length = 0;
      return clicks;
    },
  };
}
