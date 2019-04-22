import Api from './helper/Api'
import {Constants} from '@common'
import * as Utils from './helper/Utils'

export const createCart = ()=>{
  return new Promise((resolve,reject)=>{
    Api.post(`/V1/carts/mine`,{},global.userToken)
    .then((response)=>{
      if (response.statusCode == 200) {
        resolve(response.body)
      }else{
        reject(response.body.message)
      }
    })
    .catch(reject)
  })
}

export const addItemToCart = (item,quoteId)=>{
  return new Promise((resolve,reject)=>{
    const params = {
      cartItem:{
        sku:item.sku,
        qty:item.qty,
        quote_id:quoteId
      }
    }
    Api.post(`/V1/carts/mine/items`,params,global.userToken)
    .then((response)=>{
      if (response.statusCode == 200) {
        resolve(response.body)
      }else{
        reject(response.body.message)
      }
    })
    .catch(reject)
  })
}

export const addItemsToCart = (quoteId,products)=>{
  return new Promise((resolve,reject)=>{
    var count = 0
    products.forEach((item)=>{
      addItemToCart(item,quoteId)
      .then((res)=>{
        count += 1
        if (count == products.length) {
          resolve()
        }
      })
      .catch((error)=>{
        count += 1
        if (count == products.length) {
          resolve()
        }
      })
    })

  })
}

export const estimateShippingCost = (address)=>{
  return new Promise((resolve,reject)=>{

    Api.post(`/V1/carts/mine/estimate-shipping-methods`,{address},global.userToken)
    .then((response)=>{
      if (response.statusCode == 200) {
        if (response.body.length > 0) {
          resolve(response.body)
        }else{
          reject("Don't have any shipping methods at your address")
        }
      }else{
        reject(response.body.message)
      }
    })
    .catch(reject)
  })
}

export const setShippingInfo = (shippingInfo)=>{
  return new Promise((resolve,reject)=>{

    Api.post(`/V1/carts/mine/shipping-information`,shippingInfo,global.userToken)
    .then((response)=>{
      if (response.statusCode == 200) {
        resolve(response.body)
      }else{
        reject(response.body.message)
      }
    })
    .catch(reject)
  })
}

export const createOrder = (paymentMethod,billing_address)=>{
  return new Promise((resolve,reject)=>{
    const params = {
      paymentMethod:{
        method:paymentMethod
      },
      billing_address
    }
    Api.post(`/V1/carts/mine/payment-information`,params,global.userToken)
    .then((response)=>{
      if (response.statusCode == 200) {
        resolve(response.body)
      }else{
        reject(response.body.message)
      }
    })
    .catch(reject)
  })
}

export const getMyOrders = (customer_email,page)=>{
  return new Promise((resolve,reject)=>{
    Api.get(`/V1/orders?`+Utils.makeParams({
      page,
      pageSize:Constants.Api.Limit,
      sort:"created_at",
      filter:{
        customer_email
      }
    }),global.token)
    .then((response)=>{
      if (response.statusCode == 200) {
        resolve(response.body.items)
      }else{
        reject(response.body.message)
      }
    })
    .catch(reject)
  })
}
