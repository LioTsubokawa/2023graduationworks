'use strict';

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const ALLOWED_ORIGINS = ['http://localhost:5500'];

const s3ClientConfig = {};

if (process.env.IS_OFFLINE) {
  s3ClientConfig.forcePathStyle = true;
  s3ClientConfig.credentials = {
    accessKeyId: 'S3RVER', // This specific key is required when working offline
    secretAccessKey: 'S3RVER',
  };
  s3ClientConfig.endpoint = 'http://localhost:4569';
}

const s3Client = new S3Client(s3ClientConfig);

/**
 * romajiToHiragana 
 */
const romajiToHiragana = (romaji) => {
  const conversionTable = {
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を', 'nn': 'ん',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
    'xa': 'ぁ', 'xi': 'ぃ', 'xu': 'ぅ', 'xe': 'ぇ', 'xo': 'ぉ',
    'xtu': 'っ', 'xya': 'ゃ', 'xyu': 'ゅ', 'xyo': 'ょ',
    '_': 'ー',
  };
    
  return romaji.split('-').map(segment => {
    return segment.split('').reduce((acc, char, index, arr) => {
      const potentialRomaji = acc.remaining + char;
      const hiragana = conversionTable[potentialRomaji];

      if (hiragana) {
        return { result: acc.result + hiragana, remaining: '' };
      } else if (index === arr.length - 1) {
        return { result: acc.result + acc.remaining + char, remaining: '' };
      } else {
        return { ...acc, remaining: potentialRomaji };
       }
    }, { result: '', remaining: '' }).result;
  }).join('');
};

module.exports.list = async (event) => {
  const origin = event.headers.origin;
  const entities = {};
  const entityIds = [];
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = true;
  }

  try {
    const output = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        // Prefix: 'sketches/',
        Delimiter: '/',
        MaxKeys: 1000,
      })
    );

    if (output.hasOwnProperty('Contents')) {
      output.Contents.sort((a, b) => a.LastModified - b.LastModified);

      output.Contents.forEach(({ Key }) => {
        const entityId = Key.split('___')[0].replace('qr-', '');

        if (!entityIds.includes(entityId)) {
          entityIds.push(entityId);
        }
      });

      output.Contents.reduce((acc, { Key }) => {
        const isRrCode = Key.includes('qr-');
        const entityId = Key.split('___')[0].replace('qr-', '');
        const url = `https://${process.env.S3_BUCKET}.s3.${process.env.REGION}.amazonaws.com/${Key}`;

        if (!acc.hasOwnProperty(entityId)) {
          acc[entityId] = {};
        }

        if (isRrCode) {
          acc[entityId].qrCodeUrl = url;
        } else {
          const name = romajiToHiragana(Key.split('___')[1].split('.')[0]);
          acc[entityId].name = name;
          acc[entityId].imageUrl = url;
        }

        return acc;
      }, entities);
    }

    return {
      body: JSON.stringify({
        status: 'OK',
        entities,
        entityIds,
      }),
      headers,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      body: JSON.stringify({ error }),
      headers,
      statusCode: 400,
    };
  }
};
