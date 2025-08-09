import { db } from '@/db'
import { notFound } from 'next/navigation'
import React from 'react'
import ConfiguatorDesign from './ConfiguratorDesign'

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
  const configuration = await db.configuration.findUnique({
    where: { id: id as string },
  })

  if (!configuration){
    return notFound()
  }

  const {width,height,imgUrl} : any = configuration 

  return <ConfiguatorDesign configId={configuration.id} imageDimensions={{width,height}} imageUrl={imgUrl}/>
}

export default Design