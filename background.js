const API_TODAY = 'https://www.api-couleur-tempo.fr/api/jourTempo/today';
const API_TOMORROW = 'https://www.api-couleur-tempo.fr/api/jourTempo/tomorrow';

function drawRedDot() {
  const canvas = new OffscreenCanvas(16, 16);
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, 16, 16);
  
  // Draw red circle
  ctx.beginPath();
  ctx.arc(8, 8, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#FF0000';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  return ctx.getImageData(0, 0, 16, 16);
}

async function updateIcon() {
  try {
    const [todayResponse, tomorrowResponse] = await Promise.all([
      fetch(API_TODAY),
      fetch(API_TOMORROW)
    ]);
    
    const todayData = await todayResponse.json();
    const tomorrowData = await tomorrowResponse.json();
    
    // Show red dot if either today or tomorrow is a red day (code 3)
    if (todayData.codeJour === 3 || tomorrowData.codeJour === 3) {
      chrome.action.setIcon({ imageData: drawRedDot() });
    } else {
      chrome.action.setIcon({ path: 'icons/edf-logo.png' });
    }
  } catch (error) {
    console.error('Error fetching Tempo colors:', error);
    chrome.action.setIcon({ path: 'icons/edf-logo.png' });
  }
}

// Update status every hour
setInterval(updateIcon, 3600000);

// Initial update
updateIcon();