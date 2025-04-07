#!/bin/sh

# wait-for.sh db-host db-port timeout
host="$1"
port="$2"
timeout="${3:-30}"

echo "Waiting for $host:$port to be ready..."

for i in $(seq 1 "$timeout"); do
  nc -z "$host" "$port" && echo "$host:$port is ready!" && exit 0
  sleep 1
done

echo "Timeout while waiting for $host:$port"
exit 1
