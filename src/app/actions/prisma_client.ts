'use server'

import { db } from "@/db"


export const post_img = async(formData:FormData)=>{
    const configId = formData.get('configId')
    
    if (!configId){
        const width = Number(formData.get('width'))
        const url = formData.get('url')
        const height = Number(formData.get('height'))
        const configuration = await db.configuration.create({
            data: {
            width: width || 500,
            height: height || 500,
            imgUrl: url as string,
        }
        })
        return {configuration:configuration}
    }
    else{
        let cropped_url = formData.get('cropped_url')
        const updatedConfiguration = await db.configuration.update({
            where:{
                id: configId as string
            },
            data: {
                croppedImgUrl: cropped_url as string
            }
        })
        return {configuration: updatedConfiguration}
    }
}