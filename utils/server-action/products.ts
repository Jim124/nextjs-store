'use server';
import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { productSchema, validateWithZodType, imageSchema } from '../schemas';
import { uploadFileToFireBase } from '../helper/uploadImagToFirebase';
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
    await db.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath('/admin/products');
    return { message: 'product removed' };
  } catch (error) {
    return renderError(error);
  }
};
