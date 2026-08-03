const STORAGE_KEY = 'expandedTrainingCards';

export function getExpandedIds(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveExpandedIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function toggleExpandedId(id: number) {
  const ids = getExpandedIds();
  const index = ids.indexOf(id);
  if (index === -1) {
    ids.push(id);
  } else {
    ids.splice(index, 1);
  }
  saveExpandedIds(ids);
  return ids.includes(id); // retorna o novo estado (aberto ou fechado)
}