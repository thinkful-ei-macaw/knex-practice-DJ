require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

// searchByProduceName('holo')

function paginateProducts(page) {
  const productsPerPage = 10
  const offset = productsPerPage * (page - 1)
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

// paginateProducts(4)

function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
      console.log(result)
    })
}

// getProductsWithImages()

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result)
    })
}

// mostPopularVideosForDays(30)

function findRow(searchTerm) {
  knexInstance
    .select('product_name')
    .from('shopping_list')
    .where('product_name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

// findRow('bacon');

function findPage(pageNumber){
  const productsPerPage = 6
  const offset = productsPerPage * (pageNumber - 1)
  knexInstance
    .select('id', 'product_name', 'price', 'category', 'date_added')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

// findPage(2);

function findHowOld(daysAgo) {
  knexInstance
    .select('date_added')
    .from('shopping_list')
    .where('date_added', '<', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(result => {
      console.log(result)
    })
}

// findHowOld(2);

function findPriceByGroup() {
  knexInstance
    .select('product_name', 'category', 'price')
    .from('shopping_list')
    .groupBy('product_name', 'category', 'price')
    .orderBy([
      {column: 'category', order: 'ASC'}
    ])
    .then(result => {
      let mainSum = 0;
      let snackSum = 0;
      let lunchSum = 0;
      let breakfastSum = 0;
      result.forEach(p => {
        let price = parseFloat(p.price);
        if (p.category === 'Main') {
          mainSum = price + mainSum;
        }
        if (p.category === 'Snack') {
          snackSum = price + snackSum;
        }
        if (p.category === 'Lunch') {
          lunchSum = price + lunchSum;
        }
        if (p.category === 'Breakfast') {
          breakfastSum = price + breakfastSum;
        }
      })
      console.log(result, `Main total price is ${mainSum.toFixed(2)}`, `Snack total price is ${snackSum.toFixed(2)}`, `Lunch total price is ${lunchSum.toFixed(2)}`, `Breakfast total price is ${breakfastSum.toFixed(2)}`)
    })

}

findPriceByGroup();