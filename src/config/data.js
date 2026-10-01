const imageModules = import.meta.glob('../assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const audioModules = import.meta.glob('../assets/audio/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const videoModules = import.meta.glob('../assets/videos/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const resolveAsset = (modules, path) => {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;

  const fileName = path.split('/').pop();
  const match = Object.entries(modules).find(([modulePath]) =>
    modulePath.endsWith(`/${fileName}`),
  );

  return match?.[1] ?? '';
};

export const siteData = {
  couple: {
    nameOne: 'Neri',
    nameTwo: 'Gica',
    displayName: 'Feliz aniversário, Gica!',
    relationshipStart: '2025-11-08T00:00:00-03:00',
  },

  birthday: {
    enabled: true,
    date: '01 de outubro',
    greeting: 'Hoje o mundo ficou mais bonito',
    title: 'Feliz aniversário, Gica',
    subtitle:
      'Era uma vez, num dia de outubro, nasceu a pessoa que ia virar o meu lugar favorito no mundo.',
    openLabel: 'Abrir sua carta',
    enterLabel: 'Entrar no nosso cantinho',
    loveNotes: [
      'Eu te amo.',
      'Eu te amo hoje.',
      'Eu te amo amanhã.',
      'Eu te amo em todos os dias que ainda vão existir.',
    ],
    polaroids: [
      'images/foto-06.jpeg',
      'images/foto-12.jpeg',
      'images/foto-13.jpeg',
    ],
    letter: {
      greeting: 'Minha Gica,',
      paragraphs: [
        'Feliz aniversário, meu amor! Hoje é o dia em que o mundo ganhou você, e eu ainda não sei como agradecer por ter tido a sorte de te encontrar no meio de tanta gente.',
        'Sabe aqueles filmes do Studio Ghibli, onde tudo é calmo, o céu é enorme e até o vento parece ter carinho? É assim que eu me sinto do seu lado. Com você, até os dias comuns viram cena bonita: a praia, a viagem de ônibus, as caretas, as máscaras nos olhos, os beijos roubados.',
        'Em A Viagem de Chihiro dizem que nada do que acontece é esquecido, mesmo que a gente não consiga lembrar. Eu acredito nisso, porque cada momento com você fica guardado aqui dentro, até os que parecem pequenos.',
        'Eu te amo pelo seu jeito de cuidar, pelo seu sorriso, pela sua risada e por ser a minha casa. Que esse novo ano seja leve como uma tarde de verão, cheio de aventura e de tudo o que você sonha. E que eu esteja do seu lado em cada pedacinho dele.',
        'Nunca esqueça: eu te amo. Hoje, amanhã e em todos os dias que ainda vão existir.',
      ],
      signature: 'Com todo o meu amor, Enrique',
    },
  },

  hero: {
    namesLabel: 'Neri e Gica ❤',
    title: 'Feliz aniversário, Gica!',
    subtitle: 'Um cantinho feito para guardar o que a gente sente, e lembrar que eu te amo em cada detalhe.',
    ctaLabel: 'Entrar na nossa história',
    featuredImage: 'images/foto-06.jpeg',
  },

  timer: {
    eyebrow: 'Desde o primeiro sim',
    title: 'Nosso tempo juntinhos',
    description: 'Cada segundo vira memória quando a vida acontece lado a lado.',
  },

  gallery: {
    title: 'Nossos momentos',
    description: 'Fotos que contam, em silêncio, as partes mais bonitas da nossa história.',
    images: [
      'images/foto-01.jpeg',
      'images/foto-02.jpeg',
      'images/foto-03.jpeg',
      'images/foto-04.jpeg',
      'images/foto-05.jpeg',
      'images/foto-06.jpeg',
      'images/foto-07.jpeg',
      'images/foto-08.jpeg',
      'images/foto-09.jpeg',
      'images/foto-10.jpeg',
      'images/foto-11.jpeg',
      'images/foto-12.jpeg',
      'images/foto-13.jpeg',
    ],
    videos: [
      'videos/video-01.mp4',
    ],
  },

  letter: {
    eyebrow: 'Para ler com calma',
    title: 'Uma carta para você',
    signature: 'Com amor, Enrique',
    recipient: 'Para, Gica',
    paragraphs: [
      'Feliz aniversário, meu amor!',
      'Gica, o jeito que você cuida de mim é a luz dos meus dias. Quero que você saiba que toda vez que eu te olho, eu me sinto o homem mais sortudo do mundo.',
      'Obrigado por tudo o que somos e por cada momento ao seu lado. Te amo demais!',
    ],
  },

  music: {
    title: 'Nossa música',
    artist: 'Neri e Gica',
    autoplay: false,
    deezerUrl: '',
    file: 'audio/nossa-musica.mp3',
  },
};

export const getImageUrl = (path) => resolveAsset(imageModules, path);
export const getAudioUrl = (path) => resolveAsset(audioModules, path);
export const getVideoUrl = (path) => resolveAsset(videoModules, path);

export default siteData;
