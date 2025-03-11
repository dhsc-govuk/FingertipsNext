# FingertipsNext API

## Starting the Application Locally

Please ensure you have started any services and/or docker containers that you will be depending on.

Create a `.env` file based on `.env.template`, and supply any required values. Passwords and server names may need to
match those used to build associated containers/services. Please check the `.env` file in the main FingertipsNext folder.

## Sample URLs

| Path               | Sample Url                                                                   | Note                                         |
|--------------------|------------------------------------------------------------------------------|----------------------------------------------|
| /scalar/v1         | http://localhost:5144/scalar/v1                                              | Api documentation in development mode server |
| /indicators        | http://localhost:5144/indicators                                             | Healthcare data                              |
| /areas/hierarchies | http://localhost:5144/areas/hierarchies                                      | Area hierarchy types                         |
| /areas/areatypes   | http://localhost:5144/areas/areatypes?hierarchy_type=NHS                     | Area types                                   |
| /area/{area_code}  | http://localhost:5144/areas/355?include_children=true | Area details                                 |
| /area/root         | http://localhost:5144/areas/root                                             | Root area details                            |

