curl \
-X GET \
-H "Authentication: bearer $(cat ./config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/nfts/" \
-o ./data-nfts/log.json && cat ./data-nfts/log.json | underscore print --outfmt pretty
