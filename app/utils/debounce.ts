function debounce(func: (search: string) => void, delay: number) {
  let timerId: NodeJS.Timeout;
  return (search: string) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func(search);
    }, delay);
  };
}

export default debounce;
