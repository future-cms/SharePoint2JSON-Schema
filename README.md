# Sharepoint XML schema to JSON Schema 

## Purpose
This is a demo API server listens incoming traffic from a SPfx plugin that sends Sharepoint Modern Page structure on publish.
When API gets a new SP Page it converts XML schema to JSON Schema that can be used in Future CMS React Front-End.

### Initial Setup
Rename setups/default.config.js to config.js and make changes according to your Future CMS React Front-End installation.

# Swagger generated server

## Overview
This server was generated by the [swagger-codegen](https://github.com/swagger-api/swagger-codegen) project.  By using the [OpenAPI-Spec](https://github.com/OAI/OpenAPI-Specification) from a remote server, you can easily generate a server stub.

### Running the server
To run the server, run:

```
npm start
```

To view the Swagger UI interface:

```
open http://localhost:8080/docs
```

This project leverages the mega-awesome [swagger-tools](https://github.com/apigee-127/swagger-tools) middleware which does most all the work.
