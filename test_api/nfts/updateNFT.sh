curl \
-X PATCH \
-H "Authentication: bearer $(cat ./config/TOKEN.txt)" \
-d @./data-nfts/updateNFT.json \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/nfts/$(cat ./config/ID.txt)" \
-o ./data-nfts/log.json && cat ./data-nfts/log.json | underscore print --outfmt pretty
