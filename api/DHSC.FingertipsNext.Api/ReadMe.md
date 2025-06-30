# FingertipsNext API

## Starting the Application Locally

Please ensure you have started any services and/or docker containers that you will be depending on.

Create a `.env` file based on `.env.template`, and supply any required values. Passwords and server names may need to
match those used to build associated containers/services. Please check the `.env` file in the main FingertipsNext folder.

## Sample URLs

| Path               | Sample Url                                               | Note                                         |
|--------------------|----------------------------------------------------------|----------------------------------------------|
| /scalar/v1         | http://localhost:5144/scalar/v1                          | Api documentation in development mode server |
| /indicators        | http://localhost:5144/indicators                         | Healthcare data                              |
| /areas/hierarchies | http://localhost:5144/areas/hierarchies                  | Area hierarchy types                         |
| /areas/areatypes   | http://localhost:5144/areas/areatypes?hierarchy_type=NHS | Area types                                   |
| /area/{area_code}  | http://localhost:5144/areas/355?include_children=true    | Area details                                 |
| /area/root         | http://localhost:5144/areas/root                         | Root area details                            |
| /data_management   | http://localhost:5144/data_management                    | Scaffold endpoint for data management module |

## User Authentication

Fingertips is configured with ASP.net authentication backed by entra external ID. 
In order to enable this functionality the following configuration parameters must be set within app config:

```json
    "AzureAd": {
            "Instance": "<URL for the overall instance of entra, e.g. https://fingertipsdemoentra.ciamlogin.com/",
            "TenantId": "<Tenant ID corresponding to the entra directory>",
            "ClientId": "<Client ID for the app providing the Fingertips API>"
        },
    "AdminRole": "<Fingertips Administration Group ID>"
```

Instance, TenantId and ClientId are all parameters available within the Entra External ID instance connected to.

Specifying the AdminRole role ID (a GUID) is optional allows the definition of a global administration role group. 
A user presenting a claim with membership to this group will be seen by the fingertips API as an admin user with global indicator permissions.
