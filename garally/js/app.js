const BASE_URL = 'https://www.air-canvas.ml';

/**
 * sha256
 */
const sha256 = async (str) => {
  const uint8 = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', uint8);

  return Array.from(new Uint8Array(digest))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * getContents
 */
const getContents = () => {
  return new Promise((resolve) => {
    (async () => {
      const response = await fetch('https://igvtijkfm65uglxdjc4axa6unq0fdnup.lambda-url.ap-northeast-1.on.aws/');
      const data = await response.json();

      resolve(data.contents);
    })();
  });
};

(() => {
  const mainElement = document.querySelector('#js-main');
  
  setInterval(async () => {
    const contents = await getContents();

    contents.forEach(async (content) => {
      const { Key } = content;
      const id = await sha256(Key);
      const qrRootElement = document.querySelector(`#qr-${id}`);
      const src = `${BASE_URL}/${Key}`;

      if (!qrRootElement) {
        const qrContainer = document.createElement('div');
        qrContainer.classList.add('qr-container');

        new QRCode(qrContainer, src);

        mainElement.insertAdjacentHTML(
          'afterbegin',
`
<a id="qr-${id}" class="qr" href="${src}">
  <img class="qr-Img" src="${src}">
</a>
`
        );

        document
          .querySelector(`#qr-${id}`)
          .appendChild(qrContainer);
      }
    });
  }, 1000 * 10);
})();