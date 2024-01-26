
export function toCamelCase(input: string): string {
  const words = input.split(' ');
  if (words.length === 1) {
    return words[0].toLowerCase();
  }
  const first = words[0].toLowerCase();
  const rest = words.slice(1);
  const camelCaseWords = [first, ...rest];
  return camelCaseWords.join('');
}

export function spaceLetters(input: string): string {
  const words = input.split('');
  return words.join(' ');
}