'use strict';

const crypto = require('crypto');
const {
  S3Client,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const Ajv = require('ajv');
const QRCode = require('qrcode');

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
const ajv = new Ajv();

// 検証スキーマを定義
const schema = {
  properties: {
    name: {
      pattern: '^[\\u3040-\\u309F\\u30FC]+$',
      type: 'string',
    },
    image: {
      pattern: '^data:image\\/(jpeg|png);base64,[A-Za-z0-9+/=]+$',
      type: 'string',
    },
  },
  required: ['name', 'image'],
  type: 'object',
};

// バリデーション関数を作成
const validate = ajv.compile(schema);
// base64 にマッチする正規表現
const base64RegExp = /^data:(.+\/(.+));base64,(.*)$/;

/**
 * putObject
 */
const putObject = (body, contentType, key) => {
  return s3Client.send(new PutObjectCommand({
    Body: body,
    Bucket: process.env.S3_BUCKET,
    ContentType: contentType,
    Key: key,
  }));
};

/**
 * hiraganaToRomaji 
 */
const hiraganaToRomaji = (hiragana) => {
  const conversionTable = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'ぁ': 'xa', 'ぃ': 'xi', 'ぅ': 'xu', 'ぇ': 'xe', 'ぉ': 'xo',
    'っ': 'xtu', 'ゃ': 'xya', 'ゅ': 'xyu', 'ょ': 'xyo',
    'ー': '_',
  };
    
  return hiragana.split('').map(char => conversionTable[char] || char).join('-');
};

/**
 * putQRCode
 */
const putQRCode = (url, fileName) => {
  return new Promise((resolve, reject) => {
    const options = {
      errorCorrectionLevel: 'M',
      margin: 1,
      type: 'png',
      width: 512,
    };

    QRCode.toDataURL(url, options, async (error, url) => {
      if (error) {
        reject(error);
        return;
      }

      const [_, contentType, extension, base64String] = url.match(base64RegExp);
      // 画像が保存されるパス
      const key = `${fileName}.${extension}`;
      // リクエストボディに設定された画像データはBase64エンコードされているので、デコードする
      const body = Buffer.from(base64String, 'base64');

      await putObject(body, contentType, key);

      resolve(
        `https://${process.env.S3_BUCKET}.s3.${process.env.REGION}.amazonaws.com/${key}`
      );
    });
  });
};

module.exports.create = async (event) => {
  const origin = event.headers.origin;
  const prefix = crypto.randomUUID();
  const { name, image } = JSON.parse(event.body);
  const valid = validate(JSON.parse(event.body));
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = true;
  }

  try {
    // クライアントから送られた値にバリデーションエラーがあればエラーを返して終了
    if (!valid) {
      throw validate.errors;
    }

    const [_, contentType, extension, base64String] = image.match(base64RegExp);
    // 画像が保存されるパス
    const fileName = `${prefix}___${hiraganaToRomaji(name)}`;
    const qrFileName = `qr-${fileName}`;
    const key = `${fileName}.${extension}`;
    // リクエストボディに設定された画像データはBase64エンコードされているので、デコードする
    const body = Buffer.from(base64String, 'base64');
    const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.REGION}.amazonaws.com/${key}`;
    const qrCodeUrl = await putQRCode(imageUrl, qrFileName);

    await putObject(body, contentType, key);

    return {
      statusCode: 200,
      body: JSON.stringify({
        name,
        status: 'OK',
        imageUrl,
        qrCodeUrl,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'ERROR',
        error,
      }),
      headers,
    };
  }
};
