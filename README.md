# BiteSpeedApp
API contains solution to problem statement where contact datails of user are supposed to be link with each other. 

Deployement :- deployed at render.com
URL :- himanshu-biteapi.onrender.com
postman schema :- 
**POST /identify HTTP/1.1
Host: himanshu-biteapi.onrender.com
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: ae1281ac-4aa5-496d-99f0-5bf2df224531

{
	"email" : "eoooo@gmail.com",
	"phoneNumber": 6289689678732
}**

Curl :- **curl -X POST \
  https://himanshu-biteapi.onrender.com/identify \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 76d27df3-1988-4c20-be75-58a386bf0dbe' \
  -d '{
	"email" : "eoooo@gmail.com",
	"phoneNumber": 6289689678732
}'**

Run the above curl command to check the api. one can use https://reqbin.com/curl to run curl as well.


Code desctripition :- 
git-branch :-host_master 
db : - sqllite
framework :- node.js
