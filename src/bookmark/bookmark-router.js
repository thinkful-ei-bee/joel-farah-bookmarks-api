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
  .get((req, res, next) => {
    BookmarksService.getById(req.app.get('db'), req.params.bookmark_id)
    .then(bookmark => {
      if (!bookmark) {
        return res.status(404).json({
          error: { message: `Bookmark doesn't exist` }
        })
      }
      res.json({
        id: bookmark.id,
        bookmark_title: xss(bookmark.bookmark_title),
        bookmark_url: xss(bookmark.bookmark_url),
        bookmark_desc: xss(bookmark.bookmark_desc),
        bookmark_rating: bookmark.bookmark_rating
      })
    })
    .catch(next)
  })
  // .delete((req, res) => {
  //   // move implementation logic into here
  //   const { id } = req.params;
  
  //   const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
  
  //   if (bookmarkIndex === -1) {
  //     logger.error(`Bookmark with id ${id} not found.`);
  //     return res
  //       .status(404)
  //       .send('Not found');
  //   }
  
  //   //remove bookmark from lists
  //   //assume bookmarkIds are not duplicated in the bookmarkIds array
  //   lists.forEach(list => {
  //     const bookmarkIds = list.bookmarkIds.filter(bid => bid !== id);
  //     list.bookmarkIds = bookmarkIds;
  //   });
  
  //   bookmarks.splice(bookmarkIndex, 1);
  
  //   logger.info(`Bookmark with id ${id} deleted.`);
  
  //   res
  //     .status(204)
  //     .end();
  // })

module.exports = bookmarkRouter