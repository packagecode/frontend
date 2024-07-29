import CryptoJS from "crypto-js";

const useEncrypt = () => {
  // Function to generate a random key for encryption
  const generateKey = (length: number = 0): string => {
    if (length === 0) {
      return (
        "ABCDEFGHI" +
        new Date().toLocaleDateString("en-US") +
        "JKLMNOPQRSTUVWXYZ" +
        new Date().toLocaleDateString("en-US") +
        "0123456789" +
        new Date().toLocaleDateString("en-US") +
        "SOKRIO"
      );
    }

    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      key += charset[randomIndex];
    }
    return key;
  };

  // Encryption function
  const encryptData = (
    data: string,
    secretKey: string | null = null
  ): string => {
    try {
      if (secretKey === null) {
        secretKey = generateKey();
      }
      const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error("Error encrypting data:", error);
      return "";
    }
  };

  // Decryption function
  const decryptData = (
    encryptedData: string,
    secretKey: string | null = null
  ): string => {
    try {
      if (secretKey === null) {
        secretKey = generateKey();
      }
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      //   console.error("Error decrypting data:", error);
      return "";
    }
  };

  const storageToDecrypt = (key: string) => {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;

    const decryptedData = decryptData(encryptedData);
    return decryptedData ? JSON.parse(decryptedData) : null;
  };

  return {
    generateKey,
    encryptData,
    decryptData,
    storageToDecrypt
  };
};

export const { generateKey, encryptData, decryptData, storageToDecrypt } =
  useEncrypt();
export default useEncrypt;
