export function formatExamples(examples: string[]): string[] {
  return examples.map((example, index) => {
    const suffix = index !== examples.length - 1 ? '\n' : '';
    return example.trim() + suffix;
  });
}
