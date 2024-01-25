export const css = (name, value) => {
  const temp = useCssVar("--" + name);
  temp.value = value;
  return temp;
};
