curl \
-X PATCH \
-H "Authentication: bearer $(cat ../nfts/config/TOKEN.txt)" \
-d @./data-users/newPassword.json \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/users/updatePassword/" \
-o ./data-users/log.json && cat ./data-users/log.json | underscore print --outfmt pretty 
