const request = require("supertest")
const app = require("../app/app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")
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

                    expect(topics).toEqual(data.topicData)
                    expect(topics.length).toBe(data.topicData.length)
                    expect(topics.length).toBeGreaterThan(0)
             
                    topics.forEach((topic)=>{
                        expect(Object.keys(topic)).toEqual(['slug','description'])
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
                    const endpoints = body.endpoints
                    expect(endpoints["GET /api"]).toEqual({description: 'serves up a json representation of all the available endpoints of the api'})
                    expect(endpoints["GET /api/topics"]).toMatchObject({"description": "serves an array of all topics", "exampleResponse": {"topics": [{"description": "Footie!", "slug": "football"}]}, "queries": []})
                    expect(endpoints["GET /api/articles"]).toMatchObject({"description": "serves an array of all articles", "exampleResponse": {"articles": [{"author": "weegembump", "comment_count": 6, "created_at": "2018-05-30T15:59:13.341Z", "title": "Seafood substitutions are increasing", "topic": "cooking", "votes": 0}]}, "queries": ["author", "topic", "sort_by", "order"]})
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
                expect(Object.keys(article).length).toBe(8)
                expect(typeof article.author).toBe("string")
                expect(typeof article.votes).toBe("number")
            })
    })
    test("get status code 400 if query is correct type but out of bounds",()=>{
        return request(app)
        .get("/api/articles/100")
        .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Invalid query params!!")
            })
    })
    test("get status code 400 if query is incorrect type",()=>{
        return request(app)
        .get("/api/articles/John")
        .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Invalid query params!!")

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
                articles.forEach((article)=>{
                    expect(Object.keys(article)).toEqual(["article_id","title","topic","author","created_at","votes","article_img_url","comment_count"])
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.votes).toBe("number")
                    expect(article.body).toBe(undefined)
                    expect(Object.keys(article).length).toBe(8)
                    expect(typeof article.comment_count).toBe("number")
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
                expect(body.msg).toBe("Invalid query params!!")
            })
    })
})

describe("POST /api/articles/:article_id/comments",()=>{
    test("get status code 200 and responds with the posted comment",()=>{
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