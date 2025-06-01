import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  router: {
    push: (path: string) => void;
  };
}

export default function LoginPopup({ open, setOpen, router }: LoginPopupProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Cần đăng nhập</DialogTitle>
          <DialogDescription>
            Bạn cần đăng nhập để truy cập tính năng này. Vui lòng đăng nhập hoặc
            đăng ký tài khoản.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            onClick={() => {
              setOpen(false);
              router.push("/login");
            }}
            className="w-full"
          >
            Đăng nhập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
