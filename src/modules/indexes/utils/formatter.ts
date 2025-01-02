export const formatArrayToText = (text: string[]) => {
  return text.join(' ').replace(/<em>|<\/em>|\n/g, '');
};
