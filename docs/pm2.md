# PM2
PM2 Allows running services in the background without using systemd or systemctl and can automatically start your proccess once the host boots up.

### Run Headplane
1. Make sure that headscale is not running in the background or foreground already. You can shut it down.
2. Install PM2. Don't worry. It's easy.
Run these commands to install PM2
```bash
npm install -g pm2
```
After that, it should be installed!

3. Just run 
```bash
pm2 start ecosystem.config.cjs
```
in the headplane folder, and headplane should start!

### Run on startup
If you want PM2 to run headplane on startup, you can run these commands:
```bash
pm2 startup
pm2 save
```
