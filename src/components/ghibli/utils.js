// Número "aleatório" fixo por semente, para a cena ser sempre igual entre renders.
export const seeded = (seed) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

export const konpeitoColors = ['#ff9fb8', '#ffe27a', '#9fe0b4', '#9cc9ff', '#ffc38a'];
