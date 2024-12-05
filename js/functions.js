function parseTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}


function defineTime(startTime, endTime, startSpendingTime, spendingTimeMinutes) {
  const startWork = parseTime(startTime);
  const endWork = parseTime(endTime);
  const startMeeting = parseTime(startSpendingTime);
  const endMeeting = startMeeting + spendingTimeMinutes;

  return startMeeting >= startWork && endMeeting <= endWork;
}

// Примеры использования
defineTime('08:00', '17:30', '14:00', 90);
defineTime('8:0', '10:0', '8:0', 120);
defineTime('08:00', '14:30', '14:00', 90);
defineTime('14:00', '17:30', '08:0', 90);
defineTime('8:00', '17:30', '08:00', 900);
