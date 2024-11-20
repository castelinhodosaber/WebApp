export function calculateMinutesDifference(
  startedAt: string,
  finishAt: string
) {
  const [startHour, startMinute] = startedAt.split(":").map(Number);
  const [finishHour, finishMinute] = finishAt.split(":").map(Number);

  const startInMinutes = startHour * 60 + startMinute;
  const finishInMinutes = finishHour * 60 + finishMinute;

  return finishInMinutes - startInMinutes;
}
