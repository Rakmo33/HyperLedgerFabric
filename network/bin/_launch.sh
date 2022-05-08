#PEER_MODE=net
#Command=dev-init.sh -e 
#Generated: Sun May  8 14:26:12 UTC 2022 
docker-compose  -f ./compose/docker-compose.base.yaml      -f ./compose/docker-compose.explorer.yaml    up -d --remove-orphans
