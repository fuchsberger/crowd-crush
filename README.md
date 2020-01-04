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

first clone the project:
```
git clone https://github.com/fuchsberger/crowd-crush.git
```
Then set environment variables. You may want to store them in .zshenv or .bashenv:
```
$ mix phx.gen.secret
REALLY_LONG_SECRET
$ export SECRET_KEY_BASE=REALLY_LONG_SECRET
$ export CROWD_CRUSH_DATABASE_URL=ecto://USER:PASS@HOST/DATABASE
```

## Backup / Resore Database
backup:
pg_dump -F tar crowd_crush_dev > backup.tar

restore:
pg_restore -U postgres -h localhost --create --exit-on-error --verbose --dbname=postgres backup.tar
