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

  // Página do pedido de namoro: /pedido
  proposal: {
    intro: {
      eyebrow: 'Para Gica, com todo o meu coração',
      title: 'Gica, posso te contar uma história?',
      subtitle: 'É curtinha. Mas é a minha favorita.',
      startLabel: 'Pode contar',
    },

    chapters: [
      {
        label: 'Capítulo I',
        title: 'O começo',
        image: 'images/foto-01.jpeg',
        text: 'Em 08 de novembro de 2025 começou a nossa história. Eu ainda não sabia, mas ali eu tinha encontrado o meu lugar favorito no mundo.',
      },
      {
        label: 'Capítulo II',
        title: 'Os dias de sol',
        image: 'images/foto-06.jpeg',
        text: 'Depois veio a praia, o sol, a areia no pé. E eu descobri que qualquer lugar fica mais bonito quando você está do meu lado.',
      },
      {
        label: 'Capítulo III',
        title: 'As aventuras',
        image: 'images/foto-12.jpeg',
        text: 'Com você, até viagem de ônibus vira aventura. As caretas, as risadas, os planos... tudo fica melhor quando é com você.',
      },
      {
        label: 'Capítulo IV',
        title: 'O que vem agora',
        image: 'images/foto-13.jpeg',
        text: 'Toda história bonita tem um momento em que o personagem cria coragem. Esse é o meu.',
      },
    ],

    stars: {
      title: 'As fuligens guardaram umas estrelinhas pra você',
      hint: 'Toque em cada konpeito',
      reasons: [
        'Porque o seu sorriso deixa qualquer dia mais leve.',
        'Porque com você eu sou eu mesmo, com careta e tudo.',
        'Porque o jeito que você cuida de mim é a coisa mais bonita que eu conheço.',
        'Porque do seu lado eu me sinto em casa.',
        'Porque eu quero viver todos os próximos capítulos com você.',
      ],
      doneLabel: 'Tem mais uma coisa...',
    },

    question: {
      text: 'Gica, você aceita namorar comigo, oficialmente?',
      yesLabel: 'Sim!',
      noLabels: [
        'Não',
        'Tem certeza?',
        'Pensa bem...',
        'As fuligens vão chorar',
        'Esse botão tá com defeito',
        'Última chance...',
      ],
      noGivesUpLabel: 'Tá bom, sim',
    },

    celebration: {
      title: 'Agora é oficial!',
      subtitle: 'Eu te amo, minha namorada.',
      sinceLabel: 'Namorados oficialmente desde',
      certificateLabel: 'Assinar nosso certificado',
    },

    certificate: {
      title: 'Certificado de Namoro Oficial',
      body: 'Por livre e espontânea vontade (e depois de fugir do botão "não"), {nameTwo} e {nameOne} declaram, sob o céu estrelado e diante das fuligens como testemunhas, que estão oficialmente namorando.',
      promise: 'Prometem cuidar um do outro, dividir o último pedaço, rir das caretas e viver juntos todos os próximos capítulos.',
      signatureOne: 'Enrique',
      signHint: 'Assine aqui com o dedo',
      clearLabel: 'Apagar',
      confirmLabel: 'Assinar',
      downloadLabel: 'Baixar certificado',
      whatsappLabel: 'Mandar minha resposta',
      // Número com DDI e DDD, só dígitos (ex.: 5511999999999). Vazio = ela escolhe o contato.
      whatsappNumber: '',
      whatsappMessage: 'SIM! Eu aceito namorar com você oficialmente ❤',
    },
  },

  // Página de 1 ano de namoro: /1ano
  anniversary: {
    intro: {
      eyebrow: '08.11.2025 — 08.11.2026',
      title: 'Um ano, Gica.',
      subtitle: 'Nesse tempo a Terra deu uma volta inteira no Sol. Vem dar essa volta comigo de novo?',
      startLabel: 'Dar a volta',
    },

    // season: spring, summer, autumn, winter ou bloom (a primavera de volta).
    // progress: onde a gente está na volta ao sol (0 = 08/11/2025, 1 = 08/11/2026).
    chapters: [
      {
        season: 'spring',
        label: 'Primavera',
        months: 'Novembro · Dezembro de 2025',
        title: 'Onde tudo começou',
        image: 'images/foto-01.jpeg',
        text: 'Era primavera quando a nossa história começou. 08 de novembro: o dia em que tudo ganhou mais cor, e eu ganhei você.',
        progress: 0.12,
      },
      {
        season: 'summer',
        label: 'Verão',
        months: 'Dezembro · Março',
        title: 'Dias de sol',
        image: 'images/foto-06.jpeg',
        text: 'Veio o verão, com praia, sol, areia no pé e a gente rindo de tudo. Descobri que qualquer lugar vira paraíso com você do lado.',
        progress: 0.37,
      },
      {
        season: 'autumn',
        label: 'Outono',
        months: 'Março · Junho',
        title: 'Noites e caretas',
        image: 'images/foto-08.jpeg',
        text: 'No outono vieram as noites longas, os rolês, as fotos tortas e as caretas. As folhas caíam e a gente só ficava mais junto.',
        progress: 0.62,
      },
      {
        season: 'winter',
        label: 'Inverno',
        months: 'Junho · Setembro',
        title: 'Nosso primeiro Dia dos Namorados',
        image: 'images/foto-02.jpeg',
        text: 'O inverno trouxe frio, cobertor e o nosso primeiro Dia dos Namorados. Até o frio ficava quentinho do seu lado.',
        progress: 0.87,
      },
      {
        season: 'bloom',
        label: 'Primavera de novo',
        months: 'Setembro · Novembro de 2026',
        title: 'A volta completa',
        image: 'images/foto-12.jpeg',
        text: 'E a primavera voltou: o seu aniversário, as nossas viagens, o pedido oficial... até chegar aqui, em mais um 08 de novembro.',
        progress: 0.97,
      },
    ],

    counter: {
      eyebrow: 'Uma volta inteira ao sol',
      title: 'Nosso primeiro ano',
      // {photos} vira o número de fotos da galeria.
      facts: [
        { value: '4', label: 'estações' },
        { value: '{photos}', label: 'fotos guardadas' },
        { value: '∞', label: 'eu te amo' },
      ],
      nextLabel: 'Mas falta uma coisa...',
    },

    cake: {
      title: 'Faz um pedido',
      hint: 'e assopra a vela',
      micLabel: 'Assoprar no microfone',
      listeningLabel: 'Pode assoprar...',
      tapHint: 'ou toque na chama',
    },

    celebration: {
      title: 'Feliz 1 ano!',
      subtitle: 'O primeiro de muitos, meu amor.',
      letterLabel: 'Tenho uma carta pra você',
    },

    letter: {
      date: '08 de novembro de 2026',
      greeting: 'Minha Gica,',
      paragraphs: [
        'Hoje faz um ano. Trezentos e sessenta e cinco dias desde aquele 08 de novembro em que a minha vida ganhou o seu nome. A Terra deu uma volta inteira no Sol, e eu passei cada pedacinho dessa volta do seu lado.',
        'Teve primavera, teve verão de praia, teve outono de noites longas e caretas, teve inverno de cobertor e o nosso primeiro Dia dos Namorados. E a primavera voltou, com o seu aniversário e o pedido oficial. Em todas as estações, o meu lugar favorito continuou o mesmo: você.',
        'Obrigado por cuidar de mim, por rir das minhas bobeiras, por me deixar ser eu mesmo e por escolher a gente todos os dias. Você deixou tudo mais leve, mais bonito e mais nosso.',
        'Se a nossa história fosse um filme do Studio Ghibli, esse seria só o fim do primeiro ato. O melhor ainda vem: mais viagens, mais praia, mais fotos tortas e mais "eu te amo" do que cabe numa vida.',
        'Feliz um ano, meu amor. Que venham todas as próximas voltas ao sol, e que eu esteja do seu lado em cada uma delas.',
      ],
      signature: 'Com todo o meu amor, Enrique',
    },

    ending: {
      title: 'Que venham todas as próximas voltas ao sol.',
      replayLabel: 'Dar a volta de novo',
      homeLabel: 'Nosso cantinho',
    },

    // Imagens para o story do Instagram: /1ano/?story=1 e /1ano/?story=2
    story: {
      eyebrow: '08.11.2025 — 08.11.2026',
      title: '1 ano',
      subtitle: 'de nós dois',
      line: '365 dias · 4 estações · 1 volta inteira ao sol',
      footer: 'Neri & Gica',
      photos: ['images/foto-13.jpeg', 'images/foto-06.jpeg', 'images/foto-11.jpeg', 'images/foto-01.jpeg'],
      nightTitle: '365 dias',
      nightSubtitle: 'e eu escolheria você em todos eles',
      nightPhoto: 'images/foto-13.jpeg',
    },
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
