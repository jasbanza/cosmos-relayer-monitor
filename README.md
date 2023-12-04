# cosmos-relayer-monitor
- linux system service
- Uses nodejs to:
  - start relayer instances (one instance per path)
  - rly stdout redirected to websocket
  - http server with dashboard to monitor
  
- optional configuration:
  - periodic restart of relayers
