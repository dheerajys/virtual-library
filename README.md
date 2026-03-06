# spa-template

## Requirements
- NodeJS v20.12.2 or higher
- npm v8.1.0 or higher

## Introduction
The purpose of this project is to improve a developer experience and speed up a new SPA project setup that makes the SPA projects consistent across the organization.

### Features
The project has the following dependencies and features: 
- [PVS Design System](https://intpcx-pvsdesignsystem.v3nonprod.connexus.com) components
- A separate component `ThemeProvider` was created for convenient work and reuse of the PVS style theme and settings in the application UI tests.
- [React router](https://reactrouter.com/en/main/start/tutorial) is used to create SPA with client-side routing. The template contains example of routing with two pages, one for adding an example email and the other for listing them.
- [Formik](https://formik.org/docs/overview) library is used to validate the form.
- All network requests work with the [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) tool from `@reduxjs/toolkit` paired with the Redux store. The template contains sample API service layer using [RTK Query](https://redux-toolkit.js.org/rtk-query/overview). API service layer is present in the `api` folder.
- All network request to an API are mocked using [miragejs](https://miragejs.com/docs/getting-started/introduction/).
- Testing of UI components is carried out with the help of `vitest` and `@testing-library/react`. The examples of the snapshot tests are also included into the project, they are optional and can be removed once the repository has been cloned.

Template allows to use absolute paths for module imports. `src` folder is a base url. `vite.config.ts` file contains aliases for all child folders.

## Getting Started
1. Download the [repository](https://dev.azure.com/connectionseducation/EnterpriseSoftwarePortfolio/_git/spa-template) as zip.
2. Extract zip archive in created repository for new project.
3. Run `npm i -g vsts-npm-auth`.
4. Run `vsts-npm-auth -config .npmrc` in the same directory where the `.npmrc` file is located.
5. Use your Connection Academy credentials to login into ADO if an authorization pop-up appears while installing dependencies. This is necessary to install the `pvs-design-system` package.
6. Run `npm ci`.
7. Remove existing `azure-pipeline.yml`.
8. Rename `azure-pipeline-web.yml` to `azure-pipeline.yml`.
9. Fill `azure-pipeline.yml` template parameters according to your application settings.
10. Replace the content in Readme.md according to your current project.
11. Run `npm run dev`.
12. Run `npm run storybook` if you have to work with the component library.

<details>
<summary>Integration in Connexus</summary>

For Connexus integration you can use ~areas/SpaBase MVC page as a base. See ~areas/SpaBase/README.md for details.
</details>

<details>
<summary>If this SPA is not intended for use as part of Connexus</summary>

then you may consider removing the following features:

1. Generation of the manifest.json file during project build.
1. Setting the Vite output build format to 'iife'.
1. Overriding the manifest.json file in the development environment (this is done by the publicDir parameter in vite.config.ts and the /src/assets/manifest.json file).
</details>

## Troubleshooting
- Follow the steps below if there is an error `code E401` while trying to pull the project dependencies/libraries from Nuget source:
  1. Remove the `.npmrc` file from the system. In Windows OS, usually it is located in `%USERPROFILE%`
  2. Install vsts-npm-auth package globally by running `npm i -g vsts-npm-auth`
  3. Run `npx vsts-npm-auth -config .npmrc`

## Useful Links
- [Stack overview and reasoning](https://one-confluence.pearson.com/display/OBL/Stack+overview+and+reasoning)
- [Frontend applications and web-connexus integration proposal](https://one-confluence.pearson.com/pages/viewpage.action?pageId=320836465)
- [Front-end React/JSX Style Guide (Code Standards)](https://one-confluence.pearson.com/pages/viewpage.action?pageId=415763817)
- [How to get an Azure Artifacts token and install pvs-design-system package](https://connectionseducation.visualstudio.com/EnterpriseSoftwarePortfolio/_artifacts/feed/ConnectionsEducationNpm/connect/npm)
