import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faBell, faUserCircle, faEnvelope, faSearch, faChartArea, faUserPlus, faUpload, faNewspaper, faUserCog, faUsersCog, faChevronRight, faTable, faCertificate, faTrashAlt, faFolderPlus, faEdit, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashAlt);
library.add(faPlus);
library.add(faMinus);
library.add(faFolderPlus);
library.add(faEdit);

library.add(faUserCog);
library.add(faUsersCog);
library.add(faChevronRight)
library.add(faBars);
library.add(faBell);
library.add(faUserCircle);
library.add(faEnvelope);
library.add(faSearch);
library.add(faChartArea);
library.add(faUserPlus);
library.add(faUpload);
library.add(faNewspaper);
library.add(faTable);
library.add(faCertificate);
@NgModule({
  declarations: [],
  imports: [
    FontAwesomeModule
  ],
  exports:[
    FontAwesomeModule
  ]
})
export class FaIconModule { }
