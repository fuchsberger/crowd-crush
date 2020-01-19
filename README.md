# Crowd Crush

CrowdCrush is a research tool that allows to annotate the motions of objects in videos.
Primarily used for pedestrian crowd simulations, this project is part of Alexander Fuchsberger's dissertation, conducted at the University of Nebraska at Omaha.

Currently the following features are implemented:

* Annotation of objects via Agents and Markers
* 2D relative Coordinate Translation into real world coordinates
* Rendering of
  * Original Video
  * Original Video overlayed with annotated Agents
  * Overlay Videos (such as Background removal rendered variants)
  * Overlay Videos with annotated Agents
  * Side by side comparison of agent movements with a secondary simulation
* Downloading of Data files that serve as input for succeeding research projects

If you want to report any bugs or report on the research tool please submit an issue on Github

## Recommended Browser Settings
it is recommended to use Chrome and install uBlock Origin extension to block related videos from overlaying content. Here is the recommend list of custom filters (uBlock Origin -> insert in Options -> My Filters):
```
! Crowd Crush custom filters
www.youtube.com##.ytp-pause-overlay
www.youtube.com##.ytp-chrome-top
www.youtube.com##.ytp-gradient-top
```

## Installation
This project is best deployed on a debain-based linux distribution (such as Ubuntu). The following requirements have to be met:
* erlang 22.2.1
* elixir 1.9.4
* nodejs 13.5.0

First clone the project:
```
git clone https://github.com/fuchsberger/crowd-crush.git
```
Then set environment variables. You may want to store them in .zshenv or .bashenv:
```bash
$ mix phx.gen.secret
REALLY_LONG_SECRET
$ export SECRET_KEY_BASE=REALLY_LONG_SECRET
$ export CROWD_CRUSH_DATABASE_URL=ecto://USER:PASS@HOST/DATABASE
```
Then load dependencies to compile code and assets:
```bash
# Initial setup (1)
$ mix deps.get --only prod
$ MIX_ENV=prod mix compile

# Compile assets
$ cd assets && npm install # (2)
$ npm run deploy --prefix ./assets
$ mix phx.digest
$ MIX_ENV=prod mix release

# (*) only on initial deploy or when changing deps (1) / npm assets (2)
```

Create a service that allows to (re)start the webserver on system boot and when it crashes. Create `lib/systemd/system/app_crowd_crush.service`:
```ini
[Unit]
Description=Crowd Crush
After=network.target

[Service]
User=deploy
Group=deploy
Restart=on-failure
Environment=HOME=/home/deploy/apps/crowd-crush/
ExecStart=/home/deploy/apps/crowd-crush/_build/prod/rel/crowd_crush/bin/crowd_crush start
ExecStop=/home/deploy/apps/crowd-crush/_build/prod/rel/crowd_crush/bin/crowd_crush stop

[Install]
WantedBy=multi-user.target
```
You can now start / stop the server as a service and it will auto-restart on reboot / failure:
```console
$ sudo systemctl daemon-reload
$ sudo systemctl start app_crowd_crush.service
```


## Backup / Resore Database
backup:
pg_dump -F tar crowd_crush_dev > backup.tar

restore:
pg_restore -U postgres -h localhost --create --exit-on-error --verbose --dbname=postgres backup.tar
