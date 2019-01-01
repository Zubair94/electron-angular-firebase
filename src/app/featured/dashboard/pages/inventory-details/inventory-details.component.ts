import { Component, OnInit } from '@angular/core';
import { Select } from 'src/app/models/select';
import { Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit {

  dtOptions: any = {};
  currentStore: string;
  lohSelect: Select[] = [
    {
      label: "All",
      value: "all"
    },
    {
      label: "Kids Time",
      value: "kids-time"
    },
    {
      label: "Teachers Time",
      value: "teachers-time"
    },
    {
      label: "Sputnique",
      value: "sputnique"
    },
    {
      label: "Porua",
      value: "porua"
    },
    {
      label: "Corporate",
      value: "corporate"
    }
  ];

  togumoguSelect: Select[] = [
    {
      label: "All",
      value: "all"
    },
    {
      label: "ToguMogu",
      value: "togumogu"
    },
    {
      label: "Baby Pixel",
      value: "baby-pixel"
    }
  ];

  currentSelect: Select[] = this.lohSelect;
  currentSelectValue: Select = null;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.chooseSelectMenu();
    this.dtOptions = {
      select: true
    };
    //console.log(this.currentStore);
  }

  chooseSelectMenu(){
    this.activatedRoute.queryParams.pipe(filter(params => params.dataStore)).subscribe(params => {
      //console.log(params);
      this.currentStore = params.dataStore;
      if(this.currentStore === "loh"){
        this.currentSelect = this.lohSelect;
      } else if(this.currentStore === "togumogu"){
        this.currentSelect = this.togumoguSelect;
      } else {
        this.router.navigate(['/dashboard/inventory-details'], { queryParams: { dataStore: 'loh' }});
      }
      //console.log(this.currentStore);
    });
  }

  test(){
    console.log("test");
  }
}
