export const twMerge = (
  ...props: (string | false | null | 0 | undefined)[]
) => {
  const filtered = props.filter((c) => !!c);
  return filtered.join(" ");
};
