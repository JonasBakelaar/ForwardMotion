How to use (does not work on windows):

1. Have NodeJS installed
2. Enter this directory in the console
3. Enter "npm install" 
4. Enter "npm install --save request"
5. Enter "npm install --save request-promise"
4. Enter "npm run dev [port_number]"

To create the MySQL table necessary for storing data:

CREATE TABLE test3 (id int unsigned not null auto increment primary key, lastName varchar(255) firstName varchar(255), salary double, employer varchar(255), jobTitle varchar(255), year varchar(255)));

*NOTE: Make sure you have correct connection details to your MySQL database and MySQL installed on your development environment.
