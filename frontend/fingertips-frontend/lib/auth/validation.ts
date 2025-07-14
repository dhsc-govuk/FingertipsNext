import { UserInfoType } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

export const validateAccessToken = async (
  accessToken: string
): Promise<boolean> => {
  const userResponse = await getUser(accessToken);
  if (userResponse) {
    return true;
  }
  return false;
};

async function getUser(accessToken: string) {
  const userApi = ApiClientFactory.getUserApiClient();
  let userInfoResponse: UserInfoType;

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
