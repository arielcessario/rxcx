import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { AnimationBuilder, animate, style } from '@angular/animations';

@Directive({
  selector: '[appCollapse]'
})
export class CollapseDirective implements OnChanges {

  @Input('isOpen') isOpen: boolean = false;
  private _h: number = 0;

  constructor(private _builder: AnimationBuilder, private el: ElementRef) {

  }

  ngOnChanges(e) {
    // console.log(e.isOpen.currentValue);
    if (e.isOpen.previousValue == null) {

      return;
    }


    if (e.isOpen.currentValue) {
      this.open(this.el.nativeElement);
    } else {
      this.close(this.el.nativeElement);
    }



  }

  close(element: any) {
    const myAnimation = this._builder.build([
      style({ transform: 'scale(1,1)', height: '*', transformOrigin: '0 0' }),
      animate(500, style({ transform: 'scale(1,0)', height: 0 }))
    ])

    // then create a player from it
    const player = myAnimation.create(element);

    player.play();
  }

  open(element: any) {
    // console.log('entra');
    const myAnimation = this._builder.build([
      style({ transform: 'scale(1,0)', height: 0, transformOrigin: '0 0' }),
      animate(500, style({ transform: 'scale(1,1)', height: '100%' }))
    ])

    // then create a player from it
    const player = myAnimation.create(element);

    player.play();
  }

}
