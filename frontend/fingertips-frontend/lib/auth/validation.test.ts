import { UserApi, UserInfoType } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { validateUser } from '@/lib/auth/validation';
import { mockDeep } from 'vitest-mock-extended';

const mockUserApi = mockDeep<UserApi>();
ApiClientFactory.getUserApiClient = () => mockUserApi;
const mockValidResponse: UserInfoType = {
  externalId: 'some externalId',
};

describe('validate user', () => {
  it('should attach the access token as a bearer authorization header to the outgoing request', async () => {
    const accessToken = 'hunter2';
    const _ = await validateUser(accessToken);

    expect(mockUserApi.getUserInfo).toHaveBeenCalledWith({
      headers: { Authorization: `bearer ${accessToken}` },
    });
  });

  it('should return true if getUser returns a non-erroneous response', async () => {
    mockUserApi.getUserInfo.mockResolvedValue(mockValidResponse);

    expect(await validateUser('123')).toBe(true);
  });

  it('should return false if the api throws an error', async () => {
    mockUserApi.getUserInfo.mockRejectedValue(new Error('some error'));

    const result = await validateUser('123');

    expect(result).toBe(false);
  });
});
