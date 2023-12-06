# ezldap-vue-select

Provides a Vue.js/Vuetify component `ldap-person-auswahl` for a LDAP-based person search and selection. Uses the [ezLDAP-API](docs/ezLDAP-openapi.yaml) as a datasource.

Therefore, the `modelValue` of the component is equivalent to `LdapBaseUserDTO` object of the [ezLDAP-API](docs/ezLDAP-openapi.yaml).

## Usage

### Required Peer Dependencies

```
"@mdi/font": "> 5",
"vue": "^3.2.0",
"vuetify": "^3.3.0"
```

### Installation

```
npm install @muenchen/ezldap-vue-select
```

### Use

Import component:

```js
import { LdapPersonAuswahl } from "@muenchen/ezldap-vue-select";
```

Register component (e.g. in `Main.vue`):

```js
export default {
  name: "MyApp",
  components: {
    LdapPersonAuswahl
  }
});
```

Use component in `template`:

```html
<template>
  <ldap-person-auswahl
    v-model:modelValue="personData"
    id="my-custom-id"
    label="Custom Label"
    placeholder="Search for LDAP uid ..."
    no-data-text="No Person found"
  />
</template>
```

more example use cases see [sources of demo app](src/App.vue).

## Data structure

`v-model:modelValue` / Prop `modelValue`:

see [ezLDAP-API](docs/ezLDAP-openapi.yaml) -> Schemas `LdapBaseUserDTO`

If the value of the component is initially present, following rules are evaluated and actions performed:

- if `value` == `null` || `{}` : no user is pre-selected
- if `value.lhmObjectId` != null && `value.cn` != null && `value.ou` != null : pre-selection of input based on this data
- if `value.lhmObjectId` != null && `value.cn` == null && `value.ou` == null && Prop `initial-lookup` = true: triggers initial lookup of user data based on `lhmObjectId` from ezLDAP-API, user is then pre-selected
- if `value.uid` != null && `value.cn` == null && `value.ou` == null && Prop `initial-lookup` = true: triggers initial lookup of user data based on `uid` from ezLDAP-API, user is then pre-selected

Applications can therefore only persist the `lhmObjectId` of the user, but also show more than just the ID in the frontend for presentation purposes.

## Development

The template uses Vue `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Release & Publish

This project uses [semantic-release](https://github.com/semantic-release/semantic-release)!

| Commit message                                                                                                                                                                           | Release type               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `fix: stop graphite breaking when too much pressure applied`                                                                                                                             | Patch Release              |
| `feat: add 'graphiteWidth' option`                                                                                                                                                       | ~~Minor~~ Feature Release  |
| `perf: remove graphiteWidth option`<br><br>`BREAKING CHANGE: The graphiteWidth option has been removed.`<br>`The default graphite width of 10mm is always used for performance reasons.` | ~~Major~~ Breaking Release |

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please open an issue with the tag "enhancement", fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Open an issue with the tag "enhancement"
2. Fork the Project
3. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
4. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) file for more information.

## Contact

it@M - <opensource@muenchen.de>
