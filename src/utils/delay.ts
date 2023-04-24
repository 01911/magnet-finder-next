const delay = (ms: Number) =>
  new Promise((resolve) => {
    setTimeout(resolve, Number(ms));
  });

export default delay;
