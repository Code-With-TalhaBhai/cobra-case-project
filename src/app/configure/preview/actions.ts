'use server'

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { Order } from "@prisma/client"


export const createCheckoutSession = async({configId}:{configId:string})=>{
    const configuration = await db.configuration.findUnique({
        where: {id: configId}
    })

    if (!configuration){
        throw new Error("No such Configuration")
    }

  const {finish,material} = configuration
    let totalPrice = BASE_PRICE
      if (material === 'polycarbonate'){
        totalPrice += PRODUCT_PRICES.material.polycarbonate
      }
      if (finish === 'textured'){
        totalPrice += PRODUCT_PRICES.finish.textured
      }

  let order : Order | undefined = undefined
  const user = {id:'dsafasfasdfdsafd'}

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id
    }
  })


  if (existingOrder){
    order = existingOrder
  }
  else{
    order = await db.order.create({
      data: {
        configurationId: configuration.id,
        userId: user.id,
        amount : totalPrice / 100,
      }
    })
  }
  
}