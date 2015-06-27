#! /bin/bash

jade -w  jade/views/ -o html/ &
sass --watch scss:css
