// Listener for messages from the popup UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { tool } = message;
    
    if (tool === 'uv') {
      applyUVLightEffect();
    } else if (tool === 'magnifying') {
      applyMagnifyingGlassEffect();
    } else if (tool === 'eraser') {
      applyEraserEffect();
    }
  });
  
  const applyUVLightEffect = () => {
    const hiddenElements = document.querySelectorAll('.hidden-clue');
    hiddenElements.forEach(el => {
      el.style.color = 'yellow';
      el.style.transition = 'color 0.5s';
    });
  };
  
  const applyMagnifyingGlassEffect = () => {
    document.body.style.transform = 'scale(1.5)';
    document.body.style.transition = 'transform 0.3s ease-in-out';
  };
  
  const applyEraserEffect = () => {
    const obscuredElements = document.querySelectorAll('.obscured-clue');
    obscuredElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transition = 'opacity 0.5s';
    });
  };
  