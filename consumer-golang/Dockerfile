FROM golang:1.22 as builder

WORKDIR /usr/app

COPY go.mod .

COPY go.sum .

RUN go mod download

COPY . .

RUN go build -o consumer-golang

FROM golang:1.22 as development

WORKDIR /usr/app

COPY --from=builder /usr/app/consumer-golang .

CMD ["./consumer-golang"]
