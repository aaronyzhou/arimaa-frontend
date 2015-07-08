#! /bin/bash

#adding a new file to the jade folder will require a restart
jade -w  jade/views/ -o html/ &
jsx -w --es6module jsx/ js/ &
sass --watch scss:css
