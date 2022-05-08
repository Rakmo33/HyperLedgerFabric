dev-init.sh -e
source  set-env.sh  acme
set-chain-env.sh  -n erc20  -v 1.0  -p  exercise/ERC20   
chain.sh install -p
chain.sh instantiate
set-chain-env.sh -i '{"Args":["setTransaction", "Bank_A", "Bank_B", "200", "SUCCESS"]}'
chain.sh invoke
set-chain-env.sh -q '{"Args":["getTransaction","Bank_A+Bank_B+159b153a-a43b-4b48-abe2-3a7a70579c8a"]}'
chain.sh query
