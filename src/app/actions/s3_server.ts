'use server'
import {S3Client,PutObjectCommand, ListBucketsCommand} from "@aws-sdk/client-s3"


const s3Client = new S3Client(
    {
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    }
)

s3Client.send(new ListBucketsCommand({})).then((data)=>console.log(data))


console.log('hitting the api')


export const uploadFile_to_server = async (formData:FormData) => {
    try {
      const fileKey = formData.get('file_key') as string
      const file = formData.get('file') as string
      // const file = formData.get('file') as Blob
      const fileType = formData.get('file_type') as string

      console.log('file type is',fileType)

      // const buffer = Buffer.from(file.split(',')[1],'base64')
      const buffer = Buffer.from(file.replace(/^data:\w+\/[a-zA-Z+\-. ]+;base64,/, ''),'base64')

      console.log('converted to buffer')

      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileKey,
        Body: buffer,
        ContentType: fileType
      }
      
      // Simple Upload
      await s3Client.send(
        new PutObjectCommand(params)
      );

      // console.log('we have achieved')

      return {status:200,url:`https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${fileKey}`}
    } catch (err) {
        console.log('s3 error is',err);
        return {status:400,error:err}
    }
  };

