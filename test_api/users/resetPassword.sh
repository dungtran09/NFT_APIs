curl \
-X PATCH \
-d @./data-users/newPassword.json \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/users/resetPassword/$(cat ./config/resetPasswordToken.txt)" \
-o ./data-users/log.json && cat ./data-users/log.json | underscore print --outfmt pretty 
