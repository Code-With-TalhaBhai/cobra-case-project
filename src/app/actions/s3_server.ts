'use server'
import {S3Client,PutObjectCommand} from "@aws-sdk/client-s3"


const s3Client = new S3Client(
    {
        credentials:{
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
        }
    }
)

console.log('hitting the api')

export const uploadFile_to_server = async (formData:FormData) => {
    try {
      const fileKey = formData.get('file_key') as string
      const file = formData.get('file') as string
      const fileType = formData.get('file_type') as string
      const buffer = Buffer.from(file.split(',')[1],'base64')
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: fileKey,
        Body: buffer,
        ContentType: fileType
      }
      // Simple Upload
      const upload = await s3Client.send(
        new PutObjectCommand(params)
      );

      return {status:200,url:`https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com/${fileKey}`}
    } catch (err) {
        console.log(err);
        return {status:400,error:err}
    }
  };

