#!/bin/bash

set -o errexit

# Exit immediately on any error

pip install -r Server/requirements.txt

cd Server
python manage.py makemigrations
python manage.py migrate

python manage.py runserver
