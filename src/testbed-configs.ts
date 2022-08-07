import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { UrlSerializer } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { AppComponent } from "./app/app.component";
import { DetailService } from "./app/services/detail.service";
import { SQLiteService } from "./app/services/sqlite.service";

const testbedBase = {
  declarations: [AppComponent],
  providers: [
    { provide: SQLiteService, useClass: SQLiteService },
    { provide: DetailService, useClass: DetailService },
    { provide: UrlSerializer, useClass: UrlSerializer },
  ],
  imports: [IonicModule.forRoot()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
}

export default testbedBase;