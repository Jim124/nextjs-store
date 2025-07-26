import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import { renderError } from '../actions';

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
