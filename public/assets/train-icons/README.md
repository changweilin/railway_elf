# Train Icon Assets

Top-down raster marker icons for Railway Elf live trains.

- Final icons are 256 x 256 PNG files with transparent backgrounds.
- All icons point upward in local image space; callers rotate the image by the train heading.
- `train-icon-map.json` has `lineOverrides` plus `typeFallbacks`. Runtime lookup is line-aware first, then type fallback, then the colored dot fallback.
- `train-icons-contact-sheet.png` shows each asset at 256, 64, 32, and 24 px for legibility checks.
- Run `npm run build:train-icons` to regenerate line-aware PNGs, the JSON mirror, and the contact sheet.
- Run `npm run check:train-icons` to verify that every train template resolves to a 256 x 256 alpha PNG.

## Visual Style

The marker language is intentionally compact rather than photorealistic: dark outline, light roof/body, dark window blocks, and route or service color accents that remain visible at 24 px. High-speed services use a tapered nose, express services use a tapered intercity body, commuter and metro services use squared rounded bodies, and heritage-style fallbacks keep their existing bespoke silhouettes.

## Reference Cues

Existing type fallbacks use these visual references:

- Taiwan High Speed Rail 700T: https://commons.wikimedia.org/wiki/Category:Taiwan_High_Speed_700T
- TRA EMU3000: https://commons.wikimedia.org/wiki/Category:TRA_EMU3000
- TRA TEMU1000 Taroko: https://commons.wikimedia.org/wiki/Category:TRA_TEMU1000
- TRA TEMU2000 Puyuma: https://commons.wikimedia.org/wiki/Category:TRA_TEMU2000
- TRA EMU800 commuter: https://commons.wikimedia.org/wiki/Category:TRA_EMU800
- TRA Chu-Kuang Express: https://commons.wikimedia.org/wiki/Category:Chu-kuang_Express
- Alishan Forest Railway trains: https://commons.wikimedia.org/wiki/Category:Trains_on_the_Alishan_Forest_Railway
- Taipei Metro C381: https://commons.wikimedia.org/wiki/Category:C381
- Kaohsiung MRT: https://commons.wikimedia.org/wiki/File:Kaohsiung_MRT_Train.jpg
- Taoyuan Metro 1000/2000 series: https://commons.wikimedia.org/wiki/Category:Taoyuan_Metro_1000_series and https://commons.wikimedia.org/wiki/Category:Taoyuan_Metro_2000_series
- Taiwan light rail: https://commons.wikimedia.org/wiki/Category:Light_rail_in_Taiwan
- Shinkansen N700: https://commons.wikimedia.org/wiki/Category:Shinkansen_N700
- JR East E235 Yamanote Line: https://commons.wikimedia.org/wiki/File:JRE_E235_series_Yamanote_Line_train.jpg
- JR East E233 Chuo Rapid Line: https://commons.wikimedia.org/wiki/File:JRE_Chuo-Rapid-Line_Series-E233-0.jpg

Line-aware additions use representative livery cues from the route or service family in `src/rail-data.js`:

- Taiwan: TRA coast-line semi-express EMU styling with cyan/blue accents.
- Japan: Tokyo Metro Ginza/Marunouchi, JR Keihin-Tohoku, JR Sobu Local, Tokyu Toyoko, JR Osaka Loop/Yamatoji, Osaka Metro Midosuji, Hankyu Kobe, and Sanyo Shinkansen service-color cues.
- Korea: Seoul Metro Lines 1/2, KTX, KTX-Sancheon, and Busan Metro Line 1 cues.
- Hong Kong: MTR Tsuen Wan, Island, East Rail, and Airport Express cues.
- China: Fuxing/Hexie high-speed train shapes and Beijing/Shanghai subway line-color cues.
- Singapore, Malaysia, Thailand, Vietnam: representative MRT/LRT/BTS/airport-rail metro body shapes with route-color accents.
