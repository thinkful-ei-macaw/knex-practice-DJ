/* eslint-disable quotes */
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe.only(`Shopping list service object`, function() {
  let db
  let testProducts = [
    {
      id: 1,
      product_name: 'Product 1',
      price: '1.11',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      category: 'Main',
      checked: false,
    },
    {
      id: 2,
      product_name: 'Product 2',
      price: '2.22',
      date_added: new Date('2029-01-23T16:28:32.615Z'),
      category: 'Snack',
      checked: false,
    },
    {
      id: 3,
      product_name: 'Product 3',
      price: '3.33',
      date_added: new Date('2029-01-24T16:28:32.615Z'),
      category: 'Lunch',
      checked: false,
    },
    {
      id: 4,
      product_name: 'Product 4',
      price: '4.44',
      date_added: new Date('2029-01-25T16:28:32.615Z'),
      category: 'Breakfast',
      checked: false,
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testProducts)
    })

    it(`getAllProducts() resolves all products from the 'shopping_list' table`, () => {
      return ShoppingListService.getAllProducts(db)
        .then(actual => {
          expect(actual).to.eql(testProducts)
        })
    })
    it(`getById() resolves a product by id from the 'shopping_list' table`, () => {
      const fourthId = 4
      const fourthTestProduct = testProducts[fourthId -1]
      return ShoppingListService.getById(db, fourthId)
        .then(actual => {
          expect(actual).to.eql({
            id: fourthId,
            product_name: fourthTestProduct.product_name,
            price: fourthTestProduct.price,
            date_added: fourthTestProduct.date_added,
            category: fourthTestProduct.category,
            checked: fourthTestProduct.checked,
          })
        })
    })
    it(`deleteProduct() removes a product from the 'shopping_list' table`, () => {
      const productId = 4
      return ShoppingListService.deleteProduct(db, productId)
        .then(() => ShoppingListService.getAllProducts(db))
        .then(allProducts => {
          const expected = testProducts.filter(product => product.id !== productId)
          expect(allProducts).to.eql(expected)
        })
    })
    it(`updateProduct() updates a product from the 'shopping_list' table`, () => {
      const idOfProductToUpdate = 4
      const newProductData = {
        product_name: 'updated name',
        price: '5.55',
        date_added: new Date(),
        category: 'Main',
        checked: true,
      }
      return ShoppingListService.updateProduct(db, idOfProductToUpdate, newProductData)
        .then(() => ShoppingListService.getById(db, idOfProductToUpdate))
        .then(product => {
          expect(product).to.eql({
            id: idOfProductToUpdate,
            ...newProductData,
          })
        })
    })
  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllProducts() resolves an empty array`, () => {
      return ShoppingListService.getAllProducts(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
    it(`insertProduct() inserts a new product and resolves the new product with an 'id'`, () => {
      const newProduct = {
        product_name: 'Test new name',
        price: '1.11',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        category: 'Main',
        checked: false,
      }
      return ShoppingListService.insertProduct(db, newProduct)
        .then(actual => {
          expect(actual).to.eql({
            id:1,
            product_name: newProduct.product_name,
            price: newProduct.price,
            date_added: newProduct.date_added,
            category: newProduct.category,
            checked: newProduct.checked,
          })
        })
    })
  })
})