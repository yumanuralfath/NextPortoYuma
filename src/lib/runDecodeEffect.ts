export const runDecodeEffect = (
  el: HTMLElement,
  finalText: string,
  speed = 80
) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";
  let iterations = 0;

  el.classList.add("cyber-flicker");

  const interval = setInterval(() => {
    const text = finalText
      .split("")
      .map((char, i) => {
        if (i < iterations) return finalText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    el.textContent = text;

    if (iterations >= finalText.length) {
      clearInterval(interval);
      el.classList.remove("cyber-flicker");
      el.textContent = finalText;
    }

    iterations += 1 / 3;
  }, speed);
};
