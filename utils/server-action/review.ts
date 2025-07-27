'use server';
export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  console.log(prevState);
  console.log(formData);
  return { message: 'review submitted successfully' };
};

export const fetchProductReviews = async () => {};
export const fetchProductReviewsByUser = async () => {};
export const deleteReviewAction = async () => {};
export const findExistingReview = async () => {};
export const fetchProductRating = async () => {};
