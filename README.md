install dependencies

run npm install 

install mysql in docker
目前只支持mysql 8以下的版本，由于sequelize和mysql的一点兼容性问题未解决
docker-compose -p mysql -f docker_compose.yml up  -d mysql
