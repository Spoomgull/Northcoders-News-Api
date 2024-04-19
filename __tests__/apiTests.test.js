const request = require("supertest")
const app = require("../app/app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")
const articles = require("../db/data/test-data/articles.js")
require("jest-sorted")


afterAll(()=>{
    db.end()
})
beforeEach(()=>{
    return seed(data)
})

describe("GET /*",()=>{
    test("when given an endpoint that doesnt exist return an error message",()=>{
        return request(app)
        .get("/John")
        .expect(404)
            .then(({body})=>{
                const err = body.msg
                expect(err).toBe("Sorry can't find that!!")
            })
    })
})

describe("GET /api/topics",()=>{
    test("get status code 200, and return all from the topic table",()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
                .then(({body})=>{
                    const topics = body.topics

                    expect(topics).toMatchObject(data.topicData)
                    expect(topics.length).toBe(data.topicData.length)
             
                    topics.forEach((topic)=>{
                        expect(topic).toMatchObject({slug:expect.any(String),description:expect.any(String)})
                    })

                })
    })
})

describe("GET /api",()=>{
    test("get status code 200, and return all the endpoints with descriptions on how to use them and what they do",()=>{
        return request(app)
            .get("/api")
            .expect(200)
                .then(({body})=>{
                    const endpointFile = require("../endpoints.json")
                    const endpoints = body.endpoints
                    expect(endpoints).toMatchObject(endpointFile)
                })
    })
})

describe("GET /api/articles/:article_id",()=>{
    test("get status code 200, and return the specified article",()=>{
        return request(app)
        .get("/api/articles/2")
        .expect(200)
            .then(({body})=>{
                const article = body.article
                expect(Object.keys(article).length).toBeGreaterThan(0)
                expect(article).toMatchObject({
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                article_img_url:expect.any(String)})
            })
    })
    test("get status code 404 if query is correct type but invalid range",()=>{
        return request(app)
        .get("/api/articles/100")
        .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Sorry can't find that!!")
            })
    })
    test("get status code 400 if query is incorrect type",()=>{
        return request(app)
        .get("/api/articles/John")
        .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Invalid query type!!")

        })
    })
})

describe("GET /api/articles",()=>{
    test("get status code 200, and all the articles in an array with comment_count and ordered by date descending",()=>{
        return request(app)
        .get("/api/articles")
        .expect(200)
            .then(({body})=>{
                const articles=body.articles
                expect(typeof articles).toBe("object")
                expect(articles).toBeSortedBy("created_at",{descending: true})
                expect(articles.length).toBeGreaterThan(0)
                articles.forEach((article)=>{
                    expect(article).toMatchObject({article_id:expect.any(Number),title:expect.any(String),topic:expect.any(String),author:expect.any(String),created_at:expect.any(String),votes:expect.any(Number),article_img_url:expect.any(String),comment_count:expect.any(Number)})
                    expect(Object.keys(article).length).toBe(8)
                })
        })
    })
})

describe("GET /api/articles/:article_id/comments",()=>{
    test("get status code 200, and return all the comments for the specified article",()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
            .then(({body})=>{
                const comments = body.comments
                expect(comments.length).toBeGreaterThan(0)
                comments.forEach((comment)=>{
                    const commentParts = Object.values(comment)
                    expect(Object.keys(comment)).toMatchObject(["comment_id","body","article_id","author","votes","created_at"])
                    expect(typeof commentParts[0]).toBe("number")
                    expect(typeof commentParts[1]).toBe("string")
                    expect(typeof commentParts[2]).toBe("number")
                    expect(typeof commentParts[3]).toBe("string")
                    expect(typeof commentParts[4]).toBe("number")
                    expect(typeof commentParts[5]).toBe("string")
                })
            })
        })
    test("expect the returned values to be sorted with the most recent comments first",()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
            .then(({body})=>{
                const comments = body.comments
                expect(comments).toBeSortedBy("created_at",{descending:true})
            })
        })
    test("get status code 200, and return a message if there are no comments",()=>{
        return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("No comments!!")
            })
    })
    test("get status code 404, and return an error message if the parameter is a valid type but a non-existant article_id",()=>{
        return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("No comments!!")
            })
    })
    test("get status code 400, and return an error message if the parameter is an invalid type",()=>{
        return request(app)
        .get("/api/articles/John/comments")
        .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Invalid query type!!")
            })
    })
})

