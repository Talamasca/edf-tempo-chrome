const API_TODAY = 'https://www.api-couleur-tempo.fr/api/jourTempo/today';
const API_TOMORROW = 'https://www.api-couleur-tempo.fr/api/jourTempo/tomorrow';

const COLORS = {
  0: { color: '#808080', name: 'Unknown' },
  1: { color: '#0000FF', name: 'Blue' },
  2: { color: '#FFFFFF', name: 'White' },
  3: { color: '#FF0000', name: 'Red' }
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR');
}

function updateDayInfo(elementId, date, colorCode) {
  const container = document.getElementById(elementId);
  const colorInfo = COLORS[colorCode] || COLORS[0];
  
  container.querySelector('.color-indicator').style.backgroundColor = colorInfo.color;
  container.querySelector('.date').textContent = `${elementId === 'today' ? 'Today' : 'Tomorrow'} (${formatDate(date)}):`;
  container.querySelector('.color-name').textContent = colorInfo.name;
}

async function fetchTempoColors() {
  try {
    const [todayResponse, tomorrowResponse] = await Promise.all([
      fetch(API_TODAY),
      fetch(API_TOMORROW)
    ]);
    
    const todayData = await todayResponse.json();
    const tomorrowData = await tomorrowResponse.json();
    
    updateDayInfo('today', todayData.dateJour, todayData.codeJour);
    updateDayInfo('tomorrow', tomorrowData.dateJour, tomorrowData.codeJour);
  } catch (error) {
    console.error('Error fetching Tempo colors:', error);
    updateDayInfo('today', new Date(), 0);
    updateDayInfo('tomorrow', new Date(Date.now() + 86400000), 0);
  }
}

// Fetch data when popup opens
document.addEventListener('DOMContentLoaded', fetchTempoColors);