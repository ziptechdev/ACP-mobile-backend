export $(egrep -v '^#' .env | xargs) && docker-compose -f docker-compose.dev.yml up
