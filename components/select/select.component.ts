import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Uuid } from 'ng2-uuid';

@Component({
  selector: 'ng2-selecting',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  @ViewChild('selectBlockEl') private selectBlockEl: ElementRef;
  @ViewChild('filterInput') private filterInputEl: ElementRef;

  @Input() itemsSource: Array<any> = [];
  @Input() itemsSelectedSource: Array<any> = [];
  @Input() name: string = 'selecting';
  @Output() itemsSelected = new EventEmitter();

  private selectData: Array<any> = [];
  private selectDataOrigin: Array<any> = [];
  private selectedData: Array<any> = [];
  private isShowOptions: boolean = false;
  private isSelectInProgress: boolean = false;
  private isKeyDown: boolean = false;

  constructor(
    private uuid: Uuid
  ) { }

  ngOnInit() {
    this.selectData = [];
    this.selectedData = [];
    this.selectDataOrigin = [];
    this.setSelectData();
  }

  ngOnChanges(changes) {
    this.setSelectData();

    if (changes.itemsSelectedSource) {
      this.selectedData = [];
      this.selectData.forEach(option_ => {
        if (this.itemsSelectedSource.indexOf(option_.value) > -1) {
          this.select(option_);
        } else {
          this.unselect(option_);
        }
      });
    }
  }

  setSelectData() {
    this.itemsSource.forEach(item => {

      if (this.selectData.filter(option_ => option_.value === item).length) {
        return;
      }
      const option = {
        value: item,
        selected: false,
        id: this.uuid.v1(),
        hovered: false
      };

      this.selectData.push(option);
      this.selectDataOrigin.push(option);
    })
  }

  getSelectedValue() {
    let value = [];
    this.selectedData.forEach(option_ => {
      value.push(option_.value);
    });
    return value;
  }

  beforeSelect() {
    this.isSelectInProgress = true;
  }

  select(option) {
    this.filterInputEl.nativeElement.focus();

    option.selected = true;
    option.hovered = false;
    let selectedIndex = -1;

    this.selectDataOrigin.map((option_, index) => {
      if (option_.id === option.id) {
        option_.selected = true;
        selectedIndex = index + 1;
      }

      return option_;
    });

    this.selectData.forEach((option_, index) => {
      if (selectedIndex === index) {
        option_.hovered = true;
      }
    });

    this.selectedData.push(option);
    this.isSelectInProgress = false;

    this.itemsSelected.emit(this.getSelectedValue());
  }

  unselect(option) {
    option.selected = false;

    this.selectData.map(option_ => {
      if (option_.id === option.id) {
        option_.selected = false;
      }

      return option_;
    });

    this.selectDataOrigin.map(option_ => {
      if (option_.id === option.id) {
        option_.selected = false;
      }

      return option_;
    });

    this.selectedData = this.selectedData.filter(option_ => option_.id !== option.id);

    this.itemsSelected.emit(this.getSelectedValue());
  }

  filterSelectData(event) {
    const value = this.filterInputEl.nativeElement.value;

    if (!!this['key' + event.keyCode]) {
      this['key' + event.keyCode](event);

      if (event.keyCode !== 8) {
        return false;
      }
    }

    if (value) {
      this.selectData = this.selectDataOrigin.filter(option_ => {
        const condition = option_.value.toLowerCase().search(value.toLowerCase()) > -1;
        return condition;
      });
    } else {
      this.selectData = this.selectDataOrigin;
    }
  }

  focus() {
    if (!this.isShowOptions) {
      this.key40();
    }

    this.isShowOptions = true;
  }

  blur() {
    if (!this.isSelectInProgress) {
      this.selectData.map(option_ => {
        option_.hovered = false;
        return option_;
      });
      this.isShowOptions = false;
    }
  }

  over(option) {
    this.selectData = this.selectData.map((option_, index) => {
      if (option_.value === option.value) {
        option_.hovered = true;
      } else {
        option_.hovered = false;
      }
      return option_;
    });
  }

  out(option) {
    this.selectData = this.selectData.map((option_, index) => {
      if (option_.value === option.value) {
        option_.hovered = false;
      }
      return option_;
    });
  }

  keyDown(event) {
    if (event.keyCode !== 8 && !!this['key' + event.keyCode]) {
      event.preventDefault();
    }

    if (event.keyCode === 8 && this.filterInputEl.nativeElement.value.length === 1) {
      this.isKeyDown = true;
    }
  }

  key8() {
    if (this.filterInputEl.nativeElement.value || !this.selectedData.length || this.isKeyDown) {

    } else {
      let optionToUnSelect = this.selectedData.splice(this.selectedData.length - 1, 1)[0];

      if (optionToUnSelect) {
        this.unselect(optionToUnSelect);
      }
    }
    this.isKeyDown = false;
  }

  key13() {
    let optionToSelect;
    this.selectData.forEach((option_, index) => {
      if (option_.hovered && !option_.selected) {
        optionToSelect = option_;
        return;
      }
    });

    if (optionToSelect) {
      this.select(optionToSelect);
    }
  }

  key38() {
    const unSelectedData = this.selectData.filter(option_ => !option_.selected);
    let selectedIndex = unSelectedData.length - 1;
    
    unSelectedData.forEach((option_, index) => {
      if (option_.hovered) {
        selectedIndex = index;
        return;
      }
    });

    let selectedIndexNew = selectedIndex - 1;
    if (selectedIndexNew === -1) {
      selectedIndexNew = 0;
    }

    unSelectedData.map((option_, index) => {
      option_.hovered = index === selectedIndexNew;
      return option_;
    });

    return false;
  }

  key40() {
    let selectedIndex = -1;
    const unSelectedData = this.selectData.filter(option_ => !option_.selected);

    unSelectedData.forEach((option_, index) => {
      if (option_.hovered) {
        selectedIndex = index;
        return;
      }
    });

    let selectedIndexNew = selectedIndex + 1;
    if (selectedIndexNew === unSelectedData.length) {
      selectedIndexNew = 0;
    }

    unSelectedData.map((option_, index) => {
      option_.hovered = index === selectedIndexNew;
      return option_;
    });

    return false;
  }
}
