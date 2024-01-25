export const compCss = (name, func) => {
  const temp = useCssVar("--" + name);
  temp.value = computed(func).value;
  return temp;
};
