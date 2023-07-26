# Readme

## Releasing packages:

1. Run npm version

```bash
npm version prerelease --workspace packages/react-sdk
```

2. Commit changes from the last command.
3. Publish npm package:

```bash
npm publish --access public -w packages/react-sdk
```