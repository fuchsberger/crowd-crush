// videos are stored as an object. this function transforms them into an array
export const listAll = ( videos )  => (
  Object.keys(videos).map(i => ({ ...videos[i], id: i }))
);

export default {
  listAll
}