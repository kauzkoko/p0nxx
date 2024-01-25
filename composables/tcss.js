export const tcss = (name, value) => {
  let temp = $(useCssVar("--" + name));
  temp = value;
  console.log(temp);
  return temp;
};
