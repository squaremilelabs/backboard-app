import { useState } from "react"
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { interactive } from "@/styles/class-names"

export default function ConfirmationButton({
  onConfirm,
  helpText,
  confirmButtonText,
  isDestructive,
  children,
}: {
  onConfirm: () => void
  helpText: string
  confirmButtonText?: string
  isDestructive?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setIsOpen(false)
  }
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
      <ModalOverlay isDismissable className="fixed inset-0 z-60 bg-neutral-100/30 backdrop-blur-xs">
        <Modal
          isDismissable
          className="fixed inset-0 flex h-dvh w-dvw flex-col items-center pt-[10%]"
        >
          <Dialog className="bg-canvas flex w-300 flex-col gap-16 rounded-xl border-2 p-16 !outline-0">
            <p>{helpText}</p>
            <div className="flex justify-stretch gap-16">
              <Button
                onPress={() => setIsOpen(false)}
                className={twMerge(interactive(), "grow rounded-md py-8", "border")}
              >
                Cancel
              </Button>
              <Button
                onPress={handleConfirm}
                className={twMerge(
                  interactive(),
                  "grow rounded-md py-8 font-semibold",
                  isDestructive ? "bg-red-700 text-red-50" : "bg-neutral-600 text-neutral-50"
                )}
              >
                {confirmButtonText || "OK"}
              </Button>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
