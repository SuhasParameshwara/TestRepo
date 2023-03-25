FROM node:16-alpine

COPY . /d360clitestinit

RUN cd /d360clitestinit && npm ci && npm run build

CMD ["sh", "-c", "/d360clitestinit/bin/d360clitestinit $INPUT_RDME"]
