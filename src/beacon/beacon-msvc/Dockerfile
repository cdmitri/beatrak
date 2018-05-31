FROM beatrak/node-base

RUN mkdir -p /root/beatrak/src/beacon/beacon-msvc/app
ADD ./app /root/beatrak/src/beacon/beacon-msvc/app

# we have to do a bit of juggling here beacuase
# we can't do ../../common in docker
RUN mkdir -p /root/beatrak/src/common
ADD ./common /root/beatrak/src/common

RUN mkdir -p /root/beatrak/src/protos
ADD ./protos /root/beatrak/src/protos

RUN mkdir -p /root/beatrak/src/keys
ADD ./keys /root/beatrak/src/keys

WORKDIR /root/beatrak/src/beacon/beacon-msvc/app

COPY ./waitloop.sh ./start-dev.sh ./start-prod.sh /
RUN chmod a+x /waitloop.sh && chmod a+x /start-dev.sh && chmod a+x /start-prod.sh

# http
EXPOSE 8080
# grpc
EXPOSE 8085
# grpc tls
EXPOSE 8090
#CMD ["/waitloop.sh"]
#CMD ["npm", "start"]
CMD ["/start-prod.sh"]
