import { UserInfoType } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { addTokenToHeaders } from '@/lib/auth/headers';

export const validateAccessToken = async (): Promise<boolean> => {
  const userResponse = await getUser();
  if (userResponse) {
    return true;
  }
  return false;
};

async function getUser() {
  const userApi = ApiClientFactory.getUserApiClient();
  let userInfoResponse: UserInfoType;

  try {
    userInfoResponse = await userApi.getUserInfo({
      headers: await addTokenToHeaders(),
    });
  } catch {
    console.log('unable to validate user');
    return undefined;
  }

  return userInfoResponse;
}
