'use server';
// import db from '@/utils/db';

export const createOrderAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  console.log(prevState);
  console.log(formData);
  return { message: 'create order successfully' };
};
