import QRCode from 'qrcode';

const censorWord = (str) => {
  const repeatLength = str.length >= 5 ? 3 : str.length - 2;
  return str[0] + '*'.repeat(repeatLength) + str.slice(-1);
};

export const censorEmail = (email) => {
  if (!email) return '';
  const arr = email.split('@');
  return `${censorWord(arr[0])}@${censorWord(arr[1])}`;
};

// eslint-disable-next-line consistent-return
export const generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.log(err);
  }
};
