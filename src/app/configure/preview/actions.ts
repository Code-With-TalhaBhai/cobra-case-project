'use server'

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { Order } from "@prisma/client"
import {stripe} from "@/lib/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"



export const createCheckoutSession = async({configId}:{configId:string})=>{
  console.log('entering createcheckout session')
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
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if(!user){
    throw new Error('You need to be logged in');
  }


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


  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [configuration.imgUrl],
    default_price_data: {
      currency: 'USD',
      unit_amount: totalPrice
    }
  })

  console.log('before session')
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_VERCEL_URL }/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL }/configure/preview?id=${configuration.id}`,
    payment_method_types: ['card'],
    mode: "payment",
    // shipping_address_collection: {allowed_countries: ['US','PK','UA']},
    metadata: {
      userId: user.id,
      orderId: order.id
    },
    line_items: [{price: product.default_price as string, quantity: 1}]
  })


  return { url: stripeSession.url }
}