dev-start.sh
source  set-env.sh  acme
set-chain-env.sh -i '{"Args":["setTransaction", "Bank_A", "Bank_B", "200", "SUCCESS"]}'
chain.sh invoke
set-chain-env.sh -q '{"Args":["getTransaction","Bank_A+Bank_B+159b153a-a43b-4b48-abe2-3a7a70579c8a"]}'
chain.sh query
