import forge from 'node-forge';

const extractPubKey = (rsaPubKey: string): Record<string, string> => {
  const rsa_n = rsaPubKey.substring(rsaPubKey.indexOf('data:') + 7, rsaPubKey.indexOf('},') - 2);
  const rsa_e = rsaPubKey.substring(rsaPubKey.lastIndexOf('data:') + 7, rsaPubKey.lastIndexOf(']'));

  const resultKey = {
    rsa_n: rsa_n,
    rsa_e: rsa_e,
  };
  console.log('formatPubKey resultKey', resultKey);

  return resultKey;
};

export const rsaEncrypt = async (param: string, rsaPubKey: string) => {
  const resultKey = extractPubKey(rsaPubKey);
  const rsa_n = resultKey['rsa_n'];
  const rsa_e = resultKey['rsa_e'];
  const kk = rsa_n
    .split(', ')
    .map((x, i) => BigInt(2) ** BigInt(i * 64) * BigInt(x))
    .reduce((acc, x) => acc + x)
    .toString();
  const k = forge.pki.setRsaPublicKey(
    new forge.jsbn.BigInteger(kk),
    new forge.jsbn.BigInteger(rsa_e),
  );
  const m = forge.pki.rsa.encrypt(param, k, 0x02);
  let y = [];
  for (let i = 0; i < m.length; i++) {
    y.push(m[i].charCodeAt(0));
  }
  const res = Buffer.from(y).toString('base64');
  console.log(res);

  return res;
};