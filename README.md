# CYCU GDG on Campus Gemini-CLI+MCP WorkShop

## MCP

`settings.json`

```json
{
  "mcpServers": {
    "github-remote": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_ACCESS_TOKEN"
      }
    },
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    },
    "desktop-commander": {
      "command": "npx",
      "args": [
        "-y",
        "@wonderwhy-er/desktop-commander"
      ]
    }
  },
  "general": {
    "preferredEditor": "vscode",
    "previewFeatures": true
  },
  "security": {
    "auth": {
      "selectedType": "oauth-personal"
    }
  },
  "ui": {
    "theme": "Default"
  }
}
```


## Prompt

```
幫我用 Node.JS 寫一個記帳 Web App

技術：

- Framework: React (Functional Components + Hooks)
  - `npm create vite@latest expense-tracker -- --template react --no-interactive`
- UI: Bootstrap 5.3.8(react-bootstrap)，採用清新、簡潔的藍白配色主題，打造類似 Dashboard 的質感
- Icons: 使用 @mui/icons-material 來區分消費類別
- Charts: 使用 recharts 繪製圓餅圖，顯示支出占比
- Data Persistence: 使用 localStorage 儲存資料

功能：

- 新增記帳：一個清楚的表單，包含金額、類別、日期、備註
- 收支列表：漂亮的清單顯示最近消費，依日期排序
- 統計摘要：頂部顯示總支出與本月預算剩餘
- 編輯預算
- 刪除功能：每筆紀錄可被刪除
- 介面為台灣繁體中文
```