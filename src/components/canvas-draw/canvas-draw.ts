import {Component, ViewChild, Renderer2} from '@angular/core';
import { Platform } from 'ionic-angular';
import {DragDropModule} from '@angular/cdk/drag-drop';

export enum EDIT_MODE {
  BRUSH = 1,
  IMAGE = 2
}

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDrawComponent {
  @ViewChild('topToolbar') topToolbar: any;
  @ViewChild('colorList') colorList: any;

  @ViewChild('myCanvas') canvas: any;
  @ViewChild('clipArt') clipArtView: any;

  canvasElement: any;
  lastX: number;
  lastY: number;

  currentColour: string = '#1abc9c';
  availableColours: any;
  colourButtonOpened = false;

  brushSize: number = 10;
  private selectedPicture: any = 'assets/twice'
  private pictureWidth = 760;
  private pictureHeight = 1400;
  private editMode = EDIT_MODE.BRUSH;
  EDIT_MODE = EDIT_MODE;

  constructor(public platform: Platform, public renderer: Renderer2) {
    console.log('Hello CanvasDraw Component');

    this.availableColours = [
      '#1abc9c'
    ];
  }

  ngOnInit(){
    const height = this.topToolbar._elementRef.nativeElement.offsetHeight;
    this.renderer.setStyle(this.colorList.nativeElement, 'margin-top',height + 'px');
  }

  ngAfterViewInit(){

    this.canvasElement = this.canvas.nativeElement;

    this.renderer.setAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setAttribute(this.canvasElement, 'height', this.platform.height() + '');

  }

  changeColour(colour){
    this.currentColour = colour;
    this.colourButtonOpened = false;
  }

  pickColour() {
    this.colourButtonOpened = this.colourButtonOpened == false;
  }

  insertImage() {
    // Change edit mode to Image
    this.editMode = EDIT_MODE.IMAGE;

    // Clear Current Image
    this.canvasElement.getContext('2d').clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // Fill background
    this.canvasElement.getContext('2d').fillStyle = "rgba(255, 255, 255, 1)";
    this.canvasElement.getContext('2d').fillRect(0, 0, this.canvasElement.getContext('2d').width,
      this.canvasElement.getContext('2d').height);

    // Display the Image
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = (event) => {
      this.canvasElement.getContext('2d').drawImage(img, this.canvasElement.width/2 - img.width/2,
        this.canvasElement.height/2 - img.height/2);
    };
    img.src=this.selectedPicture;
  }

  changeSize(size){
    this.brushSize = size;
  }

  handleStart(ev){

    this.lastX = ev.touches[0].pageX;
    this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev){
    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY;
    if (this.editMode == EDIT_MODE.BRUSH) {
      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();
      ctx.strokeStyle = this.currentColour;
      ctx.lineWidth = this.brushSize;
      ctx.stroke();
    } else if (this.editMode == EDIT_MODE.IMAGE) {
      let marginLeft = this.clipArtView.nativeElement.style.marginLeft ? this.clipArtView.nativeElement.style.marginLeft.replace('px', '') : 0;
      let marginTop = this.clipArtView.nativeElement.style.marginTop ? this.clipArtView.nativeElement.style.marginTop.replace('px', '') : 0;
      let leftMarginNew = '';
      let topMarginNew = '';
      if (this.lastX > currentX) {
        leftMarginNew = (parseInt(marginLeft) - (currentX / 10)) + 'px';
      } else {
        leftMarginNew = (parseInt(marginLeft) + (currentX / 10)) + 'px';
      }

      if (this.lastY > currentY) {
        topMarginNew = (parseInt(marginTop) - (currentY / 10)) + 'px';
      } else {
        topMarginNew = (parseInt(marginTop) + (currentY / 10)) + 'px';
      }
      console.log(leftMarginNew + ' ' + topMarginNew);
      this.renderer.setStyle(this.clipArtView.nativeElement, 'margin-left', leftMarginNew);
      this.renderer.setStyle(this.clipArtView.nativeElement, 'margin-top', topMarginNew);

    }
    this.lastX = currentX;
    this.lastY = currentY;
  }

  clearCanvas(){
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

}
