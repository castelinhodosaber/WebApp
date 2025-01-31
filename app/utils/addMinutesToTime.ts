function addMinutesToTime(timeString: string, minutesToAdd: number) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);
  date.setSeconds(seconds);

  // Formata para HH:MM:SS
  const newTime = date.toTimeString().split(" ")[0]; // Pegamos apenas a parte da hora

  return newTime;
}

export default addMinutesToTime;
