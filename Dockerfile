FROM mhart/alpine-node:10
ADD . .
EXPOSE 8778
ENV FORCE_COLOR 1
RUN ["ls"]
RUN ["npm", "rebuild"]
ENTRYPOINT ["node", "index.js"]