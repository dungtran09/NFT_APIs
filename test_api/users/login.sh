curl \
-X POST \
-d @../users/data-users/login_user.json \
-H "Authentication: bearer $(cat ../nfts/config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/users/login" \
-o ./data-users/log.json && cat ./data-users/log.json | underscore print --outfmt pretty
