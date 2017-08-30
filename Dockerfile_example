FROM ubuntu:14.04

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# add basic lib
RUN apt-get update && apt-get -y install software-properties-common nginx build-essential curl python2.7 wget unzip && \
	ln -s /usr/bin/python2.7 /usr/bin/python2 && \

	curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
	apt-get -y install nodejs && \
	npm install -g pm2 

#create folders
RUN mkdir /app && \
	mkdir /app/framework && \
	mkdir /app/bot && \

	mkdir /tmp/install_framework && \
	mkdir /tmp/install_bot && \
	mkdir /tmp/install_bot/data && \
	mkdir /tmp/install_bot/node-red-contrib

# install node-red & framework & bot
ADD framework/package.json /tmp/install_framework
ADD bot/data/package.json /tmp/install_bot/data
ADD bot/node-red-contrib /tmp/install_bot/node-red-contrib

RUN cd /tmp/install_framework && npm install && \
	cd /tmp/install_bot/data && npm install

# create user so we do not work under root
RUN adduser node-red

# add framework & bot data
ADD framework /app/framework
ADD bot /app/bot
RUN mv /tmp/install_framework/node_modules /app/framework/ && \
	mv /tmp/install_bot/data/node_modules /app/bot/data/ && \
	chmod a+x /app/framework/start.sh

# prepare nginx
RUN ln -s /app/bot/conf/nginx.conf /etc/nginx/sites-available/bot.com && \
	ln -s /etc/nginx/sites-available/bot.com /etc/nginx/sites-enabled/ && \
	mkdir /etc/nginx/ssl && mkdir /etc/nginx/ssl/certs
	

# change user
RUN chown -R node-red:node-red /app
USER node-red

# set working directory
WORKDIR /app/bot

EXPOSE 80
EXPOSE 443

VOLUME [ "/etc/nginx/ssl/certs" ]

CMD ["/bin/bash", "-c" , "service nginx start && .././framework/start.sh -p 1880 --url $URL --env $ENV --docker --credential-secret $CREDENTIAL_SECRET bot"]