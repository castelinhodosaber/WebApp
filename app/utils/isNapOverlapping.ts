import { Nap } from "../types/api/castelinho";

function isNapOverlapping(
  newNap: { startedAt: string; finishAt: string },
  nap: Nap
): boolean {
  // Converte o `startedAt` e `finishAt` de `newNap` para minutos
  const [newStartHour, newStartMinute] = newNap.startedAt
    .split(":")
    .map(Number);
  const [newFinishHour, newFinishMinute] = newNap.finishAt
    .split(":")
    .map(Number);

  const newStartTime = newStartHour * 60 + newStartMinute;
  const newFinishTime = newFinishHour * 60 + newFinishMinute;

  // Converte o `startedAt` e a duração de `nap` para minutos
  const [napStartHour, napStartMinute] = nap.hour.split(":").map(Number);
  const napStartTime = napStartHour * 60 + napStartMinute;
  const napFinishTime = napStartTime + nap.napTimeMinutes;

  // Verifica se há sobreposição
  return (
    (newStartTime >= napStartTime && newStartTime < napFinishTime) || // Novo nap começa dentro do existente
    (newFinishTime > napStartTime && newFinishTime <= napFinishTime) || // Novo nap termina dentro do existente
    (newStartTime <= napStartTime && newFinishTime >= napFinishTime) // Novo nap engloba o existente
  );
}

export default isNapOverlapping;
