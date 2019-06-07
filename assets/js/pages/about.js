import { Container, List } from 'semantic-ui-react'

export default () => (
  <Container>
    <h1>About</h1>
    <p>
      CrowdCrush is a research tool that allows to annotate the motions of objects in videos.<br/>
      Primarily used for pedestrian crowd simulations, this project is part of Alexander Fuchsberger's dissertation, conducted at the University of Nebraska at Omaha.
    </p>

    <p>Currently the following features are implemented:</p>
    <List bulleted>
      <List.Item>Annotation of objects via Agents and Markers</List.Item>
      <List.Item>2D relative Coordinate Translation into real world coordinates</List.Item>
      <List.Item>
        Rendering of
        <List.List>
          <List.Item>Original Video</List.Item>
          <List.Item>Original Video overlayed with annotated Agents</List.Item>
          <List.Item>Overlay Videos (such as Background removal rendered variants)</List.Item>
          <List.Item>Overlay Videos with annotated Agents</List.Item>
          <List.Item>Side by side comparison of agent movements with a secondary simulation</List.Item>
        </List.List>
      </List.Item>
      <List.Item>Downloading of Data files that serve as input for succeeding research projects</List.Item>
    </List>
    <p>If you have any questions, please contact me via email at <a href = "mailto: afuchsberger@unomaha.edu">afuchsberger@unomaha.edu</a>.</p>
    <p>If you want to report any bugs or report on the research tool please submit an issue <a href='https://github.com/fuchsberger/crowd-crush' target='_blank'>on Github</a></p>
  </Container>
);
