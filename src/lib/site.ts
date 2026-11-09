export const href = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
export const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const readingTime = (body: string = '') => Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220));
