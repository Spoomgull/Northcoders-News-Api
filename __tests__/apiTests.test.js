const request = require("supertest")
const app = require("../app/app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")



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
                    expect(endpoints["GET /api/topics"]).toEqual({"description": "serves an array of all topics", "exampleResponse": {"topics": [{"description": "Footie!", "slug": "football"}]}, "queries": []})
                    expect(endpoints["GET /api/articles"]).toEqual({"description": "serves an array of all articles", "exampleResponse": {"articles": [{"author": "weegembump", "body": "Text from the article..", "comment_count": 6, "created_at": "2018-05-30T15:59:13.341Z", "title": "Seafood substitutions are increasing", "topic": "cooking", "votes": 0}]}, "queries": ["author", "topic", "sort_by", "order"]})
                })
    })
})