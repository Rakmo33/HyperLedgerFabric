ERC20 
=====
https://theethereum.wiki/w/index.php/ERC20_Token_Standard

Commonly used standard for creating tokens on Ethereum. This implementation of the ERC20 on Fabric is not covering all of the functions. The idea is demonstrate the creation of standard token on Hyeprledger Fabric. For more information please refer to the website link above. To keep things simple this implementation identifies users by "unique id" rather than the public key (in Ethereum)

Functions
=========
- Token created as part of the "chaincode" instantiation
- [transfer]    function transfer the specified number of tokens from one user to another
- [balanceOf]   returns the number of tokens owned by the specified user

####

vagrant up
vagrant ssh
dev-init.sh -e
dev-start.sh
source  set-env.sh  acme
set-chain-env.sh  -n erc20  -v 1.0 -s 1   -p  exercise/ERC20   
chain.sh install -p
chain.sh instantiate
set-chain-env.sh -i '{"Args":["setTransaction", "Bank_A", "Bank_B", "200", "SUCCESS"]}'
chain.sh invoke
set-chain-env.sh -q '{"Args":["getTransaction","cd633dd5-d958-44a2-a045-1b11720630ee"]}'
chain.sh query

###
for updating chaincode
set-chain-env.sh  -s []  -v []   
chain.sh approve
chain.sh commit

### starting node server (outside vagrant)

cd app\sdk\gateway
//delete wallet folder
node wallet.js add acme Admin
nodemon ./gateway.js


cd app\sdk\gateway2
//delete wallet folder
node wallet.js add budget Admin
nodemon ./gateway2.js

###

Install
=======
Install the chaincode on the Acme Peer-1
  .    set-env.sh    acme
  set-chain-env.sh       -n erc20  -v 1.0   -p  exercise/ERC20   
  chain.sh install -p

Instantiate
===========
Instantiate the chaincode

 set-chain-env.sh        -c   '{"Args":["init","ACFT","1000", "A Cloud Fan Token!!!","john"]}'
 chain.sh  instantiate

Query
=====
Query the balance for 'john'
 set-chain-env.sh         -q   '{"Args":["balanceOf","john"]}'
 chain.sh query

Invoke
======
Transfer 100 tokens from 'john' to 'sam'
  set-chain-env.sh         -i   '{"Args":["transfer", "john", "sam", "10"]}'
  chain.sh  invoke

Query
=====
Check the balance for 'john' & 'sam'
 set-chain-env.sh         -q   '{"Args":["balanceOf","john"]}'
 chain.sh query
 set-chain-env.sh         -q   '{"Args":["balanceOf","sam"]}'
 chain.sh query

==============
Events Testing
==============
Launch the events utility
 events.sh -t chaincode -n erc20 -e transfer -c airlinechannel 

In a <<Terminal #2> execute the invoke - observe transfer events in terminal 1
  set-chain-env.sh         -i   '{"Args":["transfer", "john", "sam", "10"]}'
  chain.sh invoke


Node version
============
https://github.com/grepruby/ERC20-Token-On-Hyperledger
