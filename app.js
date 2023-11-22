const API_BASE_URL = 'https://8585yx3ghc.execute-api.ap-northeast-1.amazonaws.com/dev';

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
      const response = await fetch(`${API_BASE_URL}/star`);
      const data = await response.json();

      resolve(data);
    })();
  });
};

(() => {
  const mainElement = document.querySelector('#js-main');
  
  setInterval(async () => {
    const { entities, entityIds } = await getContents();

    entityIds.forEach(async (entityId) => {
      const entity = entities[entityId];
      const { name, imageUrl, qrCodeUrl } = entity;
      const id = await sha256(imageUrl);
      const rootElement = document.querySelector(`#star-${id}`);

      // まだ画面に追加されていない星座の情報だった時
      if (!rootElement) {
        mainElement.insertAdjacentHTML(
          'afterbegin',
`
<div id="star-${id}" class="Stars">


  <div class="starImage">
  <img src="${imageUrl}" class="starImg">
  </div>

  <div class="qrImage">
  <img src="${qrCodeUrl}" class="qrImg">
  </div>

  <div class="starName">${name}座</div>
  

</div>
`
        );
      }

//       const { Key } = content;
//       const id = await sha256(Key);
//       const qrRootElement = document.querySelector(`#qr-${id}`);
//       const src = `${BASE_URL}/${Key}`;

//       if (!qrRootElement) {
//         const qrContainer = document.createElement('div');
//         qrContainer.classList.add('qr-container');

//         new QRCode(qrContainer, src);

//         mainElement.insertAdjacentHTML(
//           'afterbegin',
// `
// <a id="qr-${id}" class="qr" href="${src}">
//   <img class="qr-Img" src="${src}">
// </a>
// `
//         );

//         document
//           .querySelector(`#qr-${id}`)
//           .appendChild(qrContainer);
      //}
    });
  }, 1000 * 10);
})();