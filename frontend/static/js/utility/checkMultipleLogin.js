import { getMultipleLogin } from '../api/getAPI';

export const checkMultipleLogin = async () => {
  const data = await getMultipleLogin();
  return data.is_multiple;
};
