## Prerequisites 
1. Running Redis server
2. Node version v17.3.1

## Installation
1. Clone feedScan repo - `git clone git@github.com:davidbinyamin/feedScan.git`
2. Run - `npm install`
3. Edit feed path and redis configuration under `config/default.json`

# Apps

## feedScan
This app will scan feed directory for any new feed batch uploaded from customers.
once the batch is validated, the last feed time will be stored in Redis
batch file should be in the following format: `<customer ID>.batch`

To run feedScan: `npm run feedScan`

## feedHealthCheck
this app will sample redis each minute and alert the user incase the last feed was more the a minute ago.

To run feedHealthCheck: `npm run feedHealthCheck`
