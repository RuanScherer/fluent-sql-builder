import { describe, expect, test } from "@jest/globals"
import FluentSQL from "../src/fluentSQL"

const database = [
  {
    id: 0,
    name: "Ruan",
    category: "developer"
  },
  {
    id: 1,
    name: "Erick",
    category: "developer"
  },
  {
    id: 2,
    name: "João",
    category: "manager"
  }
]

describe("Test Suite for FluentSQL Builder", () => {
  test("#for should return a FluentSQLBUilder instance", () => {
    const result = FluentSQL.for(database)
    const expected = new FluentSQL({ database })

    expect(result).toStrictEqual(expected)
  })

  test("#build should return the object instance", () => {
    const result = FluentSQL
      .for(database)
      .build()
    const expected = database

    expect(result).toStrictEqual(expected)
  })

  test("#limit given a collection it should limit results", () => {
    const result = FluentSQL
      .for(database)
      .limit(1)
      .build()
    const expected = [database[0]]

    expect(result).toStrictEqual(expected)
  })

  test("#where given a collection it should filter data", () => {
    const result = FluentSQL
      .for(database)
      .where({ category: /^dev/ }) // starts with 'dev'
      .build()
    const expected = database.filter(({ category }) => category.slice(0, 3) === 'dev')

    expect(result).toStrictEqual(expected)
  })

  test("#select given a collection it should return only specific fields", () => {
    const result = FluentSQL
      .for(database)
      .select([ "name", "category" ])
      .build()
    const expected = database.map(({ name, category }) => ({ name, category }))

    expect(result).toStrictEqual(expected)
  })

  test("#orderBy given a collection it should results by field", () => {
    const result = FluentSQL
      .for(database)
      .orderBy("name")
      .build()
    const expected = [
      {
        id: 1,
        name: "Erick",
        category: "developer"
      },
      {
        id: 2,
        name: "João",
        category: "manager"
      },
      {
        id: 0,
        name: "Ruan",
        category: "developer"
      }
    ]

    expect(result).toStrictEqual(expected)
  })

  test("pipeline", () => {
    const result = FluentSQL
      .for(database)
      .select(["id", "name"])
      .where({ category: "manager" })
      .orderBy("name")
      .limit(1)
      .build()

    const expected = database.filter(({ id }) => id === 2).map(({ id, name }) => ({ id, name }))
    
    expect(result).toStrictEqual(expected)
  })
})