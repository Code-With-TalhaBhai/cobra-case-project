import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import type { Dispatch,SetStateAction } from "react"
import { Button, buttonVariants } from "./ui/button"

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

function LoginModal({isOpen,setIsOpen}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="absolute z-[99999]">
          <DialogHeader>
            <div className="relative mx-auto w-24 h-24 mb-2">
              <Image
                src='/snake-1.png'
                alt="snake image"
                className="object-contain"
                fill
              />
            </div>
            <DialogTitle>Login To Continue</DialogTitle>
            <DialogDescription className="text-base text-center py-2">
                  <span className="font-medium text-zinc-900">
                    Your configuration was saved!
                  </span>{' '}
                  Please login to create an account to complete your purchase.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
            <Button className={buttonVariants({variant: 'secondary'})}>Login</Button>
            <Button className={buttonVariants({variant: 'default'})}>Sign up</Button>
          </div>
        </DialogContent>
    </Dialog>
  )
}

export default LoginModal