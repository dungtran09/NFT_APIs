curl \
-X PATCH \
-H "Authentication: bearer $(cat ../nfts/config/TOKEN.txt)" \
-d @./data-users/updateUser.json \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/users/updateUser" \
-o ./data-users/log.json && cat ./data-users/log.json | underscore print --outfmt pretty 
