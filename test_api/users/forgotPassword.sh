curl \
-X POST \
-d @./data-users/email.json \
-H "Authentication: bearer $(cat ../nfts/config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/users/forgotPassword" \
-o ./data-users/log.json && cat ./data-users/log.json | underscore print --outfmt pretty 
