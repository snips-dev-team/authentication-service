import CryptoAES from "crypto-js/aes";
import CryptoSHA512 from "crypto-js/sha512";
import CryptoENC from "crypto-js/enc-utf8";

export default {
  encryptPassword: (password: string) => {
    const cipherText = CryptoSHA512(password);
    return cipherText.toString();
  },
};
