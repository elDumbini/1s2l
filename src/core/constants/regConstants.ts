export const websiteUrlRegex =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const isUrlValid = (url: string) => {
  return websiteUrlRegex.test(url);
};
