import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from '../firebase';
import { renderError } from './commonError';

export const uploadFileToFireBase = async (file: any) => {
  try {
    const storage = getStorage(app);
    const fileRef = ref(storage, file.name);
    const uploadedFileResponse = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(uploadedFileResponse.ref);
    return url;
  } catch (error) {
    return renderError(error);
  }
};

export const deleteFileFromFireBase = async (url: string) => {
  try {
    const storage = getStorage(app);
    const desertRef = ref(storage, url);
    await deleteObject(desertRef);
  } catch (error) {
    return renderError(error);
  }
};
