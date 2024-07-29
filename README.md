# Sokrio Client - React + TypeScript + Vite

This project is built using React with TypeScript and Vite with HMR and ESLint rules.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Expanding the ESLint configuration](#expanding-the-eslint-configuration)
- [Technologies Used](#technologies-used)
- [Custom Components](#custom-components)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (version >= 22.2.0) or latest
- npm (version >= 10.7.0) or yarn (version >= 1.22.22)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/sokrio/sokrio-app-frontend.git
   ```

2. Enter the project directory

   ```
   cd sokrio-app-frontend
   ```

3. Copy .env.example to .env.local or Rename the .env.example file to .env.local

> #### Add below variables properly
>
> > - `VITE_APP_API_ENDPOINT` this is the backend client's API endpoint.\
> >   Example : `VITE_APP_API_ENDPOINT=http://variable-api.sokrio-server.test/v1` here the word `variable` is unchangeable. This will internally be replaced by the client username.\
> >   But it can be modified for production like . `VITE_APP_API_ENDPOINT=https://variable-api.sokrio.com/v1`
>
> > - `VITE_APP_LANDLORD_API_ENDPOINT` this is the backend base API endpoint.\
> >   Example : `VITE_APP_LANDLORD_API_ENDPOINT=http://base-api.sokrio-server.test/v1`\
> >   This can be modified for production like . `VITE_APP_LANDLORD_API_ENDPOINT=https://base-api.sokrio.com/v1`
>
> > - `VITE_API_BASE_URL` this is the font-end base-app url\
> >   Example: `VITE_API_BASE_URL=http://app.sokrio-server.test:8080` here the port number is very important. When you run `yarn serve`, node starts to listen to a specific port. So use that port instead of `8080`. Though it's usually run the server in port `8080`, just a heads up.\
> >   This can be modified for production like . `VITE_API_BASE_URL=https://app.sokrio.com`
>
> > **Note :** The **back-end** and **front-end** both's Top-Levels-Domain(TLD) must be same to work the application correctly. But sub-domain and port can be different.  
> > So, you can't use `http://app.sokrio-client.test` as front-end and `http://base-api.sokrio-server.test` as back-end. Because the TLD `*.sokrio-client.test` and `*.sokrio-server.test` are different.

## Development

### Install dependencies

```
yarn install
```

### Compiles and hot-reloads for development - This command starts the Vite development server. Open http://{tenant}.appname.test:3000 to view it in the browser.

```
yarn dev
```

## Compiles and fixed eslint

```
yarn lint
```

## Building for Production

### Compiles and minifies for production

```
yarn build
```

## Project Structure

Below is a basic outline of the project's main components:

## Source Files

- `scr`:
  - `assets` : This directory contains all the project assets file including css,js,json,image,video etc
  - `components` : This directory contains all the React components that are used throughout the application
  - `container` : This directory contains all the UI components that are used throughout the application
  - `contexts` : This directory contains all the React contexts used throughout the application. Contexts provide a way to pass data through the component tree without having to pass props down manually at every level.
  - `enums` : This directory contains all the Enums, are a way to define a set of named values
  - `hooks` : This directory contains all the React Custom Hooks used throughout the applicationn.
  - `interfaces` : This directory contains all the TypeScript interfaces used throughout the application. Interfaces are used to type-check our objects and function parameters/return values.
  - `pages`: Application pages
  - `redux`: This directory contains all the React Custom Action used throughout the application.
  - `routes`: Application pages
- `App.tsx`: Main application component
- `main.tsx`: Entry point
- `/public`: This directory contains all the static files that the application needs to run, like the `index.html` file and images.
- `.eslintrc`: This file contains the rules for ESLint, which is used to lint and format the code.
- `.gitignore`: This file tells git which files it should not track or maintain a version history for.
- `package.json`: This file contains the list of project dependencies and scripts.
- `tsconfig.json`: This file contains the configuration for the TypeScript compiler.
- `README.md`: This file contains information about the project and instructions on how to run and build the application.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname
  }
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` lis

## Technologies Used

- [React](https://react.dev/) A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) Adds static types to JavaScript to improve developer productivity and code quality.
- [Vite](https://vitejs.dev/): A fast frontend build tool that provides a streamlined development experience.
- [React Bootstrap](https://react-bootstrap.netlify.app/) The most popular front-end framework, rebuilt for React.
- [Chart.js](https://www.chartjs.org/) Simple yet flexible JavaScript charting library for the modern web
- [Sweetalert](https://sweetalert2.github.io/) A BEAUTIFUL, RESPONSIVE, CUSTOMIZABLE, ACCESSIBLE (WAI-ARIA) REPLACEMENT FOR JAVASCRIPT'S POPUP BOXES

## Custom Components

```
import { BaseCheckbox, BaseInput, Button } from "@/components"; // import custom component
```

### Button

A versatile button component for React applications with customizable styles and behaviors.

```
<Button variant="primary" className="btn" type="submit" />
```

### BaseCheckbox

A customizable checkbox component encapsulating <input type="checkbox"> functionality.

```
 <BaseCheckbox id="checkBox" label="Checkbox" checked={checkbox} name="checkbox" onChange={changeHandler} />
```

### BaseInput

A reusable input component providing controlled text input with support for various types and attributes.

```
<BaseInput label="Input" type="text" name="input" value={checinputkbox} placeholder="enter input here" suffix="@" required={true} className="form-control" onChange={changeHandler} />
```

### FloatingInput

An input component featuring a floating label design pattern for enhanced user interaction and visual appeal.

```
<FloatingInput label="Input" type="text" name="input" value={checinputkbox} placeholder="enter input here" suffix="@" required={true} className="form-control" onChange={changeHandler} />
```

### LazyDropdown

## Props

> Required props

- [`end-point`](#end-point)
- [`resource-key`](#resource-key)
- [`searchable-key`](#searchable-key)
  > Optional props
- **item-text** // default **`name`**
- **item-value** // default **`id`**
- **placeholder**
- **label**
- **multiple**
- **collapse-tags**

You can use `onChange` to get the selected value.

### Example,

```html
<LazyDropdown
  itemText="{itemText}"
  itemSubText="{itemSubText}"
  itemValue="{itemValue}"
  endPoint="{endPoint}"
  resourceKey="{resourceKey}"
  searchableKey="{searchableKey}"
  landlord="{landlord}"
  addButton="{addButton}"
  apiVersion="{apiVersion}"
  placeholder="{placeholder}"
  label="{label}"
  id="{id}"
  value="{value}"
  onClear="{onClear}"
  onChange="{onChange}"
  onRemoveTag="{onRemoveTag}"
  onClick="{onClick}"
  multiple="{multiple}"
  maxTagCount="{maxTagCount}"
  maxCount="{maxCount}"
  suffixIcon="{suffixIcon}"
  {...selectProps}
>
  {({ visible, afterCreated, onClose }) => (
  <CreateRole
    visible="{visible}"
    afterCreated="{afterCreated}"
    onClose="{onClose}"
  />
  )}
</LazyDropdown>
```

Explantion

### `end-point`

Basically, end-point is the resource `index` end-point like `GET /badges` , `GET /territories` , `GET /territory-types` etc.
Though you can easily tweek the end-point on the fly like .

```js
:end-point="/invoices?status=unpaid"
```

Or even a dynamic value

```js
:end-point="`/invoices?buyer_id=${form.department_id}&status=unpaid`"
```

However, be sure you are not passing `page` query like, `:end-point="/invoices?page=1"`. _This is not valid._

### `resource-key`

It is basically the key in json response whiche hold the resource array. Example.

```json
{
  "current_page": 1,
  "first_page_url": "http://test-api.sokrio-server.test/v1/badges?page=1",
  "from": 1,
  "last_page": 4,
  "last_page_url": "http://test-api.sokrio-server.test/v1/badges?page=4",
  "next_page_url": "http://test-api.sokrio-server.test/v1/badges?page=2",
  "path": "http://test-api.sokrio-server.test/v1/badges",
  "per_page": 15,
  "prev_page_url": null,
  "to": 15,
  "total": 51,
  "badges": [
    {
      "id": 51,
      "name": "Silver",
      "created_at": "2020-07-21T08:16:59.000000Z",
      "updated_at": "2020-07-21T08:16:59.000000Z"
    }
  ]
}
```

**In this response `badges` is the `resource-key` key**

### `searchable-key`

Well, Our component is searchable by definition. That means, user can filter the resource beside scrolling, The filter is happen in backend. So need to pass the `searchable-key` , Based on this key the search will happen. **so , Ask backend-developer for that key.**

### `Children`

Here pass create new element as children React Element.
