# cosmos-relayer-monitor
- linux system service
- Uses nodejs to:
  - start relayer instances (one instance per path)
  - rly stdout redirected to websocket
  - http server with dashboard to monitor
  
- optional configuration:
  - periodic restart of relayers


- contextual awareness for 
  - insufficient fee


## Setup Instructions:

### 1) Set up files

###### Clone repo
```bash
git clone https://github.com/jasbanza/cosmos-relayer-monitor.git
```
###### Navigate to project root and install node dependencies
```bash
cd cosmos-relayer-monitor
```
```bash
npm install
```


###### Optional - update path to node executable for the ExecStart property in the service file. _(root's path might differ to the logged in user / nvm's path, and if it's an older version of nodejs, it might break stuff...)_
```bash
which node
```


### 2) Set up background service

###### Copy the .service file into /etc/systemd/system/

```bash
cp cosmos-relayer-monitor.service /etc/systemd/system/cosmos-relayer-monitor.service
```
###### Make it executable
```bash
sudo chmod 755 /etc/systemd/system/cosmos-relayer-monitor.service
```

###### Restart systemctl to register the new service
```bash
systemctl daemon-restart
```

###### Check status of mute scheduler background process:
```bash
systemctl status cosmos-relayer-monitor.service
```
###### Any errors can be found in the log: 
```bash
journalctl -u cosmos-relayer-monitor.service
```

### 3) Expose web service
###### Allow port 3333 through firewall
```bash
sudo ufw allow 3333 comment "cosmos-relayer-monitor"
```
###### Check if web server is accessible on port 3333