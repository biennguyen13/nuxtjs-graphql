export default defineNuxtPlugin(() => {
  return {
    provide: {
      goto: (path: string) => window.open(path),
    },
  };
});
