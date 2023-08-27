curl \
-X POST \
-H "Authentication: bearer $(cat ./config/TOKEN.txt)" \
-d @./data-nfts/createNFT.json \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/nfts" \
-o ./data-nfts/log.json && cat ./data-nfts/log.json | underscore print --outfmt pretty
