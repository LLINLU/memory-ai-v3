import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
interface AddNodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
}
export const AddNodeDialog: React.FC<AddNodeDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave
}) => {
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ノードを追加</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">タイトル</label>
            <input id="title" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={title} onChange={e => onTitleChange(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">説明</label>
            <textarea id="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={description} onChange={e => onDescriptionChange(e.target.value)} />
          </div>
        </div>
        <div className="mb-4">
          <p className="underline text-sm text-blue-700">新しいノードの作成を手伝ってほしいです💬</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>キャンセル</Button>
          <Button onClick={onSave}>追加する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};