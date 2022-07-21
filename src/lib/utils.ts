import { onDestroy } from "svelte";

// https://stackoverflow.com/a/72061876
export function toSpaceCase(str) {
  return (
    str
      .replace(/[-_]/g, " ")
      /*
       * insert a space between lower & upper
       * HttpRequest => Http Request
       */
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      /*
       * space before last upper in a sequence followed by lower
       * XMLHttp => XML Http
       */
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
      // uppercase the first character
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/\s+/g, " ")
      .trim()
  );
}

// Function that yields numbers from a to b
// eg range(1, 5) => yields 1, 2, 3, 4, 5
//    range(5, -4) => yields 5, 4, 3, 2, 1, 0, -1, -2, -3, -4
export function* generateRange(a, b) {
  if (a < b) {
    for (let i = a; i <= b; i++) {
      yield i;
    }
  } else {
    for (let i = a; i >= b; i--) {
      yield i;
    }
  }
}

export function range(a, b) {
  return Array.from(generateRange(a, b));
}

export function onInterval(callback, milliseconds) {
  const interval = setInterval(callback, milliseconds);

  onDestroy(() => {
    clearInterval(interval);
  });
}