describe("POST /api/articles/:article_id/comments",()=>{
    test("get status code 201 and responds with the posted comment",()=>{
        const comment = {username: "butter_bridge",body: "This article is pretty great! :)"}
        return request(app)

            .post("/api/articles/2/comments")
            .send(comment)
            .expect(201)
                .then(({body})=>{
                    const postedComment = body.comment
                    expect(postedComment).toMatchObject([{"article_id": 2, "author": "butter_bridge", "body": "This article is pretty great! :)", "comment_id": 19, "votes": 0, "created_at": expect.any(String)}])
                })
    })
    test("get status code 400, when given an incorrect username",()=>{
        const comment = {username:"john", body:"this is a comment"}
        return request(app)
        
            .post("/api/articles/2/comments")
            .send(comment)
            .expect(400)
                .then(({body})=>{
                    const err = body.msg
                    expect(err).toBe("Invalid query params!!")
                })
    })
    test("get status code 400, when given an incorrect article id",()=>{
        const comment = {username:"butter_bridge",body:"this is a comment"}
        return request(app)

            .post("/api/articles/100/comments")
            .send(comment)
            .expect(400)
                .then(({body})=>{
                    const err = body.msg
                    expect(err).toBe("Invalid query params!!")
                })
    })
})

describe("PATCH /api/articles/:article_id",()=>{
    test("get status code 200, and return the updated article with the new votes value",()=>{
        const newVote = 10
        const patch = {inc_votes: newVote}
        return request(app)
        .patch("/api/articles/3")
        .send(patch)
        .expect(200)
            .then(({body})=>{
                const article = body.article[0]
                expect(article).toMatchObject({article_id: 3,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                author: "icellusedkars",
                body: "some gifs",
                created_at: "2020-11-03T09:12:00.000Z",
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                votes : 10})

            })
    })
    test("get status code 200, and return the updated article when inc_votes is a negative number",()=>{
        const newVote = -10
        const patch = {inc_votes: newVote}
        return request(app)
        .patch("/api/articles/2")
        .send(patch)
        .expect(200)
            .then(({body})=>{
                const article = body.article[0]
                expect(article.votes).toBe(-10)
            })
    })
    test("get status code 400, when newVote is incorrect type",()=>{
        const newVote = "hello"
        const patch = {inc_votes: newVote}
        return request(app)
        .patch("/api/articles/1")
        .send(patch)
        .expect(400)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("Invalid query type!!")
            })
    })
    test("get status code 404, when article_id is correct type but invalid range",()=>{
        const newVote = 10
        const patch = {inc_votes: newVote}
        return request(app)
        .patch("/api/articles/100")
        .send(patch)
        .expect(404)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("Sorry can't find that!!")
            })
    })
    test("get status code 400, when article_id is the incorrect type",()=>{
        const newVote = 10
        const patch = {inc_votes: newVote}
        return request(app)
        .patch("/api/articles/John")
        .send(patch)
        .expect(400)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("Invalid query type!!")
            })
    })
})
describe("DELETE /api/comments/:comment_id",()=>{
    test("get status code 204, and return no content",()=>{
        return request(app)
        .delete("/api/comments/7")
        .expect(204)
    })
    test("get status code 404 when comment_id is correct type but invalid range",()=>{
        return request(app)
        .delete("/api/comments/200")
        .expect(404)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("Sorry can't find that!!")
            })
    })
    test("get status code 400 when comment_id is incorrect type",()=>{
        return request(app)
        .delete("/api/comments/John")
        .expect(400)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("Invalid query type!!")
            })
    })
})
describe("GET /api/users",()=>{
    test("get status code 200, and return an array of object with the keys of username, name and avatar_url",()=>{
        return request(app)
        .get("/api/users")
        .expect(200)
            .then(({body})=>{
                const {users} = body
                expect(users.length).toBe(data.userData.length)
                users.forEach((user)=>{
                    expect(user).toMatchObject({username: expect.any(String),name:expect.any(String),avatar_url:expect.any(String)})
                })
            })
    })
})
describe("GET /api/articles?topicFilter",()=>{
    test("get status code 200, and return all the articles with the specific topic filter",()=>{
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles.length).toBe(4)
                articles.forEach((article)=>{
                    expect(article.topic).toBe("mitch")
                })
            })
    })
    test("get status code 400 if there are no topics with the topicFilter value",()=>{
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Sorry can't find that!!")
            })
    })
    test("get status code 404 if the filter has the wrong name",()=>{
        return request(app)
        .get("/api/articles?tipoc=mitch")
        .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Sorry can't find that!!")
            })
    })
})
describe("GET /api/articles/:article_id",()=>{
    test("get status code 200 and return the specified array with that newly added comment_count",()=>{
        return request(app)
        .get("/api/articles/3")
        .expect(200)
            .then(({body})=>{
                expect(body.article).toMatchObject({comment_count:"2"})
            })
    })
})