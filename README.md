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

# Recommended Browser Settings
it is recommended to use Chrome and install uBlock Origin extension to block related videos from overlaying content. Here is the recommend list of custom filters (uBlock Origin -> insert in Options -> My Filters):
```
! Crowd Crush custom filters
www.youtube.com##.ytp-pause-overlay
www.youtube.com##.ytp-chrome-top
www.youtube.com##.ytp-gradient-top
```

# note on how to backup / restore a database:
backup:
pg_dump -F tar crowd_crush_dev > backup.tar

restore:
pg_restore -U postgres -h localhost --create --exit-on-error --verbose --dbname=postgres backup.tar
