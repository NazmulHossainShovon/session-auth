import apiClient from '../ApiClient';

export const uploadToS3 = async (file: File, userName: string) => {
  const { data } = await apiClient.get(
    `/api/s3/signed-url?contentType=${file.type}&userName=${userName}`
  );

  const { uploadUrl, imageUrl } = data;

  await apiClient.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  return imageUrl;
};
