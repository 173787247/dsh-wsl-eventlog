# dsh-wsl-eventlog

> 从 WSL 读取 Windows 事件日志，可按日志名与级别过滤。

DeepSeek Harness 插件：Read recent Windows event log entries from WSL, by log name and level.

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)** 的一部分。

[English → README.md](./README.md)

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-eventlog
```

## 用法

```
win_eventlog                              # System, errors+critical, 20 entries
win_eventlog log=Application level=3 count=50
```

## 说明

Reads by log name and minimum level. Level is 1 critical, 2 error, 3 warning,
4 information. Messages are truncated to 300 characters.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。

## 测试

```sh
npm test
```

单元测试在任何平台都能跑；实时测试在 WSL 之外自动跳过。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-eventlog` **0.1.0** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | `full` 或单独安装 |

## 许可

MIT
