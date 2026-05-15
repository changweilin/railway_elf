# Railway Elf 後續計畫

更新日期：2026-05-15

本檔只保留尚未完成、阻塞或需要下輪判斷的工作。已完成的 seed 與 5.5 決策不再逐條累積在這裡；需要追溯時用 git history，或查 `doc/east-asia-expansion-plan.md` 的統計與區域脈絡。

## 下一個 5.3 seed

- [ ] `Hanoi-Metro-3`：只建 Hanoi Metro Line 3 current elevated segment（Nhổn ⇄ Cầu Giấy，8 站），沿用 `vietnam` region；不要納入 Cầu Giấy ⇄ Ga Hà Nội 地下段、Hanoi future lines、HCMC Line 2 或其他 future extension。
- [ ] 檔案範圍：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 train icon assets/generated shapes，以及窄幅 docs 更新。
- [ ] 驗證：`npm.cmd run build:train-icons`（若新增或重建圖示）、`node --env-file-if-exists=.env scripts/fetch-rail-shapes.mjs --only-lines=Hanoi-Metro-3`、`npm.cmd run build:rail-data`、`npm.cmd run check:train-icons`、`npm.cmd run check:timing`、`npm.cmd run check:shapes`、`npm.cmd run build`、`npm.cmd run test:smoke`。

## 5.5 待判斷

- [ ] `Hanoi-Metro-3` 完成後，再指定下一條 current-service seed；候選池從 Indonesia / Philippines / Vietnam / P2 全球研究項中擇一。
- [ ] P2 全球候選池（瑞士、德國、法國、英國、俄羅斯、印度、荷蘭、瑞典 / 挪威）先做 feasibility gate；不得直接交 5.3 多線落地。
- [ ] `BKK-MRT-Orange`、`Penang-Mutiara-LRT`、`SG-MRT-Cross-Island`、`SG-MY-RTS-Link` 只有在正式載客與 official / OSM station data 穩定後才重開 5.5 gate。
- [ ] `ERL-KLIA-Ekspres` late-night all-stations、KTM Komuter short-turn / skipped-station / maintenance timetable、Red Line future extensions、Pink Line branch graph 等仍屬 service-pattern / schema pass，不併入單線 seed。

## 文件整理規則

- [ ] 每輪只記錄新的未完成項、monitor 項與 gate；完成後從本檔移除，避免再堆 completed log。
- [ ] `doc/east-asia-expansion-plan.md` 的 active backlog / decision board 只保留未完成或 monitor 項；完整歷史用 git history 追溯。
