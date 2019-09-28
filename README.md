# Build MAM

GitHub Action to build [MAM](https://github.com/eigenmethod/mam) based project

## Inputs

### `module`

**Required** Path to your module in global MAM scope

## Example usage

```
  - name: Build app
    uses: hyoo-ru/mam_build@master
    with:
      module: 'hyoo/notes'
```

[Full workflow example](ps://github.com/hyoo-ru/notes.hyoo.ru/blob/master/.github/workflows/deploy.yml)
