curl \
-X GET \
-H "Authentication: bearer $(cat ./config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/nfts/nfts-stats" \
-o ./data-nfts/log.json && cat ./data-nfts/log.json | underscore --outfmt pretty
