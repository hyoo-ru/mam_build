# Build MAM

GitHub Action to build [MAM](https://github.com/eigenmethod/mam) based project. Built project will replace source code.

## Inputs

### `package`

**Required** Path to your package in global MAM scope.

### `modules`

**Optional** Paths to your modules that you want to build reative to package. By default builds package as module.

## Example usage

```
    - name: Build app
      uses: hyoo-ru/mam_build@master2
      with:
        package: 'piterjs'
        module: 'piterjs/app'
```

[Full workflow example](https://github.com/hyoo-ru/portal.hyoo.ru/blob/master/.github/workflows/deploy.yml)
