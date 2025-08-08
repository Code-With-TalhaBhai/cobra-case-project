'use server'
import {S3Client,PutObjectCommand} from "@aws-sdk/client-s3"


const s3Client = new S3Client(
    {
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    }
)


console.log('hitting the api')
console.log('aws_access',process.env.AWS_ACCESS_KEY_ID)
console.log('secretAccessKey',process.env.AWS_SECRET_ACCESS_KEY)


export const uploadFile_to_server = async (formData:FormData) => {
    try {
      const fileKey = formData.get('file_key') as string
      const file = formData.get('file') as string
      // const file = formData.get('file') as Blob
      const fileType = formData.get('file_type') as string

    // if (!file || typeof file.arrayBuffer !== 'function' || (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg')) {
    //   throw new Error('Invalid file upload');
    // }

      const buffer = Buffer.from(file.split(',')[1],'base64')

      // const buffer = Buffer.from(await file.arrayBuffer())

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

      return {status:200,url:`https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${fileKey}`}
    } catch (err) {
        console.log(err);
        return {status:400,error:err}
    }
  };

