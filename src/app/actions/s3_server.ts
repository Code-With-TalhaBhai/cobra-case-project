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

export const uploadFile_to_server = async (formData:FormData) => {
    try {
      const fileName = formData.get('file_name') as string
      const file = formData.get('file') as string
      const fileType = formData.get('file_type') as string
      const buffer = Buffer.from(file.split(',')[1],'base64')
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: fileType
      }
      // Simple Upload
      const upload = await s3Client.send(
        new PutObjectCommand(params)
      );

      return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com/${fileName}`;
    } catch (err) {
      console.log(err);
    }
  };

