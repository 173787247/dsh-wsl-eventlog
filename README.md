# dsh-wsl-eventlog

DeepSeek Harness plugin: Read recent Windows event log entries from WSL, by log name and level.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-eventlog
```

## Usage

```
win_eventlog                              # System, errors+critical, 20 entries
win_eventlog log=Application level=3 count=50
```

## Notes

Reads by log name and minimum level. Level is 1 critical, 2 error, 3 warning,
4 information. Messages are truncated to 300 characters.

## Requirements

- Windows with WSL, and DeepSeek Harness running inside it.

## Tests

```sh
npm test
```

The unit tests run anywhere. The live tests are skipped outside WSL.

## License

MIT
