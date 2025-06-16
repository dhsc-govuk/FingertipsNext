using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using Azure;
using Azure.Storage.Blobs;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class DataUploadService(BlobServiceClient blobServiceClient, HttpClient httpClient, IValidationService validationService) : IDataUploadService
{
    public async Task<ServiceResponse<bool>> UploadWithSdkAsync(Stream fileStream, string fileName, string containerName)
    {
        if (!validationService.IsValid(fileStream))
            return new ServiceResponse<bool> { Status = ResponseStatus.InvalidCsv, Content = false };

        // Reading the contents of the uploaded file 
        using var sr = new StreamReader(fileStream);
        var content = await sr.ReadToEndAsync();
        Console.WriteLine(content);
        fileStream.Position = 0;
        
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        try
        {
            await blobClient.UploadAsync(fileStream, true);
        }
        catch (RequestFailedException _)
        {
            return new ServiceResponse<bool> { Status = ResponseStatus.Unknown, Content = false };
        }
        
        return new  ServiceResponse<bool> { Status = ResponseStatus.Success, Content = true };
    }

    public async Task<ServiceResponse<bool>> UploadWithRestAsync(Stream fileStream, string storageAccountName, string containerName, string fileName, string storageAccountKey)
    {
        if (!validationService.IsValid(fileStream))
            return new ServiceResponse<bool> { Status = ResponseStatus.InvalidCsv, Content = false };
        
        var stringWithoutHeaders = $"PUT\n" +
                           $"\n" +
                           $"\n" +
                           $"{fileStream.Length}\n" +
                           $"\n" +
                           $"\n" +
                           $"\n" +
                           $"\n" +
                           $"\n" +
                           $"\n";
        
        var canonicalizedHeaders = $"x-ms-blob-type:BlockBlob\n" +
                                            $"x-ms-date: {DateTime.UtcNow:R}\n" +
                                            $"x-ms-version: 2021-12-02\n";
        var canonicalizedResource = $"/{storageAccountName}/{containerName}/{fileName}";
        var stringToSign = string.Join("\n", stringWithoutHeaders, canonicalizedHeaders + canonicalizedResource);
        
        var keyBytes = Convert.FromBase64String(storageAccountKey);
        using var hmacSha256 = new HMACSHA256(keyBytes);
        var dataToHmac = Encoding.UTF8.GetBytes(stringToSign);
        var signature = Convert.ToBase64String(hmacSha256.ComputeHash(dataToHmac));
        
        try
        {
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("SharedKey", $"{storageAccountName}:{signature}");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Length", $"{fileStream.Length}");
            using var streamContent = new StreamContent(fileStream);
            var response = await httpClient.PutAsync(httpClient.BaseAddress, streamContent);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception exception) when (exception is HttpRequestException)
        {
            return new ServiceResponse<bool> { Status = ResponseStatus.Unknown, Content = false };
        }
        
        return new  ServiceResponse<bool> { Status = ResponseStatus.Success, Content = true };
    }
}