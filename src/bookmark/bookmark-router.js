const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const BookmarksService = require('./bookmark-service')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
  .get('/bookmarks', (req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks)
    })
    .catch(next)
  }) 
  

  // .post(bodyParser, (req, res) => {
  //   const { title, url, desc, rating } = req.body;
  
  //   if (!title) {
  //     logger.error(`Title is required`);
  //     return res
  //       .status(400)
  //       .send('Invalid data');
  //   }
    
  //   if (!url) {
  //     logger.error(`Url is required`);
  //     return res
  //       .status(400)
  //       .send('Invalid data');
  //   }
  
  //   // get an id
  //   const id = uuid();

  //   const bookmark = {
  //     id,
  //     title,
  //     url,
  //     desc,
  //     rating
  //   };
  
  //   bookmarks.push(bookmark);
  
  //   logger.info(`Bookmark with id ${id} created`);
  
  //   res
  //     .status(201)
  //     .location(`http://localhost:8000/bookmarks/${id}`)
  //     .json(bookmark);
  // })

bookmarkRouter
  .route('/bookmarks/:bookmark_id')
  .get((req, res, next) => {
    BookmarksService.getById(knexInstance, req.params.bookmark_id)
    .then(bookmark => {
      if (!bookmark) {
        return res.status(404).json({
          error: { message: `Bookmark doesn't exist` }
        })
      }
      res.json({
        id: bookmark.id,
        title: bookmark.bookmark_title,
        url: bookmark.bookmark_url,
        desc: bookmark.bookmark_desc,
        rating: bookmark.bookmark_rating
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