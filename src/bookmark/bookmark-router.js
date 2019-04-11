const express = require('express')
const xss = require('xss')
const uuid = require('uuid/v4')
const logger = require('../logger')
const BookmarksService = require('./bookmark-service')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
  .route('/bookmarks')
    .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks)
      })
      .catch(next)
    }) 
    .post(bodyParser, (req, res, next) => {
      const { bookmark_title, bookmark_url, bookmark_desc, bookmark_rating } = req.body;
      const newBookmark = { bookmark_title, bookmark_url, bookmark_desc, bookmark_rating };   
      
      if(!bookmark_title) {
        return res
          .status(400)
          .json({ error: { message: `Missing 'bookmark_title' in request body` }})
      }

      if(!bookmark_url) {
        return res
          .status(400)
          .json({ error: { message: `Missing 'bookmark_url' in request body` }})
      }

      BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(bookmark)
      })
      .catch(next)
  })
bookmarkRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    return BookmarksService.getById(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
          })
        }
        res.bookmark = bookmark // save the article for the next middleware
        return next() // don't forget to call next so the next middleware happens!
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeArticle(res.bookmark))
    // BookmarksService.getById(req.app.get('db'), req.params.bookmark_id)
    // .then(bookmark => {
    //   if (!bookmark) {
    //     return res.status(404).json({
    //       error: { message: `Bookmark doesn't exist` }
    //     })
    //   }
    //   res.json({
    //     id: bookmark.id,
    //     bookmark_title: xss(bookmark.bookmark_title),
    //     bookmark_url: xss(bookmark.bookmark_url),
    //     bookmark_desc: xss(bookmark.bookmark_desc),
    //     bookmark_rating: bookmark.bookmark_rating
    //   })
    // })
    // .catch(next)
  })
  .delete((req, res, next) => {
    console.log(req.params);
    return BookmarksService.deleteBookmark(req.app.get('db'), req.params.bookmark_id
    )
    .then(() => {
      return res.status(204).end()
    })
    .catch(next)
  })

module.exports = bookmarkRouter