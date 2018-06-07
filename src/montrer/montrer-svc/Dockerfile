FROM beatrak/node-base

RUN mkdir -p /root/montrer/src/beacon/beacon-msvc/app
ADD ./app /root/montrer/src/beacon/beacon-msvc/app

# we have to do a bit of juggling here beacuase
# we can't do ../../common in docker
RUN mkdir -p /root/montrer/src/common
ADD ./common /root/montrer/src/common

#RUN mkdir -p /root/montrer/src/protos
#ADD ./protos /root/montrer/src/protos

#RUN mkdir -p /root/montrer/src/keys
#ADD ./keys /root/montrer/src/keys

WORKDIR /root/montrer/src/montrer/montrer-msvc/app

COPY ./waitloop.sh ./start-dev.sh /
#RUN chmod a+x /waitloop.sh && chmod a+x /start-dev.sh && chmod a+x /start-prod.sh
RUN chmod a+x /waitloop.sh && chmod a+x /start-dev.sh

# http
EXPOSE 8080
# grpc
EXPOSE 8085
# grpc tls
EXPOSE 8090
#CMD ["/waitloop.sh"]
#CMD ["npm", "start"]
CMD ["/start-dev.sh"]

