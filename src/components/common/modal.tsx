import React from "react"
import { Dialog, DialogTrigger, ModalOverlay, Modal as RACModal } from "react-aria-components"

export default function Modal({
  open,
  onOpenChange,
  triggerButton,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerButton: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <DialogTrigger isOpen={open} onOpenChange={onOpenChange}>
      {triggerButton}
      <ModalOverlay className={"fixed inset-0 bg-neutral-100/30 backdrop-blur-xs"}>
        <RACModal className={"fixed inset-0 flex h-dvh w-dvw flex-col items-center pt-[10%]"}>
          <Dialog className="bg-canvas rounded-xl border-2 p-16 !outline-0">{children}</Dialog>
        </RACModal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
