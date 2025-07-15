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

### Local Authentication

Fingertips has been configured to run in a development authentication mode supported by the local jwt tokens supplied by the dotnet user-jwts command.

There are 2 preconditions to enable this when running the api:

1. The environment hasn't been configured to use an AzureAd compatible auth provider such as Entra (a matching AzureAd configuration item can't be found) as this will take precedence.
2. The api is compiled with the `DEBUG` symbol.

To setup the app for the first run, from the `DHSC.FingertipsNext.Api` directory run:

```
dotnet user-jwts create
```

This will do 3 things:
1. Configure `appsettings.Development.json` with the minimum audience and issuer values needed to validate the locally generated JWT. 
2. Add the necessary signing keys into the project secrets in order for the JWT to pass validation.
3. Output a token that can be used as a bearer token in the authorization header when calling the API endpoints.

#### Customising the token

To test authorization, the token should also include a role id to provide a scope to evaluate the user against. 
Roles are supplied at the point of generating the JWT token:

```
dotnet user-jwts create --role "<big long guid>"
```

Other parameters can be passed to this command to further customise the token including altering the expiration time and the name of the subject.
