function formatClock(d) {
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function formatCountdown(diffMs) {
  const min = Math.round(diffMs / 60000);
  if (min < -60) return { text: '已過', unit: '時', cls: 'past' };
  if (min < 0)   return { text: String(min),  unit: '分', cls: 'past' };
  if (min < 1)   return { text: '現', unit: '即將通過', cls: 'imminent' };
  if (min < 60)  return { text: String(min), unit: min <= 5 ? '分鐘後' : '分鐘', cls: min <= 5 ? 'imminent' : '' };
  const h = Math.floor(min / 60), m = min % 60;
  return { text: h + ':' + String(m).padStart(2,'0'), unit: '小時後', cls: '' };
}

function sameDayISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

export { formatClock, formatCountdown, sameDayISO };
