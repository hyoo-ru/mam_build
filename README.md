# Build MAM

GitHub Action to build [MAM](https://github.com/eigenmethod/mam) based project. Built project will replace source code.

## Inputs

### `module`

**Required** Path to your module in global MAM scope that you want to build.

### `package`

**Optional** Path to your package in global MAM scope

## Example usage

```
    - name: Build app
      uses: hyoo-ru/mam_build@master
      with:
        module: 'piterjs/app'
        package: 'piterjs'
```

[Full workflow example](https://github.com/hyoo-ru/piterjs.org/blob/master/.github/workflows/deploy.yml)
