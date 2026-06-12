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
    displayName: 'Feliz Dia dos Namorados!',
    relationshipStart: '2025-11-08T00:00:00-03:00',
  },

  hero: {
    namesLabel: 'Neri e Gica ❤',
    title: 'Feliz Dia dos Namorados!',
    subtitle: 'Um cantinho feito para guardar o que a gente sente.',
    ctaLabel: 'Entrar na nossa história',
    featuredImage: 'images/foto-01.jpeg',
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
      'Feliz Dia dos Namorados, meu amor!',
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
