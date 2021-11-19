# Pub-Sub test with NodeJs and Redis

This app is composed of a `publisher` and `1 subscriber`.
A subscriber is always listening for messages on their respective channels on their specified port. By default it's `port 9000` and the publisher running on `port 8000` manages handling messages from clients and publishing them to subscribers.

## Installation

Edit and ensure your environment variables are correct.

```sh
npm install && cp env.example .env
```

## Running the app

The app runs on localhost. Note: I could only test this on macOS

``` sh
sh start-server.sh
```

It is possible to monitor on the `PM2.io dashboard` if you provide a valid `PM2_PUBLIC_KEY` and `PM2_SECRET_KEY` in the `.env` file. The `start-server.sh` script will automatically detect the variables and link to the dashboard

## API Testing 

1. Subscribing to a topic

``` sh
curl -X POST -H "Content-Type: application/json" -d '{ "url": "http://localhost:9000"}' http://localhost:8000/subscribe/topic1
```

2. Publish message to topic

``` sh
curl -X POST -H "Content-Type: application/json" -d '{"message": "hello"}' http://localhost:8000/publish/topic1
```