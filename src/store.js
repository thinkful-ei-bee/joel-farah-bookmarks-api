const bookmarks = [{
  id: 1,
  title: 'Task One',
  url: "http://google.com",
  desc: 'This is card one',
  rating: 4
}]

const lists = [{
  id: 1,
  header: 'List One',
  bookmarksdIds: [1]
}]

module.exports = { bookmarks, lists }