process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("./app");
const db = require("./db");



beforeEach(async function(){
  await db.query(`DELETE FROM books`)

    const resp = await request(app)
      .post('/books/')
      .send({
        "isbn": "0691161518",
        "amazon-url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
      });

    const resp2 = await request(app)
      .post('/books/')
      .send({
        "isbn": "0691161519",
        "amazon-url": "http://a.co/eobPtX2",
        "author": "Penny Street",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Dreams of heading outside, 2020",
        "year": 2017
      });
});

describe('POST /books/', function(){
  it('posts a book succesfully to the database', async function(){
    const resp = await request(app)
      .post('/books/')
      .send({
        "isbn": "0691161520",
        "amazon-url": "http://a.co/eobPtX2",
        "author": "Ruth Less",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Taking what you want",
        "year": 2017
      }); 
    expect(resp.statusCode).toBe(201)
    expect(resp.body.book.isbn).toBe("0691161520")
  });

  it('posts an invalid book, duplicate isbn', async function() {
    const resp = await request(app)
    .post('/books/')
    .send({
      "isbn": "0691161519",
      "amazon-url": "http://a.co/eobPtX2",
      "author": "Ruth Less",
      "language": "english",
      "pages": 264,
      "publisher": "Princeton University Press",
      "title": "Taking what you want",
      "year": 2017
    }); 
    expect(resp.statusCode).toBe(400);
  });

  it('posts an invalid book, no Author, no title', async function() {
    const resp = await request(app)
    .post('/books/')
    .send({
      "isbn": "0691161521",
      "amazon-url": "http://a.co/eobPtX2",
      "language": "english",
      "pages": 264,
      "publisher": "Princeton University Press",
      "year": 2017
    }); 
    expect(resp.statusCode).toBe(400);
    expect(resp.message.length).toBe(2);
  });
})

describe('get /books', function(){
  it("Gets alist of all books", async function(){
    const resp = await request(app)
      .get('/books/');
    expect(resp.statusCode).toBe(201);
    expect(resp.body.books.length).toBe(2);
    expect(resp.body.books[0].pages).toBe(264);
  })
});