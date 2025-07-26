'use server';
import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { productSchema, validateWithZodType, imageSchema } from './schemas';
import { uploadFileToFireBase } from './helper/uploadImagToFirebase';
import { revalidatePath } from 'next/cache';

export const renderError = (error: unknown): { message: string } => {
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  return user;
};
export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = ({ search = '' }: { search: string }) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    redirect('/products');
  }
  return product;
};

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
    console.log(validatedFile);
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
    // return { message: 'product created' };
  } catch (error) {
    return renderError(error);
  }
  redirect('/products');
};
