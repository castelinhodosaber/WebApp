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

export function calculateEndTime(finishAt: number, startedAt: string): string {
  // Parse o startedAt em horas e minutos
  const [startHour, startMinute] = startedAt.split(":").map(Number);

  // Converte startedAt para minutos
  const startInMinutes = startHour * 60 + startMinute;

  // Calcula o tempo final em minutos
  const endInMinutes = startInMinutes + finishAt;

  // Converte os minutos finais para horas e minutos
  const endHour = Math.floor(endInMinutes / 60) % 24; // Mod 24 para ciclos de 24 horas
  const endMinute = endInMinutes % 60;

  // Formata o resultado no formato hh:mm
  const formattedHour = endHour.toString().padStart(2, "0");
  const formattedMinute = endMinute.toString().padStart(2, "0");

  return `${formattedHour}:${formattedMinute}`;
}
