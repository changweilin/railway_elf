# TDX / OSM 資料來源設定

`scripts/fetch-rail-shapes.mjs` 會從 TDX（台灣）與 OSM Overpass（日本）抓真實鐵道線形，
產生靜態檔 `src/rail-data.generated.js`。

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
跑完後 `src/rail-data.generated.js` 應包含 `TRA-West`、`TRA-East`、`THSR`
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

## 目前線形狀態（2026-05-04 重新驗證）

| 線                    | shape 來源 | 站點偏移 | monotonic 檢查 | 備註 |
|-----------------------|------------|----------|----------------|------|
| TRA-West              | TDX v3 `WL` | 944 m | ✅            | `WL` 內含桃園→北桃園支線 detour,產生器會移除閉合 detour 後再輸出主線 |
| TRA-East              | TDX v3 `WL[樹林→八堵]` + `EL` | 957 m | ✅ | 西部主幹的樹林-八堵段 + 東部幹線 |
| THSR                  | TDX v2 `HSRL` | 1284 m | ✅ | v3 的 THSR Shape endpoint 不存在,固定走 v2 |
| JR-Chuo               | OSM rel 10363876 | 101 m | ✅ | |
| JR-Yamanote           | OSM rel 1972920 | 49 m | ✅ | parallel dedupe 把 75km 雙軌縮成 34.5km 真實環長,`loopAnchor=東京` 旋轉,前端 `loopClosureKm` 處理閉合 |
| Tokaido-Shinkansen    | OSM rel 5263977 | 130 m | ✅ | 6939 條 way 中 21k 頂點走廊過濾(0.7km)→ centerline 重建,465km(真實 552km,centroid 平均把曲線拉直但拓撲正確) |

## TDX schema 變更紀錄(2026-05 之前 vs 之後)

- **TRA `LineID` 從數字 → 字母碼**:`1001/1002/...` 全部下架,改成 `WL/EL/YL/NL/TT/...` 等字母碼。腳本 `TDX_LINE_MAP` 已更新。
- **THSR Shape endpoint 從 v3 拿掉**:v3 path 回 404,v2 仍可用。`tdxFetch` 加了 `version` 參數,THSR 固定走 v2。
- **WL 是 MULTILINESTRING(3 段)**:其中一段會從台鐵桃園往北桃園/林口方向繞出支線,再被 stitch 接回桃園→高雄主線。`removeLargeClosedDetours` 會移除這種「同一 junction 繞出去又回來」的大型閉合 detour,避免桃園附近出現直線跨接 artifact。

## 已知問題

### Tokaido-Shinkansen — 走廊重建,長度 16% 短少

OSM relation `5263977` 含 6939 條 way,既是上下行又含岔線/廠區,parent relation 是空的(無 route_master),OSM 上游也沒有單向 sub-route 可換。腳本走的是「站點走廊 centerline 重建」(`reconstructCorridorShape`):

1. 把所有 way 頂點投影到站點鏈,丟掉距站點鏈 > 0.7 km 的點
2. 把存活頂點按投影 km 切 0.1 km 一格
3. 每格輸出一個 centroid 作為 polyline 一個點

雙軌會自然平均成中線,結果 465 km(真實 552 km,16% 短)、站點偏移 130 m、monotonic ✅。視覺上沿正確走廊,只是 centroid 平均把急彎拉直一些。前端 `mergeShapes` 會用 generated 的 stationKms 當權威,所以列車動畫總長按 465 km 跑。

如果未來 OSM 補上單向 sub-route relation 或 route_master 拆分,可以拿掉 `corridor` 設定回到一般 dedupe + stitch 路徑。

### TRA-West 桃園 detour

`WL` 的 3 個 sub-segment 中,seg[1] 會先經過台鐵桃園 junction (24.99, 121.32),再往北桃園/林口方向延伸到 (25.12, 121.30)。stitch 接上 seg[0] 的桃園→高雄主線時,會形成「桃園→北桃園 detour→直線回桃園」的閉合路徑,在地圖上看起來像被捷運/支線拉歪。

產生器現在會在 stitch 後移除大型閉合 detour,保留基隆/八堵→桃園→高雄主線。若未來 TDX 把支線拆到獨立 LineID,可以再把這段規則收斂成更明確的 LineID mapping。
