import { UserInfoType } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { getAccessToken } from '@/lib/auth/accessToken';

export const validateUser = async (): Promise<boolean> => {
  const userResponse = await getUser();
  if (userResponse) {
    return true;
  }
  return false;
};

async function getUser() {
  const userApi = ApiClientFactory.getUserApiClient();
  let userInfoResponse: UserInfoType;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return undefined;
  }

  try {
    userInfoResponse = await userApi.getUserInfo({
      headers: { Authorization: `bearer ${accessToken}` },
    });
  } catch {
    console.log('unable to validate user');
    return undefined;
  }

  return userInfoResponse;
}
