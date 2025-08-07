'use client'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import React, { useRef, useState } from 'react'
import NextImage from 'next/image'
import { cn,formatPrice } from '@/lib/utils'
import {Rnd} from 'react-rnd'
import HandleComponent from '@/components/HandleComponent'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Description, Radio, RadioGroup } from '@headlessui/react'
import { COLORS,FINISHES,MATERIALS,MODELS } from '@/validators/option-validator'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react'
import { BASE_PRICE } from '@/config/products'
import { toast } from '@/hooks/use-toast'
import { uploadFile_to_server } from '@/app/actions/s3_server'
import { post_img } from '@/app/actions/prisma_client'
import { useMutation } from '@tanstack/react-query'
import { saveConfig,configArgs } from './actions'
import { useRouter } from 'next/navigation'



interface Props {
  configId: string
  imageUrl: string
  imageDimensions: {width:number,height:number}
}

const ConfiguratorDesign = ({configId,imageUrl,imageDimensions}: Props) => {
  const [options,setOptions] = useState<
  {
    color: (typeof COLORS)[number]
    // color: any
    model: (typeof MODELS.options)[number]
    materials: (typeof MATERIALS.options[number])
    finish: (typeof FINISHES.options[number])
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    materials: MATERIALS.options[0],
    finish: FINISHES.options[0]
  })

  const router = useRouter()

  const {mutate,isPending} = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async(args:configArgs)=>{
      await Promise.all([saveConfiguration(),saveConfig(args)])
    },
    onError: ()=>{
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again",
        variant: "destructive"
      })
    },
    onSuccess: ()=>{
      router.push(`/configure/preview?id=${configId}`)
    },
  })


  const [renderedDimension,setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4
  })

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const phoneCaseRef = useRef<HTMLDivElement>(null)

  
  // if we use `uploadThing` instead of `s3`
  // function base64ToBlob(base64Data:string,mimeType:string){
  //   const byteCharacters = Buffer.from(base64Data,'base64')
  //   return new Blob([byteCharacters],{type:mimeType})
  // }
  async function uploadImg(base64Data:string,mimeType:string){
      const formData = new FormData()
        formData.append('file_key',configId)
        formData.append('file',base64Data)
        formData.append('file_type',mimeType)
        const url = await uploadFile_to_server(formData)
        return url
    }

    async function update_crop_url(url:string){
      const formData = new FormData()
      formData.append('configId',configId)
      formData.append('cropped_url',url)
      await post_img(formData)
    }

  const saveConfiguration = async()=>{
    try {
      const {left:caseLeft,top:caseTop,width,height} = phoneCaseRef.current!.getBoundingClientRect()
      const {left:containerLeft,top:containerTop} = containerRef.current!.getBoundingClientRect()

      const leftOffset = caseLeft - containerLeft
      const topOffset = caseTop - containerTop

      const actualX = renderedPosition.x - leftOffset
      const actualY = renderedPosition.y - topOffset

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      const userImg = new Image()
      userImg.crossOrigin = 'anonymous'
      userImg.src = imageUrl

      await new Promise((resolve)=>(userImg.onload = resolve))
      ctx?.drawImage(userImg,actualX,actualY,renderedDimension.width,renderedDimension.height)

      const base64 = canvas.toDataURL()

      // if we use `s3`
      const {url} = await uploadImg(base64,'image/png')
      await update_crop_url(url as string)

      // if we use `uploadthing`
      // const base64Data = base64.split(",")[1]
      // const blob = base64ToBlob(base64Data,'image/png')
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'There was a problem saving your config, please try again.',
        variant: 'destructive'
      })
    }
  }


  return (
    <div className='relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20'>
      <div ref={containerRef} className='relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
        <div className='relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]'>
          <AspectRatio
          ref={phoneCaseRef}
          ratio={896/1831}
          className="pointer-events-none relative z-50 w-full aspect-[896/1831]"
           >
            <NextImage
              src="/phone-template.png"
              alt='phone-image'
              fill
              className='pointer-events-none z-50 select-none'
            />
          </AspectRatio>
          {/* Shadowing the background and case color */}
          <div className={cn('absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]')} />
          <div className={cn('absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]',`bg-${options.color.tw}`)}/>
        </div>

          {/* image inside case */}
          <Rnd default={
          {
            x:150,
            y:205,
            width:imageDimensions.width / 4,
            height:imageDimensions.height / 4
          }
        }
          onDragStop={(e,data)=>{
            const {x,y} = data
            setRenderedPosition({x,y})
          }}
          onResizeStop={(e,direction,ref,delta,pos)=>{
              const {x,y} = pos
              setRenderedDimension({
                width: parseInt(ref.style.width.slice(0,-2)), // to extract px e.g 23px
                height: parseInt(ref.style.height.slice(0,-2))
              })
              // console.log('width: ',ref.style.width," height: ",ref.style.height)
              setRenderedPosition({x,y})
            }}
          className='absolute z-20 border-[3px] border-primary'
          lockAspectRatio
          resizeHandleComponent={{
            topLeft: <HandleComponent/>,
            topRight: <HandleComponent/>,
            bottomLeft: <HandleComponent/>,
            bottomRight: <HandleComponent/>
          }}
          >
            <div className='relative w-full h-full'>
              <NextImage
                src={imageUrl}
                fill
                alt="Not Found"
                className='pointer-events-none'
              />
          </div>
        </Rnd>
      </div>

      <div className='h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white'>
          <ScrollArea className='relative flex-1 overflow-auto'>
          <div aria-hidden="true" className='absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none'/>
          <div className='px-8 pb-12 pt-8'>
            <h2 className='tracking-tight font-bold text-3xl'>
              Customize your case
            </h2>

            <div className='w-full h-px bg-zinc-200 my-6'/>
            <div className='relative mt-4 h-full flex flex-col justify-between'>
              <div className="flex flex-col gap-6">
              <RadioGroup value={options.color} onChange={(val)=> setOptions((prev)=>({
                ...prev,
                color: val,
            }))}>
              <Label>{options.color.label}</Label>
              <div className='mt-3 flex items-center gap-4 flex-wrap'>
                {COLORS.map((color)=>(
                  <Radio key={color.label} value={color}
                  className={({focus,checked})=>cn('relative flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',{[`border-${color.tw}`]:focus || checked})}
                  >
                    <span className={`bg-${color.tw} h-10 w-10 rounded-full border border-black border-opacity-10`}/>
                  </Radio>
                ))}
              </div>
              </RadioGroup>

              <div className='relative flex flex-col gap-3 w-full'>
                <Label>Modal</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" role='combobox' className='w-full justify-between '>
                        {options.model.label}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {
                      MODELS.options.map((model)=>(
                      <DropdownMenuItem 
                        key={model.label}
                        className={cn('flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',{
                          'bg-zinc-100': model.label === options.model.label
                        })}
                        onClick={()=>{
                          setOptions((prev)=> ({...prev,model}))
                        }}
                        >
                          <Check className={cn('mr-2 h-4 w-4',model.label === options.model.label ? 'opacity-100' : 'opacity-0')}/>
                          {model.label} 
                        </DropdownMenuItem>
                      ))
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Rename `options` to `selectableOptions` */}
              {[MATERIALS,FINISHES].map(({name,options:selectableOptions})=>(
                <RadioGroup key={name} value={options[name]}
                onChange={(val)=>{
                setOptions(prev=>({...prev,[name]:val})
              )}}
                >
                <Label>
                  {name.slice(0,1).toUpperCase() + name.slice(1)}
                </Label>

                <div className='mt-3 space-y-4'>
                  {
                    selectableOptions.map((option)=>(
                      <Radio key={option.value} value={option}
                      className={({focus,checked})=>cn('relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between',{
                        'border-primary': focus || checked
                      })}
                      >
                        <span className='flex items-center'>
                        <span className='flex flex-col text-sm'>
                          <Label className='font-medium text-gray-900'>
                            {option.label}
                          </Label>

                        {
                          option.description ? (
                            <Description as="span"
                            className='text-gray-500'
                            >
                              <span className='block sm:inline'>
                                {option.description}
                              </span>
                            </Description>
                          ) : null
                        }
                          </span>
                        </span>

                        <Description as='span' className='mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right'>
                          <span className='font-medium text-gray-900'>
                            {formatPrice(option.price / 100)}
                          </span>
                        </Description>
                      </Radio>
                    ))
                  }
                </div>
                </RadioGroup>
              ))}

              </div>
            </div>
          </div>
          </ScrollArea>


          <div className="w-full px-8 h-16 bg-white">
              <div className="h-px w-full bg-zinc-200">
              {/* <div className='w-full h-full flex justify-end items-center'> */}
              <div className='w-full flex gap-6 items-center'>
                <p className='font-medium whitespace-nowrap'>
                {formatPrice((BASE_PRICE + options.materials.price + options.finish.price) / 100)}
                </p>
                <Button 
                isLoading={isPending}
                disabled={isPending}
                onClick={()=>mutate({
                  color:options.color.value,
                  material:options.materials.value,
                  finish: options.finish.value,
                  model: options.model.value,
                  configId: configId
                  })}
                  size="sm" className='w-full'>
                  Continue
                  <ArrowRight className='h-4 w-4 ml-1.5 inline'/>
                </Button>
              </div>
              {/* </div> */}
              </div>
          </div>

      </div>
    </div>
  )
}

export default ConfiguratorDesign

