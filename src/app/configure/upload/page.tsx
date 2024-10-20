'use client'

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Image as LucidImg,Loader2, MousePointerSquareDashed } from "lucide-react"
import { useState, useTransition } from "react"
import Dropzone,{FileRejection} from "react-dropzone"
import { uploadFile_to_server } from "@/app/actions/s3_server"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {v4 as uuidv4} from 'uuid'
import { post_img } from "@/app/actions/prisma_client"


interface upload_status {
    status:number,
    url:string | undefined,
    error:string | undefined
}


export default function Upload(){

    const [isDragOver,setIsDragOver] = useState<boolean>(false)
    const [uploadProgress,setUploadProgress] = useState<number>(0)
    const [isPending,startTransition] = useTransition() 
    const [isUploading,setIsUploading] = useState(false)
    const [upload_result,setUploadResult] = useState<upload_status | undefined>(undefined)
    const {toast} = useToast()
    const router = useRouter()
    const [check,setCheck] = useState<number>(0)


    const onDropRejected = (rejectedFiles:FileRejection[])=>{
        const [file] = rejectedFiles
        setIsDragOver(false)
        toast({
            title: `${file.file.type} type is not supported`,
            description: 'Please choose a PNG, JPG or JPEG image instead',
            variant: 'destructive'
        })
    }
    const onDropAccepted = (acceptedFiles:File[])=>{
        setIsDragOver(false)
        uploadFile(acceptedFiles[0])
    }

    const uploadFile = async(file:File)=>{
        const reader = new FileReader();
        const my_img = new Image()
        const configId = uuidv4()


        reader.onload = async(e: ProgressEvent<FileReader>)=>{
            const fileData = e.target?.result as string
            my_img.src = fileData
            setIsUploading(true) 

            // Sending FormData(supported types of server-actions)
            const formData = new FormData()
            formData.append('file_key',configId)
            formData.append('file',fileData)
            formData.append('file_type',file.type)

            // Return the file Url 
            const fileUrl = await uploadFile_to_server(formData)
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (event) =>{
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percentComplete);
                }
                else{
                    console.log('not computable')
                }
            }

            xhr.onload = async()=>{
                setUploadResult(fileUrl as upload_status)
                setIsUploading(false)
                startTransition(async()=>{
                if (xhr.status === 200){
                    const width = my_img.width
                    const height = my_img.height
                    const prismaForm = new FormData()
                    prismaForm.append('width',width.toString())
                    prismaForm.append('height',height.toString())
                    prismaForm.append('url',fileUrl?.url as string)
                    prismaForm.append('cropped_url',fileUrl?.url as string)
                    const configuration = await post_img(prismaForm)
                    console.log('configuration',configuration)
                    router.push(`/configure/design?id=${configId}`)
            }      
            else{
                toast({
                    title: `${file.name} is not uploaded`,
                    description: 'Check your internet connection, or try again',
                    variant: 'destructive'
                })
            }
        })
        }
        xhr.open('PUT',fileUrl.url as string)
        xhr.setRequestHeader("Content-Type",file.type)
        xhr.send(file)
        }
        reader.readAsDataURL(file)
    }

    

    
    return (
        <div className={cn('relative h-full flex-1 my-16 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
        {isDragOver:'ring-blue-900/25 bg-blue-900/10'})}>
            <div className="relative flex flex-1 flex-col items-center justify-center w-full">
                <Dropzone
                onDropRejected={onDropRejected}
                onDropAccepted={onDropAccepted}
                accept={{
                    "image/png": [".png"],
                    "image/jpeg": [".jpeg"],
                    "image/jpg": [".jpg"]
                }}
                onDragEnter={()=>setIsDragOver(true)}
                onDragLeave={()=>setIsDragOver(false)}
                >
                    {({getRootProps,getInputProps})=>(
                        <div {...getRootProps()} className="h-full w-full flex-1 flex flex-col items-center justify-center">
                            <label>
                                <input {...getInputProps()} />
                            </label>
                            {isDragOver ?
                                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" /> 
                                : isUploading || isPending ?
                                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2"/>
                                :
                                <LucidImg className="h-6 w-6 text-zinc-500 mb-2"/>
                            }   
                            <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                                {
                                    isUploading ?
                                    (
                                    <div className="flex flex-col items-center">
                                        <p>Uploading...</p>
                                        <Progress className="mt-2 w-40 h-2 bg-gray-300" value={uploadProgress} />
                                    </div>
                                    ) : isPending ? (
                                    <div className="flex flex-col items-center">
                                        <p>Redirecting, please wait...</p>
                                    </div>
                                    ) : isDragOver ? (
                                        <p>
                                            <span className="font-semibold">Drop file</span>
                                            {' '}to upload
                                        </p>
                                    ) : (
                                        <p>
                                            <span className="font-semibold">Click to upload</span>
                                        {' '}or drag and drop
                                        </p>
                                    )
                                }
                            </div>
                            {
                                isPending ? null :
                                (
                                    <p className="text-xs text-zinc-500">PNG,JPG, JPEG</p>
                                )
                            }
                        </div>

                    )}
                </Dropzone>
            </div>
        </div>
    )
}



