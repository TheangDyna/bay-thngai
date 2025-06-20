"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface IShareLinkProps {
  isOpenShareLink: boolean;
  onCloseShareLink: () => void;
}

const ShareLink: React.FC<IShareLinkProps> = ({
  isOpenShareLink,
  onCloseShareLink
}) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://ui.shadcn.com/docs/installation"
      );
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard."
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy the link. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <Dialog
        open={isOpenShareLink}
        onOpenChange={(open) => !open && onCloseShareLink()}
      >
        <DialogContent className="sm:max-w-md rounded-lg shadow-lg">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-lg font-bold text-gray-800">
              Share link
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <div className="space-y-2">
              <span className="text-sm text-gray-700">
                Share on social media to reach the highest traffic and share
                this product
              </span>
              <div className="flex items-center gap-4">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <img
                    src="/social-media/facebook.webp"
                    alt="facebook"
                    className="w-8 h-8"
                  />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <img
                    src="/social-media/messenger.webp"
                    alt="messenger"
                    className="w-8 h-8"
                  />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <img
                    src="/social-media/telegram.webp"
                    alt="telegram"
                    className="w-8 h-8"
                  />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <img
                    src="/social-media/tiktok.webp"
                    alt="tiktok"
                    className="w-8 h-8"
                  />
                </button>
              </div>
            </div>

            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-700">
                Or copy the link and share it anywhere
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue="https://ui.shadcn.com/docs/installation"
                    readOnly
                    className="text-gray-800 bg-gray-100 rounded-lg focus:ring focus:ring-gray-200"
                  />
                </div>
                <Button type="button" size="sm" onClick={handleCopy}>
                  <span className="sr-only">Copy</span>
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                className="w-full bg-gray-800 text-white hover:bg-gray-700"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareLink;
