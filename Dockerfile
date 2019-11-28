# I chose not to use :slim because then it will take ages to install all of the required packages
FROM node:10.16.1-jessie

COPY . /express
WORKDIR /express

RUN apt-get update -y

# Install all dependencies
RUN yarn

# Build the app
RUN yarn build

WORKDIR /express/build

# Expose correct port
EXPOSE 5000

# Define environment variable
ENV NAME=express

CMD ["node", "index.js"];