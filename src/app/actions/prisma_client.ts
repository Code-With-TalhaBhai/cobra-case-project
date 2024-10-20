'use server'

import { db } from "@/db"


export const post_img = async(formData:FormData)=>{
    const width = Number(formData.get('width'))
    const height = Number(formData.get('height'))
    const url = formData.get('url')
    let cropped_url = formData.get('cropped_url')



    const configuration = await db.configuration.create({
    data: {
        width: width || 500,
        height: height || 500,
        imgUrl: url as string,
        croppedImgUrl: cropped_url as string
    }
    })

    return {configuration:configuration}
}