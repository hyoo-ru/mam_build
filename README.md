# Build MAM

GitHub Action to build [MAM](https://github.com/eigenmethod/mam) based project.

## Inputs

### `token`

**Required** Github personal access token.

### `package`

**Required** Path to your package in global MAM scope.

### `modules`

**Optional** Paths to your modules that you want to build reative to package. By default builds package as module.

### `meta`

**Optional** Paths to dependent module and namespace repositories. They will be loaded before build.

## Example usage

```
    - name: Build app
      uses: hyoo-ru/mam_build@master2
      with:
        package: 'piterjs'
        modules: 'app intro'
```
Two modules `$piterjs_app` and `$piterjs_intro` will be built.

```
    - name: Build app
      uses: hyoo-ru/mam_build@master2
      with:
        package: 'piterjs/app'
```
The `$piterjs_app` module will be built.

```
    - name: Build app
      uses: hyoo-ru/mam_build@master2
      with:
        token: ${{ secrets.GH_PAT }}
        package: 'my/counter'
        meta: |
          my https://github.com/githubuser/mam_my
```
The `$my_counter` module will be built. Before the build, the repository `https://github.com/githubuser/mam_my` will be cloned at the path `mam/my`, which contains `my.meta.tree`. It contains links to modules used by `$my_counter`.

[Full workflow example](https://github.com/hyoo-ru/portal.hyoo.ru/blob/master/.github/workflows/deploy.yml)

[Build with publish to NPM](https://github.com/hyoo-ru/mam_mol/blob/master/.github/workflows/mol_wire_lib.yml)

[More examples](https://github.com/hyoo-ru/mam_mol/tree/master/.github/workflows)
