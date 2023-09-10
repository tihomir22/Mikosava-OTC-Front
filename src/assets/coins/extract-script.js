const fs = require("fs");
var importantOnes = [
  "MATIC",
  "WMATIC",
  "USDC",
  "WBTC",
  "AAVE",
  "UNI",
  "QUICK",
  "LINK",
  "SNX",
  "CRV",
  "SUSHI",
  "YFI",
  "BAL",
  "FTM",
  "SAND",
  "FRAX",
  "USDT",
  "FRONT",
  "CREAM",
  "ALICE",
  "RAI",
  "MUST",
  "LUNA",
  "HEX",
  "SLP",
  "SHIB",
  "DOGE",
  "GRT",
  "ENJ",
  "WETH",
  "REN",
];

var allPolygonCoinGeckoExtractedCoins = JSON.parse(
  fs.readFileSync("polygon-coins.json", "utf8")
);
var finalList = [];
importantOnes.forEach((imporantOne) => {
  const found = allPolygonCoinGeckoExtractedCoins.find(
    (entry) => entry.symbol.toLowerCase() == imporantOne.toLowerCase()
  );
  if (found && !!found.platforms["polygon-pos"]) {
    found.address = found.platforms["polygon-pos"];
    delete found.platforms;
    finalList.push(found);
  }
});

fs.writeFileSync("polygon-coins-v3.json", JSON.stringify(finalList));
