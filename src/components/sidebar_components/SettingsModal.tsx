import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogTitle, DialogHeader, DialogFooter, DialogContent, DialogClose, Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SettingsModal() {
  const [accessCode, setAccessCode] = useState("");

  const handleSave = () => {
    localStorage.setItem("accessCode", accessCode);
  };

  const accessCodeFromStorage = typeof window !== 'undefined' && window.localStorage 
    ? localStorage.getItem('accessCode') 
    : null;
  const placeholder = accessCodeFromStorage 
    ? accessCodeFromStorage.split('-')[0] + "-****" 
    : "Enter optional code";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <i className="fas fa-cog fa-2xl ml-1 mb-4 text-gray-600 dark:text-gray-400 drop-shadow hover:text-gray-700 dark:hover:text-gray-300" />
      </DialogTrigger>
      <DialogContent className="p-0">
        <div className="flex justify-between items-center p-6">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
        </div>
        <div className="grid gap-6 p-6">
          <div>
            <h3 className="font-semibold text-md">Invitation Code</h3>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="invitation-code"
                placeholder={placeholder}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-6">
          <DialogClose>
            <Button className="ml-auto" onClick={handleSave}>Save & Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
