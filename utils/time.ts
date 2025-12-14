export const formatTime = (isoString: string | null): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' });
};

export const getDelayString = (delay: number | null): string | null => {
  if (delay === null || delay === 0) return null;
  return `+${delay}'`;
};

export const isFuture = (isoString: string | null): boolean => {
  if (!isoString) return false;
  return new Date(isoString).getTime() > Date.now();
};

export const getMinutesUntil = (isoString: string | null): number => {
  if (!isoString) return 0;
  const target = new Date(isoString);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.floor(diffMs / 60000);
};
