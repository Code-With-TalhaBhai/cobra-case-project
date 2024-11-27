import { db } from '@/db'
import { notFound } from 'next/navigation'
import React from 'react'
import ConfiguatorDesign from './ConfiguatorDesign'

type Props = {
  searchParams : {
    [key:string] : string | string[] | undefined
  }
}

const Design = async({searchParams}: Props) => {
  const {id} = searchParams
  if (!id || typeof id !== "string"){
    return notFound()
  }

  // db
  // const configuration = await db.configuration.findUnique({
  //   where: { id: id as string },
  // })

  // if (!configuration){
  //   return notFound()
  // }

  // dummy 
  const configuration = {
    id: 'cm2haajpd0002vs3datsi2z90',
    imgUrl: 'https://cobra-case-bucket.s3.amazonaws.com/ae1ded6d-bacc-47ef-8cfd-923fd88b9f2a}',
    width: 1366,
    height: 768
  }

  const {width,height,imgUrl} : any = configuration 

  return <ConfiguatorDesign configId={configuration.id} imageDimensions={{width,height}} imageUrl={imgUrl}/>
}

export default Design