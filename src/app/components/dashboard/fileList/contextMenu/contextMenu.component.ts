import { Component, OnInit, Input, HostBinding, ChangeDetectorRef, HostListener, Output, EventEmitter } from '@angular/core';
import { FileItem } from '../fileList.type';
import { FileUploadService } from '@shared/services/fileUpload.service';
import { FileListService } from '@shared/services/fileList.service';

@Component({
  selector: 'app-contextMenu',
  templateUrl: './contextMenu.component.html',
  styleUrls: ['./contextMenu.component.css']
})
export class ContextMenuComponent implements OnInit {
  @Input()
  set top(number: number) {
    this.styleTop = number;
    this.changeDetector.detectChanges();
  }
  @Input()
  set left(number: number) {
    this.styleLeft = number;
    this.changeDetector.detectChanges();
  }

  constructor(private changeDetector: ChangeDetectorRef, private fileUploadService: FileUploadService,
    private fileListService: FileListService) { }
  @Input() fileItems: Set<FileItem> = new Set();
  @Output() itemClicked = new EventEmitter();
  @Output() toggleStarClicked = new EventEmitter();
  @HostBinding('style.top.px')
  public styleTop = 0;
  @HostBinding('style.left.px')
  public styleLeft = 0;
  @HostListener('contextmenu', ['$event']) ContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  ngOnInit() {
  }
  public isOnlyFiles(): boolean {
    const tempArray = Array.from(this.fileItems);
    return tempArray.every(file => !file.isFolder);
  }
  public isOnlyFolders(): boolean {
    const tempArray = Array.from(this.fileItems);
    return tempArray.every(file => file.isFolder);
  }
  public downloadFiles() {
    this.fileUploadService.fileDownload(this.fileItems);
    this.itemClicked.emit();
  }
  public deleteFiles() {
    this.fileUploadService.moveToBin(this.fileItems).then(() => {
      this.fileItems.forEach(fileItem => {
        this.fileListService.deleteFromFileList(fileItem.hash);
      });
      this.itemClicked.emit();
    });
  }
  public setStar() {
    this.fileUploadService.setStarFiles(this.fileItems).then(() => {
      for (const fileItem of Array.from(this.fileItems)) {
        fileItem.star = !fileItem.star;
      }
      this.toggleStarClicked.emit();
      this.itemClicked.emit();
    });
  }
}
