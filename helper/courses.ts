export const normalizeCourseName = (name: string) => name.trim();
export const normalizeCourseIdentity = (name: string) => name.toLowerCase().trim().replace(/\s+/g, '-');
export const normalizeSectionName = (name: string) => name.trim();
