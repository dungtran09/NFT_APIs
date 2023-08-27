curl \
-X GET \
-H "Authentication: bearer $(cat ../nfts/config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/users" \
-o ./data-users/log.json && cat ./data-users/log.json | underscore print --outfmt pretty
