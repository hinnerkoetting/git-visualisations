@echo off
call npm install
call npm install bower -g

cd public
call bower install
cd ..