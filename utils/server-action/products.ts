'use server';
import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { productSchema, validateWithZodType, imageSchema } from '../schemas';
import {
  deleteFileFromFireBase,
  uploadFileToFireBase,
} from '../helper/uploadImagToFirebase';
import { revalidatePath } from 'next/cache';
import { getAuthUser, getAdminUser } from '../helper/clerkAuth';
import { renderError } from '../helper/commonError';
export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File;
    const validatedFields = validateWithZodType(productSchema, rawData);
    const validatedFile = validateWithZodType(imageSchema, { image: file });
    const fullPath = (await uploadFileToFireBase(
      validatedFile.image
    )) as string;
    await db.product.create({
      data: {
        ...validatedFields,
        image: fullPath,
        clerkId: user.id,
      },
    });
    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    // return { message: 'product created' };
  } catch (error) {
    return renderError(error);
  }
  redirect('/admin/products');
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteFileFromFireBase(product.image);
    revalidatePath('/admin/products');
    return { message: 'product removed' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const productId = formData.get('id') as string;
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodType(productSchema, rawData);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: 'Product updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};
export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAuthUser();
  try {
    const image = formData.get('image') as File;
    const productId = formData.get('id') as string;
    const oldImageUrl = formData.get('url') as string;

    const validatedFile = validateWithZodType(imageSchema, { image });
    const fullPath = (await uploadFileToFireBase(
      validatedFile.image
    )) as string;
    await deleteFileFromFireBase(oldImageUrl);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: 'Product Image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};
