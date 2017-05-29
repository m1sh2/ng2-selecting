# Ng2-Selecting

## Setup

`app.module.ts`

```
import { NgModule } from '@angular/core';
import { SelectingModule } from 'ng2-selecting';

@NgModule({
  imports: [
    CommonModule,
    SelectingModule
  ],
  declarations: [
    AppComponent
  ]
})
export class CmpModule { }
```

`app.component.ts`

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ng2-selecting
      [items]="itemsArray"
      (itemsSelected)="handleItemsSelected($event)"
      >
    </ng2-selecting>
  `
})
export class AppComponent {
  
  // Your source array of data
  itemsArray: Array<any> = [
    'Hey!',
    'John',
    'How',
    'Are',
    'You',
    '?'
  ];

  constructor() { }

  // Your handle when you changing selection
  handleItemsSelected(itemsSelected) {
    console.log(itemsSelected); // ['Hey!', 'Are', '?']
  }
}
```

