const request = require("supertest")
const app = require("../app/app.js")
const db = require("../db/connection.js")//"../db/data/test-data/index.js"
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")

afterAll(()=>{
    db.end()
})
beforeEach(()=>{
    return seed(data)
})

describe("GET api/topics",()=>{
    test("get status code 200, and return all from the topic table",()=>{
        return request(app)
            .get("/api/topics")
            .expect(200)
                .then(({body})=>{
                    expect(body).toEqual(data.topicData)

                })
    })
})