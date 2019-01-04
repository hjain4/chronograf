FROM gliderlabs/alpine
MAINTAINER Chris Goller <chris@influxdb.com>

RUN apk update \
    && apk upgrade \
    && apk add --no-cache \
        ca-certificates \
    && update-ca-certificates 2>/dev/null || true

ADD chronograf /usr/bin/chronograf
ADD chronoctl /usr/bin/chronoctl
ADD canned/*.json /usr/share/chronograf/canned/
ADD LICENSE /usr/share/chronograf/LICENSE
ADD agpl-3.0.md /usr/share/chronograf/agpl-3.0.md

EXPOSE 8888
VOLUME ["/usr/share/chronograf", "/var/lib/chronograf"]

CMD ["/usr/bin/chronograf", "-b", "/var/lib/chronograf/chronograf-v1.db", "-c", "/usr/share/chronograf/canned"]
