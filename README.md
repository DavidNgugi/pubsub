# Pub-Sub test with NodeJs and Redis

This app is composed of a `publisher` and `2 subscribers` subscribing to `topic 1` and `topic 2`.
Each subscriber listens on their respective topic on `port 9000` and the publisher running on `port 8000` manages handling messages from clients and publishing them to subscribers.

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

## Testing 

1. Subscribing to a topic

``` sh
curl -X POST -H "Content-Type: application/json" -d '{ "url": "http://localhost:9001"}' http://localhost:8001/subscribe/topic1
```

2. Publish message to topic

``` sh
curl -X POST -H "Content-Type: application/json" -d '{"message": "hello"}' http://localhost:8001/publish/topic1
```