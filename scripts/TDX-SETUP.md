# TDX / OSM 資料來源設定

`scripts/fetch-rail-shapes.mjs` 會從 TDX（台灣）與 OSM Overpass（日本）抓真實鐵道線形，
產生靜態檔 `public/assets/rail-data.generated.js`。

- 終端使用者：**不需要**任何帳號，網頁是純靜態。
- 只有要更新線形時才在本機跑這支腳本。

---

## TDX 註冊流程（只做一次）

### 1. 開註冊頁
https://tdx.transportdata.tw/register

（運輸資料流通服務平臺 TDX，交通部運輸研究所維運）

### 2. 填註冊表
- Email（用收得到的）
- 密碼
- 姓名
- 使用者類型：選「個人會員」（免費、額度足夠）
- 用途：填「個人學習」或「個人開發專案」

### 3. 收驗證信 → 點連結啟用帳號
沒收到的話檢查垃圾信匣。

### 4. 申請 API Key
登入 → 右上角頭像 → 「會員中心」→ 左側選單找「API金鑰管理」→ 「新增金鑰」

填應用名稱（例如 `railway-elf`），送出後會拿到：
- `Client Id`
- `Client Secret`（**通常只顯示一次，立刻存好**）

### 5. 設定 .env 並執行腳本

複製範本：

```bash
cp .env.example .env
```

把 `.env` 裡的 `TDX_CLIENT_ID` / `TDX_CLIENT_SECRET` 填上你剛拿到的值。
`.env` 已經在 `.gitignore`，不會被 commit 出去。

在專案根目錄執行：

```bash
# 全部一起更新（推薦）
npm run build:rail-data

# 只更新台灣線
npm run build:rail-data:tw

# 只更新日本線（不需要 TDX credential）
npm run build:rail-data:jp
```

底層用的是 `node --env-file-if-exists=.env scripts/fetch-rail-shapes.mjs`
（Node 22+ 內建，不需要額外套件）。

> 不想用 .env 也可以一次性 inline：
> ```bash
> TDX_CLIENT_ID='xxx' TDX_CLIENT_SECRET='yyy' node scripts/fetch-rail-shapes.mjs
> ```

### 6. 確認結果
跑完後 `public/assets/rail-data.generated.js` 應包含 `TRA-West`、`TRA-East`、`THSR`
三個 entry。重新整理網頁，台灣線會變成貼著真實路線的彎曲形狀。

---

## 快取與離線執行

腳本會把每一個成功的 API 回應存到 `scripts/.cache/`（已被 `.gitignore`），下次跑：

- 預設行為：仍然打網路，成功就更新快取；**失敗則 fall back 用上次的快取**，避免一次抓不到就把 `rail-data.generated.js` 弄空。
- `OFFLINE=1` 環境變數：完全不打網路，只用快取。例如：
  ```bash
  OFFLINE=1 npm run build:rail-data
  ```
- `--no-cache` flag：完全停用快取（網路失敗就直接報錯）。
- `--refresh-cache` flag：強制重抓並覆蓋快取。

CI 第一次跑必須要有網路；之後就算 TDX/Overpass 暫時掛了，build 也不會壞。

---

## 額度

個人會員每天 20,000 次 API 呼叫。這支腳本一次只用個位數呼叫，無壓力。

---

## 安全注意事項

- `CLIENT_SECRET` 是真 secret，**絕對不要**：
  - commit 進 git
  - 寫進 `public/` 底下任何檔案
  - 放到前端 JSX
- 建議放法：本機 shell `export`、或專案根的 `.env`（並加進 `.gitignore`）
- 腳本只在本機跑，credential 不會出現在 `rail-data.generated.js` 裡。

---

## GitHub Actions 自動更新

`.github/workflows/update-rail-shapes.yml` 每月 1 號 02:00 UTC 自動跑一次，
也可以在 GitHub Actions 頁面手動觸發（**workflow_dispatch**），有 diff 就開 PR。

要啟用，先到 repo 的 **Settings → Secrets and variables → Actions** 加：

- `TDX_CLIENT_ID`
- `TDX_CLIENT_SECRET`

兩個值跟 `.env` 裡一樣。OSM Overpass 不用 secret。

第一次跑前要先在 repo Settings → Actions → General → Workflow permissions 開：
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

否則 `peter-evans/create-pull-request` 會權限不足。

---

## OSM Overpass（日本）

完全不用註冊，匿名公開 API。腳本內 `OSM_LINE_MAP` 設定的 relation id：

| 內部 line id          | OSM relation | 備註                       |
|-----------------------|--------------|----------------------------|
| Tokaido-Shinkansen    | 5263977      | 單向 route relation        |
| JR-Yamanote           | 1972920      | 外回り（順時針環狀）        |
| JR-Chuo               | 10363876     | 中央線快速 下り            |

如果上游 relation id 改變或想加新線：
1. 到 https://overpass-turbo.eu/ 用 `relation["route"="train"]["name"~"線名"]` 查
2. 把 relation id 填進 `scripts/fetch-rail-shapes.mjs` 的 `OSM_LINE_MAP`
3. 重跑腳本

---

## 已知問題

東海道新幹線、山手線目前抓到 shape 但 `stationKms` 非單調遞增，
`rail-data.js` 的 monotonic 檢查會 skip 合併，畫面 fallback 成站對站直線。
詳見 `scripts/fetch-rail-shapes.mjs` 裡 `stitchPolylines` / `stationKmOnShape`，
要修：
- 山手線：環狀線需要選個錨點（例如東京站）切開再投影
- 新幹線：上下行 relation 需要篩成單向，或鎖定 ref 過濾
